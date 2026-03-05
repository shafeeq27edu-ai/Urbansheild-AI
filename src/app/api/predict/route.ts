import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text(); // safe extraction
        if (!bodyText) throw new Error("Empty request body");

        const bodyPayload = JSON.parse(bodyText);
        console.log("Incoming request to /api/predict:", bodyPayload);

        const { lat, lon, city } = bodyPayload;
        const cityKey = city || "Bengaluru";

        // Forward to Python hybrid engine
        const response = await fetch("http://127.0.0.1:8001/analyze-city", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                city: cityKey,
                overrides: {
                    lat: lat,
                    lon: lon
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python Engine Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log("Prediction output from Python backend:", data);

        // Return exactly what the python engine returned
        return NextResponse.json(data);

    } catch (error: any) {
        console.error("API error in POST /api/predict:", error);
        return NextResponse.json(
            { error: "Prediction failed", details: error.message || "Unknown server error" },
            { status: 500 }
        );
    }
}
