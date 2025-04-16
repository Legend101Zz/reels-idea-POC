/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaPlay, FaPlus, FaUser, FaCompass, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';
import ReelPlayer from '@/components/ReelPlayer';
import ThreadView from '@/components/ThreadView';
import NavigationGuide from '@/components/NavigationGuide';
import SwipeIndicators from '@/components/ui/SwipeIndicators';
import EpisodeIndicator from '@/components/EpisodeIndicator';
import { reels } from '@/data/reels';
import { users } from '@/data/users';

export default function FeedPage() {
    // Core state
    const [currentReelId, setCurrentReelId] = useState<string>('');
    const [showThread, setShowThread] = useState(false);
    const [threadId, setThreadId] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [showNavigationGuide, setShowNavigationGuide] = useState(false);
    const [showDirectionHints, setShowDirectionHints] = useState(true);
    const [isFirstVisit, setIsFirstVisit] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);

    // Refs
    const initialLoadTimer = useRef<NodeJS.Timeout | null>(null);
    const directionsTimeout = useRef<NodeJS.Timeout | null>(null);

    // Check if we're on desktop
    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Initial load effect
    useEffect(() => {
        // Start with a series first episode as default
        const seriesReels = reels.filter(reel => reel.seriesId && reel.episodeNumber === 1);

        if (seriesReels.length > 0) {
            const randomIndex = Math.floor(Math.random() * seriesReels.length);
            setCurrentReelId(seriesReels[randomIndex].id);
        } else if (reels.length > 0) {
            // Fallback to any reel
            setCurrentReelId(reels[0].id);
        }

        // Simulate loading
        initialLoadTimer.current = setTimeout(() => {
            setIsLoading(false);

            // Show direction hints briefly at startup
            setShowDirectionHints(true);
            directionsTimeout.current = setTimeout(() => {
                setShowDirectionHints(false);
            }, 4000);
        }, 1000);

        return () => {
            if (initialLoadTimer.current) clearTimeout(initialLoadTimer.current);
            if (directionsTimeout.current) clearTimeout(directionsTimeout.current);
        };
    }, []);

    // Check for first visit using localStorage (if available)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const visited = localStorage.getItem('knowscroll_visited');
            if (visited) {
                setIsFirstVisit(false);
            } else {
                // Mark as visited
                localStorage.setItem('knowscroll_visited', 'true');
            }
        }
    }, []);

    const handleThreadOpen = (reelId: string) => {
        setThreadId(undefined);
        setShowThread(true);
        setShowDirectionHints(false);
    };

    const handleThreadClose = () => {
        setShowThread(false);
        setThreadId(undefined);
    };

    const handleCreateThread = (participants: typeof users) => {
        // In a real app, we'd create a thread in the backend
        setShowThread(false);
    };

    const handleReelChange = (reelId: string) => {
        setCurrentReelId(reelId);

        // Reset video completion state
        setVideoCompleted(false);
    };

    const handleNavigationGuideOpen = () => {
        setShowNavigationGuide(true);
        setShowDirectionHints(false);
    };

    const handleNavigationGuideClose = () => {
        setShowNavigationGuide(false);
    };

    const handleVideoComplete = () => {
        setVideoCompleted(true);

        // Show direction hints when video completes
        setShowDirectionHints(true);

        // On mobile, keep the hints visible longer
        if (!isDesktop) {
            if (directionsTimeout.current) {
                clearTimeout(directionsTimeout.current);
            }
            directionsTimeout.current = setTimeout(() => {
                setShowDirectionHints(false);
            }, 5000);
        }
    };

    // Navigation button classes for consistent styling
    const navButtonClasses = "flex flex-col items-center justify-center w-16";
    const navButtonActiveClasses = "text-primary-light";
    const navButtonInactiveClasses = "text-white/80";
    const navTextClasses = "text-xs mt-1";

    return (
        <div className="h-screen w-full bg-background relative overflow-hidden">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="absolute inset-0 z-50 bg-background flex items-center justify-center"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                        />
                        <motion.div
                            className="absolute mt-24"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="text-center">
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-secondary">
                                    KnowScroll
                                </h2>
                                <p className="text-sm text-white/60 mt-1">Loading your knowledge feed...</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Reel View */}
            {currentReelId && (
                <ReelPlayer
                    initialReelId={currentReelId}
                    onThreadOpen={handleThreadOpen}
                    onReelChange={handleReelChange}
                    onVideoComplete={handleVideoComplete}
                    showArrows={isDesktop}
                />
            )}

            {/* Navigation Direction Indicators - Only for mobile when video completes */}
            {!isLoading && currentReelId && (!isDesktop || videoCompleted) && (
                <SwipeIndicators
                    currentReelId={currentReelId}
                    isDesktop={isDesktop}
                    isVisible={showDirectionHints}
                />
            )}

            {/* Navigation Help Button - Only on desktop */}
            {!isLoading && !showThread && isDesktop && (
                <motion.button
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNavigationGuideOpen}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <FaQuestion className="text-lg" />
                </motion.button>
            )}

            {/* Bottom Navigation with Links */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-white/5 flex items-center justify-around z-30">
                <Link href="/" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHome className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                        <span className={`${navTextClasses} text-white/60`}>Home</span>
                    </motion.div>
                </Link>

                <Link href="/explore" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCompass className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                        <span className={`${navTextClasses} text-white/60`}>Explore</span>
                    </motion.div>
                </Link>

                <Link href="/create" className="block">
                    <motion.div
                        className="flex flex-col items-center justify-center -mt-8 relative"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center shadow-lg shadow-primary/20"
                            whileHover={{
                                boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)",
                                scale: 1.05
                            }}
                        >
                            <FaPlus className="text-xl" />
                        </motion.div>

                        {/* Pulsing effect around the button */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop",
                            }}
                        />
                    </motion.div>
                </Link>

                <Link href="/feed" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <FaPlay className={`text-xl mb-1 ${navButtonActiveClasses}`} />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-primary-secondary rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <span className={`${navTextClasses} ${navButtonActiveClasses}`}>Feed</span>
                    </motion.div>
                </Link>

                <Link href="/profile" className="block">
                    <motion.div
                        className={navButtonClasses}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <FaUser className={`text-xl mb-1 ${navButtonInactiveClasses}`} />
                            <motion.div
                                className="absolute -top-1 -right-1 w-2 h-2 bg-primary-secondary rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2 }}
                            />
                        </div>
                        <span className={`${navTextClasses} text-white/60`}>Profile</span>
                    </motion.div>
                </Link>
            </div>

            {/* Thread Modal */}
            <AnimatePresence>
                {showThread && (
                    <ThreadView
                        threadId={threadId}
                        initialParticipants={[users[0]]} // Add the first user from our mock data
                        onClose={handleThreadClose}
                        onCreateThread={handleCreateThread}
                    />
                )}
            </AnimatePresence>

            {/* First-time user guide - only show after loading and for new users */}
            <AnimatePresence>
                {!isLoading && isFirstVisit && !showNavigationGuide && (
                    <motion.div
                        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-40"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 1 }}
                    >
                        <motion.div
                            className="bg-black/70 backdrop-blur-md rounded-xl px-4 py-3 text-center max-w-xs"
                            whileHover={{ scale: 1.02 }}
                        >
                            <p className="text-sm mb-2">Welcome! Try swiping in different directions to navigate</p>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="flex items-center justify-center bg-white/5 rounded-lg p-2">
                                    <motion.div
                                        animate={{ y: [-3, 0, -3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <span className="mr-1">↑</span>
                                    </motion.div>
                                    <span className="text-xs">Next episode</span>
                                </div>
                                <div className="flex items-center justify-center bg-white/5 rounded-lg p-2">
                                    <motion.div
                                        animate={{ y: [3, 0, 3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <span className="mr-1">↓</span>
                                    </motion.div>
                                    <span className="text-xs">Previous episode</span>
                                </div>
                                <div className="flex items-center justify-center bg-white/5 rounded-lg p-2">
                                    <motion.div
                                        animate={{ x: [-3, 0, -3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <span className="mr-1">←</span>
                                    </motion.div>
                                    <span className="text-xs">Alternate view</span>
                                </div>
                                <div className="flex items-center justify-center bg-white/5 rounded-lg p-2">
                                    <motion.div
                                        animate={{ x: [3, 0, 3] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <span className="mr-1">→</span>
                                    </motion.div>
                                    <span className="text-xs">Related content</span>
                                </div>
                            </div>
                            <motion.button
                                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-secondary rounded-full text-sm"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(143, 70, 193, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsFirstVisit(false)}
                            >
                                Got it
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Guide Modal */}
            {showNavigationGuide && (
                <NavigationGuide
                    currentReelId={currentReelId}
                    onClose={handleNavigationGuideClose}
                />
            )}
        </div>
    );
}