"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb, FaArrowRight, FaTimes } from 'react-icons/fa';
import { WhatIfScenario } from '@/types';

interface WhatIfOverlayProps {
    scenarios: WhatIfScenario[];
    isVisible: boolean;
    onClose: () => void;
    onSelectScenario: (scenarioId: string) => void;
}

export default function WhatIfOverlay({
    scenarios,
    isVisible,
    onClose,
    onSelectScenario
}: WhatIfOverlayProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-rotate scenarios every 10 seconds
    useEffect(() => {
        if (!isVisible || scenarios.length <= 1) return;

        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex((prev) => (prev + 1) % scenarios.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [isVisible, scenarios.length]);

    // Reset to first scenario when opening
    useEffect(() => {
        if (isVisible) {
            setActiveIndex(0);
            setDirection(0);
        }
    }, [isVisible]);

    // Handle manual navigation
    const handleNext = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % scenarios.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + scenarios.length) % scenarios.length);
    };

    // Exit if no scenarios
    if (!scenarios || scenarios.length === 0) return null;

    // Use different layout for single scenario vs multiple
    const isSingleScenario = scenarios.length === 1;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 z-40 backdrop-blur-lg bg-black/70 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="w-full max-w-lg p-6 mx-4"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <motion.div
                                    className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center mr-3"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            "0 0 0 rgba(143, 70, 193, 0.4)",
                                            "0 0 20px rgba(143, 70, 193, 0.4)",
                                            "0 0 0 rgba(143, 70, 193, 0.4)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <FaLightbulb className="text-xl text-primary-light" />
                                </motion.div>
                                <div>
                                    <h2 className="text-xl font-bold">What If...</h2>
                                    <p className="text-sm text-white/60">Explore alternative learning paths</p>
                                </div>
                            </div>

                            <motion.button
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                            >
                                <FaTimes />
                            </motion.button>
                        </div>

                        {/* Scenarios Carousel */}
                        <div
                            ref={containerRef}
                            className="relative overflow-hidden rounded-2xl mb-4"
                            style={{ minHeight: "300px" }}
                        >
                            <AnimatePresence custom={direction} mode="popLayout">
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    initial={{
                                        opacity: 0,
                                        x: direction * 200,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        transition: { type: "spring", damping: 25 }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: direction * -200,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0"
                                >
                                    <div className={`rounded-2xl overflow-hidden ${!isSingleScenario ? 'border-2 border-primary/30' : ''}`}>
                                        {/* Scenario visualization (placeholder image or gradient) */}
                                        <div className="h-36 bg-gradient-to-r from-primary/40 to-primary-secondary/40 relative flex items-center justify-center">
                                            <div className="absolute inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center">
                                                {scenarios[activeIndex].thumbnailUrl ? (
                                                    <img
                                                        src={scenarios[activeIndex].thumbnailUrl}
                                                        alt={scenarios[activeIndex].title}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <FaLightbulb className="text-4xl text-primary-light" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-black/70">
                                                <motion.div
                                                    className="text-center px-6"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                                                        {scenarios[activeIndex].title}
                                                    </h3>
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Scenario content */}
                                        <div className="p-5 bg-black/60">
                                            <p className="text-white/90 mb-4 text-base">
                                                {scenarios[activeIndex].description}
                                            </p>

                                            <motion.button
                                                className="w-full py-3 bg-gradient-to-r from-primary to-primary-secondary rounded-xl text-sm font-medium flex items-center justify-center"
                                                whileHover={{
                                                    scale: 1.03,
                                                    boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.3)"
                                                }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => onSelectScenario(scenarios[activeIndex].id)}
                                            >
                                                Explore This Path <FaArrowRight className="ml-2" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation dots - Only show for multiple scenarios */}
                            {!isSingleScenario && (
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                    {scenarios.map((_, idx) => (
                                        <motion.button
                                            key={idx}
                                            className="w-2 h-2 rounded-full bg-white/50"
                                            animate={{
                                                scale: idx === activeIndex ? 1.5 : 1,
                                                backgroundColor: idx === activeIndex ? "rgba(143, 70, 193, 1)" : "rgba(255, 255, 255, 0.5)"
                                            }}
                                            whileHover={{ scale: 1.5 }}
                                            whileTap={{ scale: 1 }}
                                            onClick={() => {
                                                setDirection(idx > activeIndex ? 1 : -1);
                                                setActiveIndex(idx);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Navigation arrows - Only show for multiple scenarios */}
                            {!isSingleScenario && scenarios.length > 1 && (
                                <>
                                    <motion.button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handlePrev}
                                    >
                                        <FaArrowRight className="rotate-180" />
                                    </motion.button>

                                    <motion.button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center"
                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={handleNext}
                                    >
                                        <FaArrowRight />
                                    </motion.button>
                                </>
                            )}
                        </div>

                        {/* Footer text */}
                        <div className="text-center text-white/60 text-xs">
                            <p>These alternative scenarios help explore different perspectives</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}