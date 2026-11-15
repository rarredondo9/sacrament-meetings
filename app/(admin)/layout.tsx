import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand">
                Leader Tools
            </p>
            {children}
        </main>
    );
}