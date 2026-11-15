import { connection } from "next/server";

export default async function CurrentDate() {
    await connection(); 

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Phoenix',
    });

    return <p className="text-sm opacity-90">{today}</p>;
}