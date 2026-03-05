import BackButton from "@/components/navigation/BackButton";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-8 py-20">
                <BackButton />
                <div className="mb-12 border-b border-[var(--color-navy)]/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] m-0">
                        ABOUT THE SYSTEM
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-accent)] mt-4">
                        Civic Intelligence & Risk Console v1.0
                    </p>
                </div>

                <div className="space-y-12 text-[var(--color-charcoal)]/80 leading-relaxed font-serif text-lg">
                    <section>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-4">
                            1. The Mission
                        </h2>
                        <p>
                            UrbanShield is a next-generation civic risk intelligence platform. In an era of escalating climate volatility, reactive measures are no longer sufficient. Our mission is to provide governments and civic leaders with proactive, real-time intelligence to mitigate environmental and infrastructural threats before they manifest into critical disasters.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-4">
                            2. Real-Time Risk Modeling
                        </h2>
                        <p>
                            The core of UrbanShield is our deterministic real-time modeling algorithm. By ingesting live telemetry from global meteorological providers, the platform computes hyper-local impact projections. The system dynamically scales risk priorities based on current environmental velocities, alerting stakeholders to critical thresholds with millisecond latency.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-sans text-xl font-black uppercase tracking-tight text-[var(--color-navy)] mb-4">
                            3. Hybrid Intelligence Engine
                        </h2>
                        <p>
                            Our Hybrid Intelligence Engine sits at the intersection of deterministic rule-based algorithms and evolving predictive analytics. Rather than relying solely on black-box heuristics, UrbanShield calculates compound risk factors—bridging flood dynamics, heat stress, and population density into a single unified resilience metric.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
