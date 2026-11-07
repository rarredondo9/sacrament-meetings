import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

function getMostRecentSunday(): string {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Phoenix' });

    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - date.getUTCDay());

    return date.toISOString().slice(0,10);
}

export default async function CurrentMeetingPage() {
    await connection();

    const sunday = getMostRecentSunday();
    const [meeting] = getMeetings(sunday);

    if (meeting) {
        redirect(`/meetings/${meeting.id}`);
    }

    redirect('/meetings');
}