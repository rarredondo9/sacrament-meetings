import { Suspense } from 'react';
import NavLinks from './NavLinks';
import CurrentDate from './CurrentDate';

export default function Header() {
    return (
        <header className='bg-brand text-white print:hidden'>
            <div className='max-w-4xl mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <p className='text-xl font-bold'>Atherton Ward</p>
                    <Suspense fallback={<p className='text-sm'>&nbsp;</p>}>
                        <CurrentDate />
                    </Suspense>
                </div>
                <NavLinks />
            </div>
        </header>
    );
}