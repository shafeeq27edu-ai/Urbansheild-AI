"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "BACK TO CONSOLE" }: { label?: string }) {
    const router = useRouter();

    const handleBack = () => {
        if (typeof window !== "undefined" && window.history.length > 2) {
            router.back();
        } else {
            router.push("/");
        }
    };

    return (
        <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-navy)]/60 hover:text-[var(--color-accent)] transition-colors mb-8"
            aria-label="Go Back"
        >
            <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
            {label}
        </button>
    );
}
