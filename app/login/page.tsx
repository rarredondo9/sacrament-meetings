import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
    title: 'Leader Sign In',
    description: 'Sign in for bishopric members to plan and edit sacrament meetings.',
};

export default function LoginPage() {
    return (
        <main className="mx-auto maz-w-sm px-4 py-16">
            <h1 className="mb-2 text-3xl font-bold text-brand">Leader Sign In</h1>
            <p className="mb-6 text-muted">For bishopric members only</p>
            <LoginForm />
        </main>
    );
}