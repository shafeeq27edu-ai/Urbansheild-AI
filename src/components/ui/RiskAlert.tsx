"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, ShieldAlert, CheckCircle2 } from "lucide-react";
import { translationService, SupportedLanguage } from "@/services/translationService";

interface RiskAlertProps {
    score: number;
    language: SupportedLanguage;
}

export default function RiskAlert({ score, language }: RiskAlertProps) {
    const content = translationService.getAlertContent(score, language);

    const getIcon = () => {
        if (score > 75) return <ShieldAlert className="w-6 h-6 text-white" />;
        if (score > 50) return <AlertTriangle className="w-6 h-6 text-white" />;
        if (score > 25) return <Info className="w-6 h-6 text-white" />;
        return <CheckCircle2 className="w-6 h-6 text-white" />;
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${score}-${language}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full p-4 border-l-4 border-black/20 ${content.color} text-white shadow-lg flex items-start gap-4 transition-colors duration-500`}
            >
                <div className="bg-black/10 p-2 rounded-sm">
                    {getIcon()}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-black uppercase tracking-tighter text-lg leading-tight">
                        {content.title}
                    </h3>
                    <p className="text-xs font-bold opacity-90 uppercase tracking-wide mt-1">
                        {content.advice}
                    </p>
                </div>
                <div className="ml-auto flex flex-col items-end">
                    <span className="text-[10px] font-black opacity-50 uppercase tracking-widest">Risk Index</span>
                    <span className="text-2xl font-black leading-none">{score}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
