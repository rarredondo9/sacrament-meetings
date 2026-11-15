export default async function EditMeetingPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <section>
            <h1 className="text-3xl font-bold text-brand">Edit Meeting {id} - Coming in Week 04</h1>
            <p className="mt-4 text-muted">
                The form for editing this meeting will be added next week
            </p>
        </section>
    );
}