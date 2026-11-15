import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export default async function MeetingsPage(props: {
    searchParams?: Promise<{ query?: string; page?: string }>;
}) {
    const searchParams = await props.searchParams;

    const query = (searchParams?.query ?? '').trim().slice(0, 50);
    const requestedPage = Number(searchParams?.page);
    const currentPage =
        Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

        const [meetings, totalPages] = await Promise.all([
            getMeetings(query, currentPage),
            getMeetingsTotalPages(query),
        ]);

        return (
            <section>
                <h1 className="mb-6 text=3xl font-bold text-brand"> Sacrament Meeting Programs</h1>

                <MeetingSearch />

                {meetings.length === 0 ? (
                    <p className="text-muted">
                        {query ? `No meetings match "${query}".`: 'No meetings found.'}
                    </p>
                ): (
                    <ul className="grid gap-4 sm:grid-cols-2">
                        {meetings.map((meeting) => (
                            <li key={meeting.id}>
                                <MeetingCard meeting={meeting} />
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination totalPages={totalPages} />
            </section>
        );
}