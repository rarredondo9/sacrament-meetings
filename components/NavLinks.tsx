'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
    { href: '/', label: 'Home'},
    { href: '/meetings', label: 'All Meetings' },
    { href: '/meetings/current', label: 'This Sunday' },
];

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav aria-label='Primary'>
            <ul className='flex flex-row flex-wrap items-center gap-2'>
                {links.map((link) => {
                    const isActive = 
                        link.href === '/'
                            ? pathname === '/'
                            : link.href === '/meetings'
                                ? pathname.startsWith('/meetings')
                                : pathname === link.href;

                return (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={
                                isActive
                                    ? 'active rounded-md bg-white/20 px-3 py-1 font-bold'
                                    : 'rounded-md px-3 py-1 hover:bg-white/10'
                            }
                        >
                            {link.label}
                        </Link>
                    </li>
                );
                })}
            </ul>
        </nav>
    );
}