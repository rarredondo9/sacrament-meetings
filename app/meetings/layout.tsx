import Link from "next/link";

export default function MeetingsLayout({ children }: {children: React.ReactNode }) {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10 print:max-w-none print:p-0">
            <nav 
            aria-label="Meetings"
            className="mb-8 flex flex-wrap gap-6 border-b border-brand-light pb-4 print:hidden"
        >
            <Link href="/meetings" className="font-semibold text-brand hover:underline">
            All Meetings
            </Link>
            <Link href="/meetings/current" className="font-semi-bold text-brand hover:underline">
            This Sunday&apos;s Program
            </Link>
        </nav>
        {children}
        </main>
    );
}