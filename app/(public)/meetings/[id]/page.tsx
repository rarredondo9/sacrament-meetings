import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import PrintButton from "@/components/PrintButton";
import { getBaseUrl } from "@/lib/api";
import type { SacramentMeeting } from "@/lib/types";

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
