import Link from "next/link";

export default function MeetingNotFound() {
    return (
        <div className="mz-auto mt-12 max-w-xl rounded-lg border border-brand-light bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-brand">Meeting not found.</h1>
            <p className="mt-3 text-muted">
                We couldn&apos;t find a meeting with that id. It may have been deleted.
            </p>
            <div className="mt-6 flex justify-center">
                <Link
                    href="/meetings"
                    className="rounded-md border border-brand px-4 py-2 font-semibold text-brand hover:bg-brand-light"
                >
                    Back to Meetings
                </Link>
            </div>
        </div>
    );
}