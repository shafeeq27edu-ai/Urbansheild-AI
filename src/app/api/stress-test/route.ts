import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        if (!text) throw new Error("Empty body");
        const body = JSON.parse(text);

        let cityStr = body.city || "Bengaluru";
        const lat = body.lat;
        const lon = body.lng || body.lon;

        // Forward to Python hybrid engine
        const response = await fetch("http://127.0.0.1:8001/analyze-city", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city: cityStr,
                overrides: {
                    ...(lat !== undefined && { lat: Number(lat) }),
                    ...(lon !== undefined && { lon: Number(lon) })
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python Engine Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json(
            { success: false, error: "Computation failed", details: error.message },
            { status: 500 }
        );
    }
}
