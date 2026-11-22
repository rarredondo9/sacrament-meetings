import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";

export default function CreateMeetingPage() {
    return (
        <section>
            <h1 className="mb-6 text-3xl font-bold text-brand">Plan a New Meeting</h1>
            <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
        </section>
    );
}