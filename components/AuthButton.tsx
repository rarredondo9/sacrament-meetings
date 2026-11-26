import Link from "next/link";
import { auth, signOut } from "@/auth";

export default async function AuthButton() {
    const session = await auth();

    if (!session?.user) {
        return (
            <Link 
                href="/login"
                className="rounded-md px-3 py-1 hover:bg-white/10">Leader Sign In
            </Link>
        );
    }
    return (
        <form 
            action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
            }}
        >
            <button type="submit" className="rounded-md px-3 py-1 hover:bg-white/10">Sign Out</button>
        </form>
    );
}