export default function Loading() {
    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center font-sans">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[var(--color-navy)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)] animate-pulse">
                    INITIALIZING METROPOLITAN GRID...
                </div>
            </div>
        </div>
    );
}
