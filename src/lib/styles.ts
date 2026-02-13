/**
 * Prompt 9: Risk Visualization Logic
 * Maps a risk score (0-1) to powerful, glow-optimized styles.
 */

export interface RiskStyle {
    color: string;
    glow: string;
    bg: string;
    border: string;
}

export const getFloodRiskStyle = (score: number): RiskStyle => {
    if (score > 0.8) return {
        color: 'text-red-500',
        glow: 'shadow-[0_0_25px_rgba(239,68,68,0.5)]',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30'
    };
    if (score > 0.6) return {
        color: 'text-orange-500',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30'
    };
    if (score > 0.3) return {
        color: 'text-yellow-500',
        glow: 'shadow-[0_0_10px_rgba(234,179,8,0.2)]',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/30'
    };
    return {
        color: 'text-emerald-500',
        glow: 'shadow-none',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30'
    };
};

export const getHeatRiskStyle = (score: number): RiskStyle => {
    if (score > 0.85) return {
        color: 'text-red-600',
        glow: 'shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse',
        bg: 'bg-red-900/20',
        border: 'border-red-600/50'
    };
    if (score > 0.65) return {
        color: 'text-red-500',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
        bg: 'bg-red-500/10',
        border: 'border-red-500/30'
    };
    if (score > 0.4) return {
        color: 'text-orange-500',
        glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30'
    };
    return {
        color: 'text-sky-400',
        glow: 'shadow-none',
        bg: 'bg-sky-400/10',
        border: 'border-sky-400/30'
    };
};
