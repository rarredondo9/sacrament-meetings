'use client';

import { useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function MeetingSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { push } = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const currentQuery = searchParams.get('query') ?? '';

    useEffect(() => {
        const input = inputRef.current;
        if (input && document.activeElement !== input && input.value !== currentQuery) {
            input.value = currentQuery;
        }
    }, [currentQuery]);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="mb-8">
            <input 
                ref={inputRef}
                type="search"
                aria-label="Search meetings"
                placeholder="Search by Speaker, leader, or meeting type..."
                defaultValue={currentQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-md border border-brand-light bg-white px-4 py-2 text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-light"
            />
        </div>
    );
}