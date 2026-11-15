import type { MeetingType } from "./types";

export function formatMeetingDate(isoDate: string): string {
    return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
}

export const meetingTypeLabels: Record<MeetingType, string> = {
    testimony: 'Fast and Testimony Meeting',
    regular: 'Sacrament Meeting', 
    stake: 'Stake Conference',
    general: 'General Conference',
};