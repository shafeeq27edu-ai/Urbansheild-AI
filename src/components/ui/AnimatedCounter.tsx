"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedCounter({ value, className = "" }: { value: number, className?: string }) {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
    const displayValue = useTransform(springValue, (current) => current.toFixed(1));

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return <motion.span className={className}>{displayValue}</motion.span>;
}
