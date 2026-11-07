import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="mb-4 text-4xl font-bold text-brand">Sacrament Meeting Planner</h1>
          <p className="mb-6 text-lg text-muted">
            Plan, review, and print sacrament meeting programs for our ward, including hymns, prayers, speakers, musical numbers, and ward business.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/meetings/current"
              className="rounded-md bg-brand px-5 py-2 font-semibold text-white hover:opacity-90"
            >
              This Sunday&apos;s Program
            </Link>
            <Link 
            href="/meetings"
            className="rounded-md border border-brand px-5 py-2 font-semibold text-brand hover:bg-brand-light"
            >
            All Meetings  
            </Link>  
          </div>
        </div>
        <Image
          src="/hero.jpg"
          alt="Rows of chapel pews facing the pulpit"
          width={2000}
          height={2000}
          priority
          className="h-auto w-full rounded-lg shadow-md"
        />
      </section>
    </main>
  );
}