import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import IntelligenceMenu from "@/components/navigation/IntelligenceMenu";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "UrbanShield AI | Climate Risk Intelligence",
    description: "Hyper-local urban climate risk intelligence platform.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <IntelligenceMenu />
                <div className="flex-1 flex flex-col fade-transition">
                    {children}
                </div>
                <footer className="w-full bg-[var(--color-navy)] text-white/50 border-t border-[var(--color-accent)]/30 px-6 py-2 flex justify-between items-center text-[9px] font-bold tracking-widest uppercase z-[1000] relative">
                    <div className="flex items-center gap-3">
                        <span className="text-white">URBANSHIELD V1.0</span>
                        <span className="w-1 h-1 bg-white/30 rounded-full hidden sm:block"></span>
                        <span className="hidden sm:block">CIVIC RISK INTELLIGENCE CORE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>SYSTEM:</span>
                        <span className="text-[var(--color-forest)]">STABLE</span>
                    </div>
                </footer>
            </body>
        </html>
    );
}
