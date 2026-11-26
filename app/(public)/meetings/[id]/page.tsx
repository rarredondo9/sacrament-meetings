import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import PrintButton from "@/components/PrintButton";
import { getBaseUrl } from "@/lib/api";
import type { SacramentMeeting } from "@/lib/types";
import { Metadata } from "next";
import { getMeetingById } from "@/lib/meetings-db";
import { formatMeetingDate, meetingTypeLabels } from "@/lib/format";

export async function generateMetadata(props: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await props.params;
    const meetingId = Number(id);
    const meeting = Number.isInteger(meetingId) && meetingId > 0 ? await getMeetingById(meetingId) : null;

    if (!meeting) {
        return { title: 'Meeting Not Found' };
    }

    const date = formatMeetingDate(meeting.date);
    return { 
        title: `${meetingTypeLabels[meeting.meetingType]}, ${date}`,
        description: `Program for the ${meetingTypeLabels[meeting.meetingType].toLowerCase()} on ${date}.`,
    };
}

export default async function MeetingPage({
    params,
}: {
    params: Promise<{ id: string}>;
}) {
    const { id } = await params;
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/meetings/${encodeURIComponent(id)}`, { 
        cache: 'no-store',
    });

    if (response.status === 400 || response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error('Could not load this meeting.');
    }

    const meeting: SacramentMeeting = await response.json();

    return (
        <>
            <div className="mb-6 flex justify-end print:hidden">
                <PrintButton />
            </div>
            <MeetingDetail meeting={meeting} />
        </>
    );
}
