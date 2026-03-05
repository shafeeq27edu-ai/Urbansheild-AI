"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function IntelligenceMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // Keyboard & Accessibility: Escape to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Handle open with boot sequence
    const toggleMenu = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsBooting(true);
            setTimeout(() => setIsBooting(false), 400); // 400ms intelligence boot
        } else {
            setIsOpen(false);
            setIsBooting(false);
        }
    };

    const navItems = [
        { label: "HOME", href: "/" },
        { label: "ABOUT", href: "/about" },
        { label: "INTELLIGENCE ENGINE", href: "/intelligence" },
        { label: "CONTACT", href: "/contact" },
    ];

    return (
        <>
            {/* Minimal Circular Button - Globally Fixed */}
            <button
                onClick={toggleMenu}
                className="fixed top-5 right-8 z-[10000] w-10 h-10 rounded-full border border-[var(--color-navy)] flex flex-col items-center justify-center gap-1 bg-white hover:shadow-[0_0_10px_var(--color-navy)] transition-shadow duration-200"
                aria-label="Toggle Navigation"
            >
                <div className={`w-4 h-px bg-[var(--color-navy)] transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
                <div className={`w-4 h-px bg-[var(--color-navy)] transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
                <div className={`w-4 h-px bg-[var(--color-navy)] transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
            </button>

            {/* Full-Screen Overlay Panel */}
            <div
                className={`fixed inset-0 z-[9999] bg-[#f8f9fa]/95 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Boot Sequence Animation */}
                {isBooting ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-[1px] bg-[var(--color-navy)]/20 overflow-hidden mb-4">
                            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-accent)] -translate-x-full animate-[scan_1s_ease-in-out_infinite]" />
                        </div>
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="w-12 h-12 rounded-full border border-[var(--color-navy)]/30 animate-pulse" />
                            <div className="absolute w-2 h-2 rounded-full bg-[var(--color-accent)] animate-ping" />
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-navy)]">
                            INITIALIZING NAVIGATION...
                        </p>
                    </div>
                ) : (
                    <div ref={menuRef} className="flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-8 md:px-16 pt-20">
                        {/* Status Header inside menu */}
                        <div className="border-b border-[var(--color-navy)]/10 pb-4 mb-8 flex justify-between items-center opacity-0 animate-[fadeIn_0.5s_ease-out_0.1s_forwards]">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)]/60">
                                Global Navigation Array
                            </span>
                            <span className="text-[8px] font-bold tracking-widest text-[var(--color-forest)] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--color-forest)] rounded-full animate-pulse" />
                                SYSTEM ONLINE
                            </span>
                        </div>

                        <nav className="flex flex-col gap-2">
                            {navItems.map((item, i) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group relative flex items-center py-6 border-b border-[var(--color-navy)]/5 transition-all duration-300 hover:pl-4 opacity-0 animate-[slideRight_0.4s_ease-out_forwards]`}
                                        style={{ animationDelay: `${0.15 + i * 0.05}s` }}
                                    >
                                        <span className={`absolute left-0 transition-all duration-300 font-bold ${isActive ? "opacity-100 translate-x-0 text-[var(--color-accent)]" : "opacity-0 -translate-x-4 text-[var(--color-accent)] group-hover:opacity-100 group-hover:translate-x-0"}`}>
                                            &#8594;
                                        </span>
                                        <span className={`text-4xl md:text-5xl font-black uppercase tracking-tighter transition-colors duration-300 ${isActive ? "text-[var(--color-accent)] underline decoration-[var(--color-accent)] decoration-4 underline-offset-8" : "text-[var(--color-navy)]"} group-hover:text-[var(--color-accent)]`}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer inside menu */}
                        <div className="mt-16 opacity-0 animate-[fadeIn_0.5s_ease-out_0.4s_forwards]">
                            <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--color-navy)]/40">
                                URBANSHIELD v1.0 | SECURE CONNECTION
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}} />
        </>
    );
}
