import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import { formatMeetingDate, meetingTypeLabels } from "@/lib/format";

interface MeetingCardProps {
    meeting: SacramentMeeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
    const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;

    return (
        <article className="h-full rounded-lg border border-brand-light bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                {meetingTypeLabels[meeting.meetingType]}
            </p>
            <h2 className="mt-1 text-xl font-bold">{formatMeetingDate(meeting.date)}</h2>
            <p className="mt-2 text-muted">Conducting: {meeting.conducting}</p>
            <p className="text-muted">
                {speakerCount == 0
                    ? 'Testimonies from congregation'
                    : `${speakerCount} speaker${speakerCount === 1 ? '' : 's'}`}
            </p>
            <Link 
                href={`/meetings/${meeting.id}`}
                className="mt-4 inline-block font-semibold text-brand hover:underline"
            >
                View Program
                <span className="sr-only"> for {formatMeetingDate(meeting.date)}</span>
            </Link>
        </article>
    );
}