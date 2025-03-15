import { NextResponse } from "next/server";
import { redis } from "./lib/redis";


export default async function middleware(request) {
    const response = NextResponse.next();

    const time = Date.now();
    const timeStr = new Date(time).toLocaleString();

    const logData = {
        time: timeStr,
        url: request.url,
        ip: request.ip,
        ua: request.headers.get('user-agent'),
        geo: request.geo,

    }

    redis.lpush('api-requests-log', JSON.stringify(logData));

    return response;

}

// Add a matcher configuration to specify which routes should trigger the middleware
export const config = {
    matcher: [
        // Match all API routes
        '/api/:path*',
    ]
};