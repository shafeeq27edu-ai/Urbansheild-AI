import BackButton from "@/components/navigation/BackButton";

export default function IntelligencePage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans">
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-8 py-20">
                <BackButton />
                <div className="mb-12 border-b border-[var(--color-navy)]/10 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[var(--color-navy)] m-0">
                        ENGINE ARCHITECTURE
                    </h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-accent)] mt-4">
                        System Mechanics & Telemetry Processing
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="civic-card p-8 border border-[var(--color-navy)]/10">
                        <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[var(--color-navy)] mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            Live Telemetry Ingestion
                        </h3>
                        <p className="text-sm font-serif text-[var(--color-charcoal)]/80 leading-relaxed">
                            The platform connects directly to Open-Meteo arrays to ingest hourly precipitation, temperature profiles, and humidity benchmarks. These datastreams are processed continuously, bypassing static historical dependencies.
                        </p>
                    </div>

                    <div className="civic-card p-8 border border-[var(--color-navy)]/10">
                        <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[var(--color-navy)] mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            Infrastructure Modeling
                        </h3>
                        <p className="text-sm font-serif text-[var(--color-charcoal)]/80 leading-relaxed">
                            Environmental threats are mapped against static civic profiles containing baseline drainage coefficients, population density vectors, and green cover ratios to produce true localized exposure rates.
                        </p>
                    </div>

                    <div className="civic-card p-8 border border-[var(--color-navy)]/10">
                        <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[var(--color-navy)] mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            Flood Stress Computation
                        </h3>
                        <p className="text-sm font-serif text-[var(--color-charcoal)]/80 leading-relaxed">
                            Precipitation velocity is weighted against urban drainage capacity. Critical escalation paths are identified when the ratio of rainfall influx exceeds the drainage diffusion rate over a modeled 6-hour window.
                        </p>
                    </div>

                    <div className="civic-card p-8 border border-[var(--color-navy)]/10">
                        <h3 className="font-sans text-lg font-black uppercase tracking-tight text-[var(--color-navy)] mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                            Heat / Compound Risk
                        </h3>
                        <p className="text-sm font-serif text-[var(--color-charcoal)]/80 leading-relaxed">
                            Temperature extremes combined with relative humidity trigger the heat stress matrix. When intersecting with flood vulnerability, the system generates a unified &quot;Compound Risk&quot; integer indicating systemic collapse probability.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
