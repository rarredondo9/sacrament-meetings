export default async function Footer() {
    'use cache';

    return (
        <footer className="bg-brand-light text-muted py-4 mt-12 print:hidden">
            <div className="max-w-4xl ,x-auto px-4 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Sacrament Meeting Planner</p>
            </div>
        </footer>
    );
}