"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface SwipeIndicatorsProps {
    currentReelId: string;
    isDesktop: boolean;
    isVisible: boolean;
}

export default function SwipeIndicators({ currentReelId, isDesktop, isVisible }: SwipeIndicatorsProps) {
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [indicators, setIndicators] = useState({
        up: false,
        down: false,
        left: false,
        right: false
    });

    // Detect available navigation directions
    useEffect(() => {
        const reel = reels.find(r => r.id === currentReelId);
        if (!reel) return;

        setCurrentReel(reel);

        // Get adjacent reels
        const adjacentReels: { up?: Reel; down?: Reel; left?: Reel; right?: Reel } = {};

        // For series navigation (up/down)
        if (reel.seriesId && reel.episodeNumber) {
            // Get all reels in this series, sorted by episode number
            const seriesReels = reels
                .filter(r => r.seriesId === reel.seriesId)
                .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

            if (seriesReels.length > 1) {
                // Find current index in the series
                const currentIndex = seriesReels.findIndex(r => r.id === reel.id);

                // Next episode exists (up)
                adjacentReels.up = seriesReels[(currentIndex + 1) % seriesReels.length];

                // Previous episode exists (down)
                adjacentReels.down = seriesReels[(currentIndex - 1 + seriesReels.length) % seriesReels.length];
            }
        }

        // For horizontal navigation (left/right)
        if (reel.alternateVersions && reel.alternateVersions.length > 0) {
            // Find current index in alternates
            const currentIndex = reel.alternateVersions.findIndex(id => id === reel.id);

            // Next alternate version exists (left)
            const nextVersionId = reel.alternateVersions[(currentIndex + 1) % reel.alternateVersions.length];
            adjacentReels.left = reels.find(r => r.id === nextVersionId);

            // Previous alternate version exists (right)
            const prevVersionId = reel.alternateVersions[(currentIndex - 1 + reel.alternateVersions.length) % reel.alternateVersions.length];
            adjacentReels.right = reels.find(r => r.id === prevVersionId);
        } else if (reel.tags && reel.tags.length > 0) {
            // Find related reels by tags
            const relatedReels = reels.filter(
                r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))
            );

            if (relatedReels.length > 0) {
                adjacentReels.left = relatedReels[0];
                if (relatedReels.length > 1) {
                    adjacentReels.right = relatedReels[1];
                }
            }
        }

        // Set which indicators should be shown
        setIndicators({
            up: !!adjacentReels.up,
            down: !!adjacentReels.down,
            left: !!adjacentReels.left,
            right: !!adjacentReels.right
        });
    }, [currentReelId]);

    if (!currentReel || (isDesktop && !isVisible)) return null;

    // Get descriptive labels for each direction
    const getLabel = (direction: 'up' | 'down' | 'left' | 'right') => {
        const isSeriesNavigation = currentReel.seriesId && (direction === 'up' || direction === 'down');
        const isAlternateNavigation = currentReel.alternateVersions && (direction === 'left' || direction === 'right');

        switch (direction) {
            case 'up':
                return isSeriesNavigation ? "Next Episode" : "Related";
            case 'down':
                return isSeriesNavigation ? "Previous Episode" : "Related";
            case 'left':
                return isAlternateNavigation ? "Alternate View" : "Related";
            case 'right':
                return isAlternateNavigation ? "Alternate View" : "Related";
        }
    };

    // Mobile-optimized swipe indicators
    if (!isDesktop) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className="absolute inset-0 z-20 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Animated swipe guide overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-32 h-32 rounded-full bg-black/10 backdrop-blur-sm flex items-center justify-center"
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 0.7 }}
                                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            >
                                <div className="relative w-full h-full">
                                    {/* Up Indicator */}
                                    {indicators.up && (
                                        <motion.div
                                            className="absolute top-3 left-1/2 transform -translate-x-1/2"
                                            animate={{
                                                y: [-5, 0, -5],
                                                opacity: [1, 0.7, 1]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FaArrowUp className="text-lg text-white" />
                                                <span className="text-xs mt-1">Swipe Up</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Down Indicator */}
                                    {indicators.down && (
                                        <motion.div
                                            className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
                                            animate={{
                                                y: [5, 0, 5],
                                                opacity: [1, 0.7, 1]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FaArrowDown className="text-lg text-white" />
                                                <span className="text-xs mt-1">Swipe Down</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Left Indicator */}
                                    {indicators.left && (
                                        <motion.div
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                            animate={{
                                                x: [-5, 0, -5],
                                                opacity: [1, 0.7, 1]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FaArrowLeft className="text-lg text-white" />
                                                <span className="text-xs mt-1">Swipe Left</span>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Right Indicator */}
                                    {indicators.right && (
                                        <motion.div
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                            animate={{
                                                x: [5, 0, 5],
                                                opacity: [1, 0.7, 1]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <FaArrowRight className="text-lg text-white" />
                                                <span className="text-xs mt-1">Swipe Right</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Additional corner hints */}
                        {indicators.up && (
                            <motion.div
                                className="absolute top-8 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
                                    <FaArrowUp className="text-white" />
                                    <span className="text-sm">{getLabel('up')}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Hand swipe gesture animations - more intuitive than just arrows */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {indicators.up && (
                                <motion.div
                                    className="absolute h-32 w-32"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                        <motion.path
                                            d="M50,80 C60,80 70,70 70,50 C70,30 60,20 50,20"
                                            stroke="white"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{
                                                pathLength: 1,
                                                opacity: [0, 0.6, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                        />
                                        <motion.circle
                                            cx="50"
                                            cy="20"
                                            r="4"
                                            fill="white"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 1
                                            }}
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Desktop version with subtle indicators
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Only show on hover or when explicitly visible */}
            <AnimatePresence>
                {isVisible && (
                    <>
                        {/* Up Direction */}
                        {indicators.up && (
                            <motion.div
                                className="absolute top-16 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mb-2 border border-white/20"
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                    >
                                        <FaArrowUp className="text-sm text-white" />
                                    </motion.div>
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs">
                                        {getLabel('up')}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Down Direction */}
                        {indicators.down && (
                            <motion.div
                                className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs mb-2">
                                        {getLabel('down')}
                                    </div>
                                    <motion.div
                                        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
                                        animate={{ y: [0, 3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                    >
                                        <FaArrowDown className="text-sm text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Left Direction */}
                        {indicators.left && (
                            <motion.div
                                className="absolute left-4 top-1/2 transform -translate-y-1/2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center">
                                    <motion.div
                                        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center mr-2 border border-white/20"
                                        animate={{ x: [0, -3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                    >
                                        <FaArrowLeft className="text-sm text-white" />
                                    </motion.div>
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs">
                                        {getLabel('left')}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Right Direction */}
                        {indicators.right && (
                            <motion.div
                                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center">
                                    <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs mr-2">
                                        {getLabel('right')}
                                    </div>
                                    <motion.div
                                        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
                                        animate={{ x: [0, 3, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
                                    >
                                        <FaArrowRight className="text-sm text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}