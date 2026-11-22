'use client';

import Link from "next/link";
import { useEffect } from "react";

export default function MeetingsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('An uncaught error occurred:', error);
    }, [error]);

    return (
        <div className="mx-auto mt-12 max-w-xl rounded-lg border border-brand-light bg-white p-6 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-brand">Something went wrong</h1>
            <p className="mt-3 text-muted">
                We couldn&apos;t complete that action. Please try again later.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-md bg-brand px-4 py-2 font-semibold text-white hover:opacity-90"
                >
                    Try Again
                </button>
                <Link 
                    href="/meetings"
                    className="rounded-md border border-brand px-4 py-2 font-semmibold text-brand hover:bg-brand-light"
                    >
                        Back to Meetings
                    </Link>
            </div>
        </div>
    );
}