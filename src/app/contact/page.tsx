import BackButton from "@/components/navigation/BackButton";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-8 py-20">
                <BackButton />
                <div className="mb-12 border-b border-[var(--color-navy)]/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] m-0">
                        COMMUNICATION LINK
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-accent)] mt-4">
                        Secure Channel
                    </p>
                </div>

                <div className="civic-card p-12 max-w-2xl border border-[var(--color-navy)]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]">
                    <div className="mb-8">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-navy)]/60 block mb-2">
                            A Secure Channel To UrbanShield Core
                        </label>
                        <p className="text-sm font-serif text-[var(--color-charcoal)]/80 leading-relaxed">
                            For intelligence sharing, integration inquiries, or direct communication with the engineering array regarding UrbanShield systems.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 border-b border-[var(--color-navy)]/10 pb-4">
                            <div className="w-12 h-12 bg-[var(--color-navy)]/5 flex items-center justify-center rounded-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-navy)]">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div>
                                <span className="text-[9px] uppercase font-black tracking-widest text-[var(--color-charcoal)]/50 block mb-1">Encrypted Transmission</span>
                                <a href="mailto:contact@urbanshield.ai" className="font-sans text-lg font-bold text-[var(--color-accent)] hover:underline">
                                    contact@urbanshield.ai
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--color-navy)]/5 flex items-center justify-center rounded-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-navy)]">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <div>
                                <span className="text-[9px] uppercase font-black tracking-widest text-[var(--color-charcoal)]/50 block mb-1">Primary Server Location</span>
                                <span className="font-sans text-lg font-bold text-[var(--color-navy)]">
                                    BENGALURU, IN
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
