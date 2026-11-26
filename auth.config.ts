import next from "next";
import type { NextAuthConfig } from "next-auth";

function isProtectedPath(pathname: string): boolean {
    return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit$/.test(pathname);
}

export const authConfig = {
    pages: { signIn: '/login' },
    callbacks: { 
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;

            if (isProtectedPath(nextUrl.pathname)) {
                return isLoggedIn;
            }

            if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/meetings', nextUrl));
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;