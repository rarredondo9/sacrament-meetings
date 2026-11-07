import MeetingCard from "@/components/MeetingCard";
import { getBaseUrl } from "@/lib/api";
import type { SacramentMeeting } from "@/lib/types";

export default async function MeetingsPage() {
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('Could not load meetings.');
    }

    const meetings: SacramentMeeting[] = await response.json();
    const sortedMeetings = [...meetings].sort((a, b) => a.date.localeCompare(b.date));

    return (
        <section>
            <h1 className="mb-6 text-3xl font-bold text-brand">Sacrament Meeting Programs</h1>
            {sortedMeetings.length === 0 ? (
                <p className="text-muted">No meetings found.</p>
        ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
                {sortedMeetings.map((meeting) => (
                    <li key={meeting.id}>
                        <MeetingCard meeting={meeting} />
                    </li>
                ))}
            </ul>
        )}
        </section>
    );
}