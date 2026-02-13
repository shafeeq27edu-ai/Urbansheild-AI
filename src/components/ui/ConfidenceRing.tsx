"use client";

import { motion } from 'framer-motion';

interface ConfidenceRingProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
}

export default function ConfidenceRing({ value, size = 44, strokeWidth = 3 }: ConfidenceRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getColor = (v: number) => {
        if (v >= 80) return '#10b981'; // emerald-500
        if (v >= 60) return '#fbbf24'; // amber-400
        return '#ef4444'; // red-500
    };

    const color = getColor(value);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-800"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-black leading-none" style={{ color }}>{Math.round(value)}%</span>
                <span className="text-[6px] text-slate-500 font-bold uppercase tracking-tighter">CONF</span>
            </div>
        </div>
    );
}
