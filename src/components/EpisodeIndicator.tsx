"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircle, FaRegCircle } from 'react-icons/fa';
import { Reel } from '@/types';
import { reels } from '@/data/reels';

interface EpisodeIndicatorProps {
    currentReelId: string;
    visible: boolean;
}

export default function EpisodeIndicator({ currentReelId, visible }: EpisodeIndicatorProps) {
    const [seriesReels, setSeriesReels] = useState<Reel[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const currentReel = reels.find(r => r.id === currentReelId);
        if (!currentReel || !currentReel.seriesId) {
            setShowIndicator(false);
            return;
        }

        // Get all reels in this series, sorted by episode number
        const seriesEpisodes = reels
            .filter(r => r.seriesId === currentReel.seriesId)
            .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

        if (seriesEpisodes.length <= 1) {
            setShowIndicator(false);
            return;
        }

        // Find current index
        const index = seriesEpisodes.findIndex(r => r.id === currentReelId);

        setSeriesReels(seriesEpisodes);
        setCurrentIndex(index);
        setShowIndicator(true);
    }, [currentReelId]);

    if (!showIndicator) return null;

    // Only show for series with a reasonable number of episodes
    const maxDisplayDots = 7;

    // For series with many episodes, we'll use a condensed display
    const condensedView = seriesReels.length > maxDisplayDots;

    return (
        <AnimatePresence>
            {visible && showIndicator && (
                <motion.div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                    >
                        {!condensedView ? (
                            // Standard dot indicator for series with few episodes
                            seriesReels.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    animate={{
                                        scale: idx === currentIndex ? [1, 1.2, 1] : 1,
                                        opacity: idx === currentIndex ? 1 : 0.5
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: idx === currentIndex ? Infinity : 0,
                                        repeatType: "reverse"
                                    }}
                                >
                                    {idx === currentIndex ? (
                                        <FaCircle className="text-primary text-xs" />
                                    ) : (
                                        <FaRegCircle className="text-white text-xs" />
                                    )}
                                </motion.div>
                            ))
                        ) : (
                            // Condensed indicator for series with many episodes
                            <>
                                <span className="text-xs font-medium mr-2">
                                    Episode {(seriesReels[currentIndex]?.episodeNumber || 0)}
                                </span>
                                <span className="text-xs text-white/70">
                                    of {seriesReels.length}
                                </span>

                                {/* Visual progress bar */}
                                <div className="ml-2 w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${((currentIndex + 1) / seriesReels.length) * 100}%`
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}