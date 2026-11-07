import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
    const headerList = await headers();
    const host = headerList.get('host') ?? 'localhost:3000';
    const protocol = host.startsWith('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
}