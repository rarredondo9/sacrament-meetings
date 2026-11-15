'use client';

export default function PrintButton() {
    return (
        <button 
        type="button"
        onClick={() => window.print()}
        className="rounded-md bg-brand px-4 py-2 font-semibold text-white hover:opacity-90 focus-visible:outline-offset-2 focus-visible:outline-brand print:hidden"
    >
        Print Program
    </button>
    );
}