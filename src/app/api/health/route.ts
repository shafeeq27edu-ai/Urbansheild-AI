import { NextResponse } from 'next/server';

export async function GET() {
    // In a real scenario, you might check DB connections here or verify external API statuses.
    return NextResponse.json(
        {
            status: 'ok',
            services: {
                weatherAPI: true,
                predictionEngine: true,
            },
        },
        { status: 200 }
    );
}
