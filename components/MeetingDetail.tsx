import type { Hymn, SacramentMeeting } from "@/lib/types";
import { formatMeetingDate, meetingTypeLabels } from "@/lib/format";

interface MeetingDetailProps {
    meeting: SacramentMeeting;
}

interface ProgramItemProps {
    label: string;
    value: string;
}

function hymnText(hymn: Hymn): string {
    return `#${hymn.number} - ${hymn.title}`;
}

function ProgramItem({ label, value }: ProgramItemProps) {
    return (
        <div className="flex flex-col ga-1 border-b border-brand-light py-3 sm:flex-row sm:justify-between">
            <dt className="font-semibold">{label}</dt>
            <dd className="text-muted sm:text-right">{value}</dd>
        </div>
    );
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
    const isSacramentMeeting =
        meeting.meetingType === 'regular' || meeting.meetingType === 'testimony';
    
    return (
        <article className="rounded-lg border border-brand-light bg-white p-6 shadow-sm print:border-o print:p-0 print:shadow-none">
            <header className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                    {meetingTypeLabels[meeting.meetingType]}
                </p>
                <h1 className="mt-1 text-3xl font-bold">{formatMeetingDate(meeting.date)}</h1>
            </header>

            <dl>
                <ProgramItem label="Presiding" value={meeting.presiding} />
                <ProgramItem label="Conducting" value={meeting.conducting} />
            </dl>

            {meeting.announcements && meeting.announcements.length > 0 && (
                <section className="mt-6">
                    <h2 className="mb-2 text-xl font-bold text-brand">Announcements</h2>
                    <ul className="list-disc pl-6 text-muted">
                        {meeting.announcements.map((announcement) => (
                            <li key={announcement}>{announcement}</li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="mt-6">
                <h2 className="mb-2 text-xl font-bold text-brand">Program</h2>
                <dl>
                    <ProgramItem label="Opening Hymn" value={hymnText(meeting.openingHymn)} />
                    <ProgramItem label="Opening Prayer" value={meeting.openingPrayer} />
                    <ProgramItem label="Ward Business"
                        value={
                            meeting.wardBusiness.length > 0 
                                ? meeting.wardBusiness.map((item) => item.description).join('; ')
                                : 'None'
                        }
                    />
                    <ProgramItem label="Stake Business" value={meeting.stakeBusiness ? 'Yes' : 'No'} />
                    {isSacramentMeeting && (
                        <ProgramItem label="Sacrament Hymn" value={hymnText(meeting.sacramentHymn)} />
                    )}
                </dl>
            </section>

            <section className="mt-6">
                <h2 className="mb-2 text-xl font-bold text-brand">Speakers and Music</h2>
                {meeting.speakers.length == 0 ? (
                    <p className="text-muted">
                        {meeting.meetingType === 'testimony'
                            ? 'Testimonies from the congregation'
                            : 'No speakers assigned yet.'}
                    </p>
                ) : (
                    <ol>
                        {meeting.speakers.map((item, index) => (
                            <li 
                            key={`${item.name}-${index}`}
                            className="flex flex-col gap-1 border-b border-brand-light py-3 sm:flex-row sm:justify-between"
                        >
                            <span className="font-semibold">
                                {item.type === 'musical-number' ? 'Musical Number' : 'Speaker'}: {item.name}
                            </span>
                            <span className="text-mutes">{item.topic}</span>
                        </li>
                        ))}
                    </ol>
                )} 
            </section>

            <section className="mt-6">
                <h2 className="mb-2 text-xl font-bold text-brand">Closing</h2>
                <dl>
                    <ProgramItem label="Closing Hymn" value={hymnText(meeting.closingHymn)} />
                    <ProgramItem label="Closing Prayer" value={meeting.closingPrayer} />
                </dl>
            </section>
        </article>
    );
}
