"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';

export const CustomCountUp = ({ end, duration = 1.2, decimals = 0 }: { end: number, duration?: number, decimals?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const totalFrames = Math.round(duration * 60); // 60 FPS target
        const stepTime = (duration * 1000) / totalFrames;
        let currentFrame = 0;

        const timer = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // easeOutExpo

            setCount(end * easing);

            if (currentFrame >= totalFrames) {
                setCount(end);
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toFixed(decimals)}</span>;
};

export const CustomTilt = ({ children, tiltMaxAngleX = 3, tiltMaxAngleY = 3 }: { children: ReactNode, tiltMaxAngleX?: number, tiltMaxAngleY?: number }) => {
    const [tiltStyle, setTiltStyle] = useState({});
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = ((y - centerY) / centerY) * -tiltMaxAngleX;
        const tiltY = ((x - centerX) / centerX) * tiltMaxAngleY;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: 'transform 0.1s ease-out'
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.4s ease-out'
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ ...tiltStyle, width: '100%', height: '100%' }}
        >
            {children}
        </div>
    );
};
