"use client";

import { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaLightbulb } from 'react-icons/fa';
import { Reel, WhatIfScenario } from '@/types';
import { reels } from '@/data/reels';
import { users } from '@/data/users';

interface ReelPlayerProps {
    initialReelId: string;
    onThreadOpen?: (reelId: string) => void;
}

export default function ReelPlayer({ initialReelId, onThreadOpen }: ReelPlayerProps) {
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [showWhatIf, setShowWhatIf] = useState(false);
    const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);

    // Find current reel from mock data
    useEffect(() => {
        const reel = reels.find(r => r.id === initialReelId);
        if (reel) {
            setCurrentReel(reel);
        }
    }, [initialReelId]);

    // Auto-hide controls after 3 seconds
    useEffect(() => {
        if (showControls) {
            const timer = setTimeout(() => {
                setShowControls(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showControls]);

    // Handle video play/pause
    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(err => {
                    console.error('Error playing video:', err);
                    setIsPlaying(false);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, currentReel]);

    // Handle swipe gestures
    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const { dir } = eventData;

            // If showing what-if scenario, close it on any swipe
            if (showWhatIf) {
                setShowWhatIf(false);
                return;
            }

            setDirection(dir as any);

            setTimeout(() => {
                handleSwipeNavigation(dir);
                setDirection(null);
            }, 300);
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    // Navigate between reels based on swipe direction
    const handleSwipeNavigation = (direction: string) => {
        if (!currentReel) return;

        switch (direction) {
            case 'Up':
                // Swipe up to go to next in series
                if (currentReel.seriesId && currentReel.episodeNumber) {
                    const nextEpisode = reels.find(
                        r => r.seriesId === currentReel.seriesId &&
                            r.episodeNumber === (currentReel.episodeNumber! + 1)
                    );

                    if (nextEpisode) {
                        setCurrentReel(nextEpisode);
                    }
                }
                break;

            case 'Down':
                // Swipe down to go to previous in series
                if (currentReel.seriesId && currentReel.episodeNumber && currentReel.episodeNumber > 1) {
                    const prevEpisode = reels.find(
                        r => r.seriesId === currentReel.seriesId &&
                            r.episodeNumber === (currentReel.episodeNumber! - 1)
                    );

                    if (prevEpisode) {
                        setCurrentReel(prevEpisode);
                    }
                }
                break;

            case 'Left':
                // Swipe left to see alternate version (HyperReel)
                if (currentReel.alternateVersions && currentReel.alternateVersions.length > 0) {
                    const currentIndex = currentReel.alternateVersions.findIndex(id => id === currentReel.id);
                    const nextIndex = (currentIndex + 1) % currentReel.alternateVersions.length;
                    const nextVersionId = currentReel.alternateVersions[nextIndex];

                    const nextVersion = reels.find(r => r.id === nextVersionId);
                    if (nextVersion) {
                        setCurrentReel(nextVersion);
                    }
                }
                break;

            case 'Right':
                // Swipe right to see related content
                if (currentReel.tags && currentReel.tags.length > 0) {
                    const relatedReels = reels.filter(
                        r => r.id !== currentReel.id &&
                            r.tags.some(tag => currentReel.tags.includes(tag))
                    );

                    if (relatedReels.length > 0) {
                        // Pick a random related reel
                        const randomIndex = Math.floor(Math.random() * relatedReels.length);
                        setCurrentReel(relatedReels[randomIndex]);
                    }
                }
                break;

            default:
                break;
        }
    };

    const handleVideoClick = () => {
        setIsPlaying(!isPlaying);
        setShowControls(true);
    };

    const handleThreadOpen = () => {
        if (currentReel && onThreadOpen) {
            onThreadOpen(currentReel.id);
        }
    };

    const toggleWhatIf = () => {
        setShowWhatIf(!showWhatIf);
    };

    // Get creator info
    const getCreator = () => {
        if (!currentReel) return null;
        return users.find(user => user.id === currentReel.userId);
    };

    const creator = getCreator();

    if (!currentReel) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div
            className="reel-container"
            {...handlers}
        >
            {/* Video Player */}
            <div className="relative w-full h-full" onClick={handleVideoClick}>
                <video
                    ref={videoRef}
                    src={currentReel.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                />

                {/* Overlay with controls and info */}
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Top Bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-primary/80 rounded-full px-4 py-1 text-sm">
                                {currentReel.type === 'hyper' ? 'HyperReel' : currentReel.episodeNumber ? `Episode ${currentReel.episodeNumber}` : ''}
                            </div>
                        </div>

                        {/* App logo/name */}
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary rounded-full mr-2"></div>
                            <span className="font-bold">KnowScroll</span>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-8 left-4 right-20">
                        <h2 className="text-2xl font-bold mb-2">{currentReel.title}</h2>
                        <p className="text-sm text-gray-200 mb-4">{currentReel.description}</p>

                        {/* Creator Info */}
                        {creator && (
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-400 mr-3"></div>
                                <div>
                                    <p className="font-semibold">{creator.name}</p>
                                    <p className="text-xs text-gray-300">@{creator.username}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side Controls */}
                    <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
                        <button className="w-12 h-12 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-full">
                            <FaHeart className="text-2xl text-white" />
                            <span className="absolute -bottom-6 text-xs">{currentReel.likes}</span>
                        </button>

                        <button
                            className="w-12 h-12 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-full"
                            onClick={handleThreadOpen}
                        >
                            <FaComment className="text-2xl text-white" />
                        </button>

                        <button className="w-12 h-12 flex items-center justify-center bg-primary/20 backdrop-blur-sm rounded-full">
                            <FaShare className="text-2xl text-white" />
                        </button>

                        {currentReel.whatIfScenarios && currentReel.whatIfScenarios.length > 0 && (
                            <button
                                className={`w-12 h-12 flex items-center justify-center ${showWhatIf ? 'bg-primary' : 'bg-primary/20'} backdrop-blur-sm rounded-full`}
                                onClick={toggleWhatIf}
                            >
                                <FaLightbulb className="text-2xl text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Swipe Direction Indicators */}
                <AnimatePresence>
                    {direction && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {direction === 'up' && <FaArrowUp className="text-6xl text-white" />}
                            {direction === 'down' && <FaArrowDown className="text-6xl text-white" />}
                            {direction === 'left' && <FaArrowLeft className="text-6xl text-white" />}
                            {direction === 'right' && <FaArrowRight className="text-6xl text-white" />}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Hints */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Up: Next in Series */}
                    {currentReel.seriesId && currentReel.episodeNumber && (
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 swipe-indicator opacity-30">
                            <FaArrowUp className="text-sm" />
                        </div>
                    )}

                    {/* Down: Previous in Series */}
                    {currentReel.seriesId && currentReel.episodeNumber && currentReel.episodeNumber > 1 && (
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 swipe-indicator opacity-30">
                            <FaArrowDown className="text-sm" />
                        </div>
                    )}

                    {/* Left: Alternate Versions */}
                    {currentReel.alternateVersions && currentReel.alternateVersions.length > 0 && (
                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 swipe-indicator opacity-30">
                            <FaArrowLeft className="text-sm" />
                        </div>
                    )}

                    {/* Right: Related Content */}
                    <div className="absolute right-6 top-1/2 transform -translate-y-1/2 swipe-indicator opacity-30">
                        <FaArrowRight className="text-sm" />
                    </div>
                </div>

                {/* What If Scenarios */}
                <AnimatePresence>
                    {showWhatIf && currentReel.whatIfScenarios && currentReel.whatIfScenarios.length > 0 && (
                        <motion.div
                            className="absolute inset-x-4 bottom-24 bg-black/80 backdrop-blur-md p-4 rounded-xl"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentReel.whatIfScenarios.map((scenario: WhatIfScenario) => (
                                <div key={scenario.id} className="mb-3 last:mb-0">
                                    <h3 className="text-lg font-bold text-primary-light mb-1">{scenario.title}</h3>
                                    <p className="text-sm">{scenario.description}</p>
                                    <button className="mt-2 text-xs bg-primary/30 hover:bg-primary/50 rounded-full px-4 py-1">
                                        Tap to explore this path
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}