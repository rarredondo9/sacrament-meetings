import { notFound } from "next/navigation";
import MeetingForm from "@/components/MeetingForm";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";
import { formatMeetingDate } from "@/lib/format";

export default async function EditMeetingPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId < 1) {
        notFound();
    }

    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
        notFound();
    }

    const updateMeetingWithId = updateMeeting.bind(null, id);

    return (
        <section>
            <h1 className="mb-2 text-3xl font-bold text-brand">Edit Meeting</h1>
            <p className="mb-6 text-muted">{formatMeetingDate(meeting.date)}</p>
            <MeetingForm action={updateMeetingWithId} meeting={meeting} submitLabel="Save Changes" />
        </section>
    )
}