'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
    totalPages: number
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    function createPageURL(pageNumber: number): string {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(pageNumber));
        return `${pathname}?${params.toString()}`;
    }

    if(totalPages <= 1) return null;

    return (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-6">
            {currentPage > 1 ? (
                <Link
                href={createPageURL(currentPage - 1)}
                className="rounded-md border-brand px-4 py-2 font-semibold text-brand hover:bg-brand-light">
                    ← Previous
                </Link>
            ) : (
                <span aria-disabled="true" className="reounded-md border border-brand-light px-4 py-2 text-muted opacity-60">
                    ← Previous
                </span>
            )}

            <span className="font-semibold text-ink">
                Page {currentPage} of {totalPages}
            </span>

            {currentPage < totalPages ? (
                <Link
                    href={createPageURL(currentPage + 1)}
                    className="rounded-md border border-brand px-4 py-2 font-semibold text-brand hover:bg-brand-light">
                        Next →
                    </Link>
                ): (
                    <span aria-disabled="true" className="rounded-md border border-brand-light px-4 py-2 text-muted opacity-60">
                        Next →
                    </span>
                )}
        </nav>
    );
}