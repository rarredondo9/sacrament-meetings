'use client';

import Link from "next/link";
import { useActionState } from "react";
import type { MeetingFormState, MeetingFormValues } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";
import { meetingTypeLabels } from "@/lib/format";
import { PreviewPropsManifest } from "next/dist/build";
import { init } from "next/dist/compiled/webpack/webpack";

interface MeetingFormProps {
    action: (prevState: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;
    meeting?: SacramentMeeting;
    submitLabel: string;
}

const initialState: MeetingFormState = { message: null, errors: {} };

const inputClass =
'w-full rounded-md border border-muted bg-white px-3 py-2 text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand';

function toFromValues(meeting?: SacramentMeeting): MeetingFormValues {
    return {
        date: meeting?.date ?? '',
        meetingType: meeting?.meetingType ?? 'regular',
        presiding: meeting?.presiding ?? '',
        conducting: meeting?.conducting ?? '',
        announcements: meeting?.announcements?.join('\n') ?? '',
        openingHymnNumber: meeting ? String(meeting.openingHymn.number) : '',
        openingHymnTitle: meeting?.openingHymn.title ?? '',
        openingPrayer: meeting?.openingPrayer ?? '',
        wardBusiness: meeting?.wardBusiness.map((item) => item.description).join('\n') ?? '',
        stakeBusiness: meeting?.stakeBusiness ? 'on' : '',
        sacramentHymnNumber: meeting ? String(meeting.sacramentHymn.number) : '',
        sacramentHymnTitle: meeting?.sacramentHymn.title ?? '',
        program:
            meeting?.speakers
                .map(
                    (item) => 
                        `${item.type === 'musical-number' ? 'Music: ' : ''}${item.name}${item.topic ? ` | ${item.topic}` : ''}`
                )
                .join('\n') ?? '',
        closingHymnNumber: meeting ? String(meeting.closingHymn.number) : '',
        closingHymnTitle: meeting?.closingHymn.title ?? '',
        closingPrayer: meeting?.closingPrayer ?? '',
    };
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
    return (
        <div id={id} aria-live="polite" aria-atomic="true">
            {errors?.map((error) => (
                <p key={error} className="mt-1 text-sm text-red-700">
                    {error}
                </p>
            ))}
        </div>
    );
}

interface FieldProps {
    name: keyof MeetingFormValues;
    label: string;
    defaultValue: string;
    errors?: string[];
    hint?: string;
}

function TextField({ name, label, defaultValue, errors, hint, type = 'text' }: FieldProps & { type?: string}) {
    const errorId = `${name}-error`;
    const hintId = `${name}-hint`;
    return (
        <div>
            <label htmlFor={name} className="mb-1 block font-semibold">{label}</label>
            {hint && <p id={hintId} className="mb-1 text-sm text-muted">{hint}</p>}
            <input 
            id={name}
            name={name}
            type={type}
            min={type === 'number' ? 1 : undefined}
            defaultValue={defaultValue}
            aria-describedby={hint ? `${hintId} ${errorId}` : errorId}
            aria-invalid={Boolean(errors)}
            className={inputClass}
        />
        <FieldErrors id={errorId} errors={errors} />
        </div>
    );
}

function TextAreaField({ name, label, defaultValue, errors, hint }: FieldProps) {
    const errorId = `${name}-error`;
    const hintId = `${name}-hint`;
    return (
        <div>
            <label htmlFor={name} className="mb-1 block font-semibold">{label}</label>
            {hint && <p id={hintId} className="mb-1 text-sm text-muted">{hint}</p>}
            <textarea 
            id={name}
            name={name}
            rows={3}
            defaultValue={defaultValue}
            aria-describedby={hint ? `${hintId} ${errorId}` : errorId}
            aria-invalid={Boolean(errors)}
            className={inputClass}
        />
        <FieldErrors id={errorId} errors={errors} />
        </div>
    );
}

export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialState);

    const values = state.values ?? toFromValues(meeting);
    const errors = state.errors ?? {};

    return (
        <form action={formAction} className="max-w-2xl space-y-6" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="date" label="Date" type="date" defaultValue={values.date} errors={errors.date} />

                <div> 
                    <label htmlFor="meetingType" className="mb-1 block font-semibold">Meeting type</label>
                    <select
                        id="meetingType"
                        name="meetingType"
                        defaultValue={values.meetingType}
                        aria-describedby="meetingType-error"
                        aria-invalid={Boolean(errors.meetingType)}
                        className={inputClass}
                    >
                        {Object.entries(meetingTypeLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                    <FieldErrors id="meetingType-error" errors={errors.meetingType} />
                </div>

                <TextField name="presiding" label="Presiding" defaultValue={values.presiding} errors={errors.presiding} />
                <TextField name="conducting" label="Conducting" defaultValue={values.conducting} errors={errors.conducting} />
            </div>

            <TextAreaField
                name="announcements"
                label="Announcements (optional)"
                hint="One announcement per line."
                defaultValue={values.announcements}
                errors={errors.announcements}
            />

            <fieldset className="grid gap-4 sm:grid-cols-[8rem_fr]">
                <legend className="mb-2 text-lg font-bold text-brand">Opening hymn</legend>
                <TextField name="openingHymnNumber" label="Number" type="number" defaultValue={values.openingHymnNumber} errors={errors.openingHymnNumber} />
                <TextField name="openingHymnTitle" label="Title" defaultValue={values.openingHymnTitle} errors={errors.openingHymnTitle} />
            </fieldset>

            <TextField name="openingPrayer" label="Opening prayer" defaultValue={values.openingPrayer} errors={errors.openingPrayer} />

            <TextAreaField
                name="wardBusiness"
                label="Ward business (optional)"
                hint="One item per line, for example: Substaining of a new Primary president."
                defaultValue={values.wardBusiness}
                errors={errors.wardBusiness}
            />

            <div className="flex items-center gap-3">
                <input 
                    id="stakeBusiness"
                    name="stakeBusiness"
                    type="checkbox"
                    defaultChecked={values.stakeBusiness === 'on'}
                    className="h-5 w-5 accent-brand"
                />
                <label htmlFor="stakeBusiness" className="font-semibold">Stake business will be presented</label>
            </div>

            <fieldset className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                <legend className="mb-2 text-lg font-bold text-brand">Sacrament hymn</legend>
                <TextField name="sacramentHymnNumber" label="Number" type="number" defaultValue={values.sacramentHymnNumber} errors={errors.sacramentHymnNumber} />
                <TextField name="sacramentHymnTitle" label="Title" defaultValue={values.sacramentHymnTitle}  errors={errors.sacramentHymnTitle} />
            </fieldset>

            <TextAreaField
                name="program"
                label="Speakers and musical numbers (optional)"
                hint='One per line, in order. Speaker: "Sister Brown | Faith in Jesus Christ". Musical Number: "Music: Primary children | I am a Child of God".'
                defaultValue={values.program}
                errors={errors.program}
            />

            <fieldset className="grid gap-4 sm:grids-cols-[8rem_1fr]">
                <legend className="mb-2 text-lg font-bold text-brand">Closing Hymn</legend>
                <TextField name="closingHymnNumber" label="Number" type="number" defaultValue={values.closingHymnNumber} errors={errors.closingHymnNumber} />
                <TextField name="closingHymnTitle" label="Title" defaultValue={values.closingHymnTitle} errors={errors.closingHymnTitle} />
            </fieldset>

            <TextField name="closingPrayer" label="Closing Prayer" defaultValue={values.closingPrayer} errors={errors.closingPrayer} />

            <div aria-live="polite" aria-atomic="true">
                {state.message ? <p className="font-semibold text-red-700">{state.message}</p> : null}
            </div>

            <div className="flex gap-3">
                <button 
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-brand px-5 py-2 font-semibold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? 'Saving...' : submitLabel}
                </button>
                <Link
                    href="/meetings"
                    className="rounded-md border border-brand px-5 py-2 font-semibold text-brand hover:bg-brand-light"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}