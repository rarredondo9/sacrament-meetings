import { NextRequest, NextResponse } from "next/server";
import { getMeetingsByDate } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface ErrorResponse {
    error: string;
}

export async function GET(
    request: NextRequest
): Promise<NextResponse<SacramentMeeting[] | ErrorResponse>> {
    const date = request.nextUrl.searchParams.get('date');

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({error: 'Invalid date. Use YYYY-MM-DD.' }, { status: 400 });
    }

    try {
        const meetings = await getMeetingsByDate(date);
        return NextResponse.json(meetings);
    } catch {
        return NextResponse.json({ error: 'Could not load meetings' }, { status: 500 });
    }
}