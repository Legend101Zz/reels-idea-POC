"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface NavigationGuideProps {
    currentReelId: string;
    onClose: () => void;
}

export default function NavigationGuide({ currentReelId, onClose }: NavigationGuideProps) {
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [showFullGuide, setShowFullGuide] = useState(false);

    // Determine navigation possibilities
    const [canNavigateUp, setCanNavigateUp] = useState(false);
    const [canNavigateDown, setCanNavigateDown] = useState(false);
    const [canNavigateLeft, setCanNavigateLeft] = useState(false);
    const [canNavigateRight, setCanNavigateRight] = useState(false);

    useEffect(() => {
        const reel = reels.find(r => r.id === currentReelId);
        if (reel) {
            setCurrentReel(reel);

            // Check if we can navigate up (next episode in series)
            setCanNavigateUp(Boolean(
                reel.seriesId && reel.episodeNumber &&
                reels.some(r => r.seriesId === reel.seriesId && r.episodeNumber === (reel.episodeNumber! + 1))
            ));

            // Check if we can navigate down (previous episode in series)
            setCanNavigateDown(Boolean(
                reel.seriesId && reel.episodeNumber && reel.episodeNumber > 1 &&
                reels.some(r => r.seriesId === reel.seriesId && r.episodeNumber === (reel.episodeNumber! - 1))
            ));

            // Check if we can navigate left (alternateVersions or related content)
            setCanNavigateLeft(Boolean(
                (reel.alternateVersions && reel.alternateVersions.length > 0) ||
                (reel.tags && reel.tags.length > 0 &&
                    reels.some(r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))))
            ));

            // Check if we can navigate right (alternateVersions or related content)
            setCanNavigateRight(Boolean(
                (reel.alternateVersions && reel.alternateVersions.length > 0) ||
                (reel.tags && reel.tags.length > 0 &&
                    reels.some(r => r.id !== reel.id && r.tags.some(tag => reel.tags.includes(tag))))
            ));
        }
    }, [currentReelId]);

    if (!currentReel) return null;

    // Determine navigation labels
    const getNavigationLabels = () => {
        return {
            up: currentReel.seriesId ? "Next Episode" : "Related Content",
            down: currentReel.seriesId ? "Previous Episode" : "Related Content",
            left: currentReel.alternateVersions ? "Alternate View" : "Related Content",
            right: currentReel.alternateVersions ? "Alternate View" : "Related Content"
        };
    };

    const navigationLabels = getNavigationLabels();

    return (
        <AnimatePresence mode="wait">
            {showFullGuide ? (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-lg bg-background border border-white/10 rounded-2xl p-6"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Multi-Dimensional Navigation</h2>
                            <motion.button
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                            >
                                <FaTimes />
                            </motion.button>
                        </div>

                        <p className="text-white/70 mb-8">
                            KnowScroll allows you to navigate content in multiple dimensions, creating a richer learning experience.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Vertical Navigation */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="font-bold mb-2 flex items-center">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                                        <FaArrowUp className="text-sm" />
                                        <FaArrowDown className="text-sm ml-1" />
                                    </div>
                                    Vertical Navigation
                                </h3>
                                <p className="text-sm text-white/70 mb-3">
                                    Navigate through episodes in a series to build knowledge sequentially.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                            <FaArrowUp className="text-xs" />
                                        </div>
                                        <span className="text-sm">Swipe up for next episode</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                            <FaArrowDown className="text-xs" />
                                        </div>
                                        <span className="text-sm">Swipe down for previous episode</span>
                                    </div>
                                </div>
                            </div>

                            {/* Horizontal Navigation */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <h3 className="font-bold mb-2 flex items-center">
                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                                        <FaArrowLeft className="text-sm" />
                                        <FaArrowRight className="text-sm ml-1" />
                                    </div>
                                    Horizontal Navigation
                                </h3>
                                <p className="text-sm text-white/70 mb-3">
                                    Explore different perspectives or related topics to broaden your understanding.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                            <FaArrowLeft className="text-xs" />
                                        </div>
                                        <span className="text-sm">Swipe left for alternate views</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mr-2">
                                            <FaArrowRight className="text-xs" />
                                        </div>
                                        <span className="text-sm">Swipe right for related topics</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <h3 className="font-bold mb-2">Current Navigation Options</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded-lg border ${canNavigateUp ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                                    <div className="flex items-center">
                                        <FaArrowUp className="mr-2" />
                                        <span>{navigationLabels.up}</span>
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        {canNavigateUp ? 'Available' : 'Not available'}
                                    </p>
                                </div>

                                <div className={`p-3 rounded-lg border ${canNavigateDown ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                                    <div className="flex items-center">
                                        <FaArrowDown className="mr-2" />
                                        <span>{navigationLabels.down}</span>
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        {canNavigateDown ? 'Available' : 'Not available'}
                                    </p>
                                </div>

                                <div className={`p-3 rounded-lg border ${canNavigateLeft ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                                    <div className="flex items-center">
                                        <FaArrowLeft className="mr-2" />
                                        <span>{navigationLabels.left}</span>
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        {canNavigateLeft ? 'Available' : 'Not available'}
                                    </p>
                                </div>

                                <div className={`p-3 rounded-lg border ${canNavigateRight ? 'border-primary/30 bg-primary/10' : 'border-white/10 bg-white/5 opacity-50'}`}>
                                    <div className="flex items-center">
                                        <FaArrowRight className="mr-2" />
                                        <span>{navigationLabels.right}</span>
                                    </div>
                                    <p className="text-xs text-white/50 mt-1">
                                        {canNavigateRight ? 'Available' : 'Not available'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <motion.button
                                className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-full text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                            >
                                Got it
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    className="fixed bottom-24 right-4 z-40"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <motion.button
                        className="w-10 h-10 bg-primary/80 backdrop-blur-md rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.9)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowFullGuide(true)}
                    >
                        <FaInfoCircle className="text-lg" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}