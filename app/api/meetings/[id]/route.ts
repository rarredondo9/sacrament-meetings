import { NextRequest, NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface ErrorResponse {
    error: string;
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SacramentMeeting | ErrorResponse>> {

    const { id } = await params;
    const meetingId = Number(id);

    if (!Number.isInteger(meetingId) || meetingId < 1) {
        return NextResponse.json({ error: 'Invalid Meeting Id' }, { status: 400 });
    }

    const meeting = getMeetingById(meetingId);

    if (!meeting) {
        return NextResponse.json({ error: 'Meeting not found'}, { status: 404 });
    }

    return NextResponse.json(meeting);
}