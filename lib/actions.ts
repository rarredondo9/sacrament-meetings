'use server';

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as db from '@/lib/meetings-db';
import type { SpeakerItem } from "@/lib/types";

function lines(text: string): string[] {
    return text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}

function parseProgram(text: string): SpeakerItem[] {
    return lines(text).map((line) => {
        const isMusic = /^music:/i.test(line);
        const rest = isMusic ? line.replace(/^music:/i, '').trim() : line;
        const [name, ...topicParts] = rest.split('|');
        return {
            name: name.trim(),
            topic: topicParts.join('|').trim(),
            type: isMusic ? 'musical-number' : 'speaker',
        };
    });
}

function isDuplicateDate(error: unknown): boolean {
    return (
        typeof error === 'object' && 
        error !== null && 
        'code' in error && 
        (error as { code?: string }).code === '23505'
    );
}

function toMeetingId(id: string | number): number {
    const meetingId = Number(id);
    if (!Number.isInteger(meetingId) || meetingId < 1) {
        throw new Error('Invalid meeting id.');
    }
    return meetingId;
}

const requiredText = (label: string) =>
    z.string().trim().min(2, `${label} must be at least 2 characters.`);

const hymnNumber = (label: string) => 
    z.coerce
        .number()
        .int(`${label} number must be a whole number.`)
        .min(1, `Enter the ${label.toLowerCase()} number.`);

const MeetingFormSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'),
    meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
        message: 'Choose a meeting type.',
    }),
    presiding: requiredText('Presiding'),
    conducting: requiredText('Conducting'),
    announcements: z.string(),
    openingHymnNumber: hymnNumber('Opening hymn'),
    openingHymnTitle: requiredText('Opening Hymn Title'),
    openingPrayer: requiredText('Opening Prayer'),
    wardBusiness: z.string(),
    sacramentHymnNumber: hymnNumber('Sacrament hymn'),
    sacramentHymnTitle: requiredText('Sacrament hymn title'),
    program: z
        .string()
        .refine(
            (text) => parseProgram(text).every((item) => item.name.length > 0),
            'Each line needs a name, like "Sister Brown | Faith in Jesus Christ".'
        ),
    closingHymnNumber: hymnNumber('Closing Hymn'),
    closingHymnTitle: requiredText('Closing hymn title'),
    closingPrayer: requiredText('Closing prayer'),
});

export type MeetingFormValues = {
    date: string;
    meetingType: string;
    presiding: string;
    conducting: string;
    announcements: string;
    openingHymnNumber: string;
    openingHymnTitle: string;
    openingPrayer: string;
    wardBusiness: string;
    stakeBusiness: string;
    sacramentHymnNumber: string;
    sacramentHymnTitle: string;
    program: string;
    closingHymnNumber: string;
    closingHymnTitle: string;
    closingPrayer: string;
};

export type MeetingFormState = {
    errors?: Partial<Record<keyof MeetingFormValues, string[]>>;
    message?: string | null;
    values?: MeetingFormValues;
};

function validateMeetingForm(formData: FormData) {
    const field = (name: keyof MeetingFormValues) => String(formData.get(name) ?? '');

    const values: MeetingFormValues = {
        date: field('date'),
        meetingType: field('meetingType'),
        presiding: field('presiding'),
        conducting: field('conducting'),
        announcements: field('announcements'),
        openingHymnNumber: field('openingHymnNumber'),
        openingHymnTitle: field('openingHymnTitle'),
        openingPrayer: field('openingPrayer'),
        wardBusiness: field('wardBusiness'),
        stakeBusiness: field('stakeBusiness'),
        sacramentHymnNumber: field('sacramentHymnNumber'),
        sacramentHymnTitle: field('sacramentHymnTitle'),
        program: field('program'),
        closingHymnNumber: field('closingHymnNumber'),
        closingHymnTitle: field('closingHymnTitle'),
        closingPrayer: field('closingPrayer'),
    };

    const validated = MeetingFormSchema.safeParse(values);

    if (!validated.success) {
        return {
            ok: false as const, 
            state: {
                errors: validated.error.flatten().fieldErrors,
                message: 'Missing or invalid fields. Please fix the errors below.',
                values,
            },
        };
    }

    const d = validated.data;
    const data: db.MeetingInput = {
        date: d.date,
        meetingType: d.meetingType,
        presiding: d.presiding,
        conducting: d.conducting,
        announcements: lines(d.announcements),
        openingHymn: { number: d.openingHymnNumber, title: d.openingHymnTitle },
        openingPrayer: d.openingPrayer,
        wardBusiness: lines(d.wardBusiness).map((description) => ({ description })),
        stakeBusiness: values.stakeBusiness === 'on',
        sacramentHymn: { number: d.sacramentHymnNumber, title: d.sacramentHymnTitle },
        speakers: parseProgram(d.program),
        closingHymn: { number: d.closingHymnNumber, title: d.closingHymnTitle },
        closingPrayer: d.closingPrayer,
    };

    return { ok: true as const, values, data };
}

export async function createMeeting(
    prevState: MeetingFormState,
    formData: FormData
): Promise<MeetingFormState> {
    const result = validateMeetingForm(formData);
    if (!result.ok) return result.state;

    try {
        await db.addMeeting(result.data);
    } catch (error) {
        console.error('Database error while creating meeting:', error);
        if (isDuplicateDate(error)) {
            return {
                errors: { date: ['A meeting is already planned for this date.'] },
                message: 'Please choose a different date.',
                values: result.values,
            };
        }
        throw new Error('Failed to create the meeting. Please try again later.');
    }

    revalidatePath('/meetings');
    redirect('/meetings');
}

export async function updateMeeting(
    id: string,
    prevState: MeetingFormState, 
    formData: FormData
): Promise<MeetingFormState> {
    const meetingId = toMeetingId(id);
    const result = validateMeetingForm(formData);
    if (!result.ok) return result.state;

    let found = false;
    try {
        found = await db.updateMeeting(meetingId, result.data);
    } catch (error) {
        console.error('Database error while updating meeting:', error);
        if(isDuplicateDate(error)) {
            return {
                errors: { date: ['Another meeting is already planned for this date.'] },
                message: 'Please choose a different date.',
                values: result.values,
            };
        }
        throw new Error('Failed to update the meeting. Please try again later.');
    }

    if (!found) {
        throw new Error('That meeting no longer exists.');
    }

    revalidatePath('/meetings');
    revalidatePath(`/meetings/${meetingId}`);
    redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
    const meetingId = toMeetingId(id);

    try {
        await db.deleteMeeting(meetingId);
    } catch (error) {
        console.error('Database error while deleting meeting', error);
        throw new Error('Failed to delete the meeting. Please try again later.');
    }

    revalidatePath('/meetings');
}
