/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";

import { useState, useRef, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHeart, FaComment, FaShare, FaLightbulb, FaVolumeUp,
    FaVolumeMute, FaPause, FaPlay, FaInfoCircle, FaKeyboard,
    FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaBookmark
} from 'react-icons/fa';
import { Reel, WhatIfScenario } from '@/types';
import { reels } from '@/data/reels';
import { users } from '@/data/users';
import EpisodeIndicator from '@/components/EpisodeIndicator';
import WhatIfOverlay from '@/components/WhatIfOverlay';

interface ReelPlayerProps {
    initialReelId: string;
    onThreadOpen?: (reelId: string) => void;
    onReelChange?: (reelId: string) => void;
    onVideoComplete?: () => void;
    showArrows?: boolean;
}

export default function ReelPlayer({
    initialReelId,
    onThreadOpen,
    onReelChange,
    onVideoComplete,
    showArrows = false
}: ReelPlayerProps) {
    // Core state
    const [currentReel, setCurrentReel] = useState<Reel | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const [showWhatIf, setShowWhatIf] = useState(false);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Navigation state
    const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [nextReels, setNextReels] = useState<{
        up?: Reel;
        down?: Reel;
        left?: Reel;
        right?: Reel;
    }>({});

    // Progress tracking
    const [progress, setProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Preloading refs (keep videos in memory for instant playback)
    const preloadRefs = useRef<Record<string, HTMLVideoElement>>({});

    // Find current reel from mock data and preload adjacent reels
    useEffect(() => {
        const reel = reels.find(r => r.id === initialReelId);
        if (!reel) return;

        // Set the current reel and notify parent
        setCurrentReel(reel);
        if (onReelChange) {
            onReelChange(reel.id);
        }

        // Reset video state
        setVideoEnded(false);
        setVideoLoaded(false);
        setProgress(0);
        setIsLiked(false);
        setIsSaved(false);

        // Find adjacent reels for preloading and navigation hints
        const adjacentReels: { up?: Reel; down?: Reel; left?: Reel; right?: Reel } = {};

        // VERTICAL NAVIGATION - STRICTLY WITHIN SERIES
        if (reel.seriesId && reel.episodeNumber) {
            // Get all reels in this series, sorted by episode number
            const seriesReels = reels
                .filter(r => r.seriesId === reel.seriesId)
                .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));

            if (seriesReels.length > 1) {
                // Find current index in the series
                const currentIndex = seriesReels.findIndex(r => r.id === reel.id);

                // Next episode (up)
                const nextIndex = (currentIndex + 1) % seriesReels.length;
                adjacentReels.up = seriesReels[nextIndex];

                // Previous episode (down)
                const prevIndex = (currentIndex - 1 + seriesReels.length) % seriesReels.length;
                adjacentReels.down = seriesReels[prevIndex];

                // Preload ALL episodes in this series for instant navigation
                seriesReels.forEach(seriesReel => {
                    if (seriesReel.id !== reel.id && !preloadRefs.current[seriesReel.id]) {
                        const preloadVideo = document.createElement('video');
                        preloadVideo.src = seriesReel.videoUrl;
                        preloadVideo.muted = true;
                        preloadVideo.preload = 'auto';
                        preloadVideo.load();
                        preloadRefs.current[seriesReel.id] = preloadVideo;
                    }
                });
            }
        }

        // HORIZONTAL NAVIGATION (different series or related content)
        // LEFT: Different series or content with similar tags
        if (reel.seriesId) {
            // Find different series with similar tags
            const differentSeries = reels.filter(r =>
                r.seriesId &&
                r.seriesId !== reel.seriesId &&
                r.episodeNumber === 1 && // Start with first episode
                r.tags.some(tag => reel.tags.includes(tag))
            );

            if (differentSeries.length > 0) {
                // Take the first match for left navigation
                adjacentReels.left = differentSeries[0];
            }
        } else if (reel.alternateVersions && reel.alternateVersions.length > 0) {
            // If this is a HyperReel with alternates, use those for left/right
            const currentIndex = reel.alternateVersions.findIndex(id => id === reel.id);

            // Next alternate version (left swipe)
            const nextIndex = (currentIndex + 1) % reel.alternateVersions.length;
            const nextVersionId = reel.alternateVersions[nextIndex];
            const nextReel = reels.find(r => r.id === nextVersionId);
            if (nextReel) {
                adjacentReels.left = nextReel;
            }

            // Previous alternate version (right swipe)
            const prevIndex = (currentIndex - 1 + reel.alternateVersions.length) % reel.alternateVersions.length;
            const prevVersionId = reel.alternateVersions[prevIndex];
            const prevReel = reels.find(r => r.id === prevVersionId);
            if (prevReel) {
                adjacentReels.right = prevReel;
            }
        }

        // RIGHT: If we don't have a right navigation yet, find related content
        if (!adjacentReels.right && reel.tags && reel.tags.length > 0) {
            const relatedReels = reels.filter(
                r => r.id !== reel.id &&
                    !r.seriesId && // Prefer standalone reels
                    r.tags.some(tag => reel.tags.includes(tag))
            );

            if (relatedReels.length > 0) {
                adjacentReels.right = relatedReels[0];
            }
        }

        // If left is still empty, find any related content by tags
        if (!adjacentReels.left && reel.tags && reel.tags.length > 0) {
            const relatedReels = reels.filter(
                r => r.id !== reel.id &&
                    r.id !== adjacentReels.right?.id && // Don't use the same reel as right
                    r.tags.some(tag => reel.tags.includes(tag))
            );

            if (relatedReels.length > 0) {
                adjacentReels.left = relatedReels[0];
            }
        }

        // Update navigation state
        setNextReels(adjacentReels);

    }, [initialReelId, onReelChange]);

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

    // Auto-hide controls after 3 seconds of inactivity
    useEffect(() => {
        if (showControls) {
            const timer = setTimeout(() => {
                if (!showWhatIf && !showInfo && !showKeyboardHelp) {
                    setShowControls(false);
                }
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showControls, showWhatIf, showInfo, showKeyboardHelp]);

    // Handle video loading, events and instant transitions
    useEffect(() => {
        if (!videoRef.current || !currentReel) return;

        const video = videoRef.current;

        // Set video properties
        video.muted = isMuted;
        video.loop = true;

        // Clear previous event listeners
        const cloneNode = video.cloneNode(false) as HTMLVideoElement;
        if (video.parentNode) {
            video.parentNode.replaceChild(cloneNode, video);
        }
        videoRef.current = cloneNode;

        // Setup event listeners
        const handleCanPlay = () => {
            setVideoLoaded(true);
            setVideoDuration(cloneNode.duration);

            if (isPlaying && !isTransitioning) {
                // Use Promise syntax for better error handling
                cloneNode.play().catch(err => {
                    console.error('Error playing video:', err);
                    setIsPlaying(false);
                });
            }
        };

        const handleLoadedMetadata = () => {
            setVideoDuration(cloneNode.duration);
        };

        const handleTimeUpdate = () => {
            const currentTime = cloneNode.currentTime;
            const duration = cloneNode.duration;

            if (duration > 0) {
                // Update progress percentage
                setProgress((currentTime / duration) * 100);

                // Detect when video is near the end (90% complete)
                if (!videoEnded && currentTime >= duration * 0.9) {
                    setVideoEnded(true);
                    if (onVideoComplete) {
                        onVideoComplete();
                    }
                }
            }
        };

        const handleEnded = () => {
            // Video has completed a loop, restarting
            cloneNode.currentTime = 0;
            cloneNode.play().catch(console.error);

            if (!videoEnded) {
                setVideoEnded(true);
                if (onVideoComplete) {
                    onVideoComplete();
                }
            }
        };

        const handleError = (e: Event) => {
            console.error('Video error:', e);
            setVideoLoaded(false);

            // Try to recover with a default video if available
            if (cloneNode.src !== '/videos/default-video.mp4') {
                console.log('Attempting to play default video instead');
                cloneNode.src = '/videos/default-video.mp4';
                cloneNode.load();
            }
        };

        // Add all event listeners
        cloneNode.addEventListener('canplay', handleCanPlay);
        cloneNode.addEventListener('loadedmetadata', handleLoadedMetadata);
        cloneNode.addEventListener('timeupdate', handleTimeUpdate);
        cloneNode.addEventListener('ended', handleEnded);
        cloneNode.addEventListener('error', handleError);

        // OPTIMIZED LOADING STRATEGY:
        // Priority 1: Use preloaded video if available (instant playback)
        // Priority 2: Set src and load if needed
        const preloadedVideo = preloadRefs.current[currentReel.id];

        if (preloadedVideo && preloadedVideo.readyState >= 3) {
            // Use the preloaded video's src - this is much faster than loading again
            cloneNode.src = preloadedVideo.src;

            // If the preloaded video is fully loaded, we can set state immediately
            if (preloadedVideo.readyState >= 4) {
                setVideoLoaded(true);
                setVideoDuration(preloadedVideo.duration);

                // Start playback immediately
                if (isPlaying && !isTransitioning) {
                    cloneNode.play().catch(console.error);
                }
            }
        } else {
            // No preloaded version, load from scratch
            cloneNode.src = currentReel.videoUrl;
            cloneNode.load(); // Explicitly load to start buffering
        }

        // Clean up function
        return () => {
            cloneNode.removeEventListener('canplay', handleCanPlay);
            cloneNode.removeEventListener('loadedmetadata', handleLoadedMetadata);
            cloneNode.removeEventListener('timeupdate', handleTimeUpdate);
            cloneNode.removeEventListener('ended', handleEnded);
            cloneNode.removeEventListener('error', handleError);

            if (!cloneNode.paused) {
                cloneNode.pause();
            }

            // Store this video in preloadRefs if not already there
            if (!preloadRefs.current[currentReel.id]) {
                preloadRefs.current[currentReel.id] = cloneNode;
            }
        };
    }, [currentReel, isMuted, isPlaying, isTransitioning, onVideoComplete, videoEnded]);

    // Handle video play/pause state changes
    useEffect(() => {
        if (!videoRef.current || !videoLoaded || isTransitioning) return;

        const video = videoRef.current;

        if (isPlaying) {
            video.play().catch(err => {
                console.error('Error playing video:', err);
                setIsPlaying(false);
            });

            // Start progress tracking
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }

            progressInterval.current = setInterval(() => {
                if (video) {
                    const currentTime = video.currentTime;
                    if (videoDuration > 0) {
                        setProgress((currentTime / videoDuration) * 100);
                    }
                }
            }, 100);
        } else {
            video.pause();

            // Stop progress tracking
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [isPlaying, videoLoaded, isTransitioning, videoDuration]);

    // Handle video mute/unmute
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Reset progress when reel changes
    useEffect(() => {
        setProgress(0);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    }, [currentReel]);

    // Add keyboard navigation for desktop
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTransitioning) return;

            // Show controls on any key press
            setShowControls(true);

            switch (e.key) {
                case 'ArrowUp':
                    navigateToReel('up');
                    break;
                case 'ArrowDown':
                    navigateToReel('down');
                    break;
                case 'ArrowLeft':
                    navigateToReel('left');
                    break;
                case 'ArrowRight':
                    navigateToReel('right');
                    break;
                case ' ': // Space
                    setIsPlaying(!isPlaying);
                    break;
                case 'm':
                case 'M':
                    setIsMuted(!isMuted);
                    break;
                case 'i':
                case 'I':
                    setShowInfo(!showInfo);
                    break;
                case 'w':
                case 'W':
                    if (currentReel?.whatIfScenarios && currentReel.whatIfScenarios.length > 0) {
                        setShowWhatIf(!showWhatIf);
                    }
                    break;
                case 'Escape':
                    if (showWhatIf) setShowWhatIf(false);
                    if (showInfo) setShowInfo(false);
                    if (showKeyboardHelp) setShowKeyboardHelp(false);
                    break;
                case '?':
                    setShowKeyboardHelp(!showKeyboardHelp);
                    break;
                case 'l':
                case 'L':
                    setIsLiked(!isLiked);
                    break;
                case 'b':
                case 'B':
                    setIsSaved(!isSaved);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying, isMuted, showWhatIf, showInfo, showKeyboardHelp, isTransitioning, currentReel, isLiked, isSaved]);


    // Navigate between reels based on direction - optimized for instant transitions
    const navigateToReel = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (!currentReel || isTransitioning) return;

        // Get next reel from our precomputed directions
        const nextReel = nextReels[direction];
        if (!nextReel) return; // Don't navigate if there's no reel in this direction

        // Start transition animation
        setDirection(direction);
        setIsTransitioning(true);
        setShowControls(true);

        // Reset video state
        setVideoEnded(false);
        setProgress(0);

        // Close any open overlays
        setShowWhatIf(false);
        setShowInfo(false);
        setShowKeyboardHelp(false);

        // OPTIMIZED TRANSITION:
        // 1. Play animation for 200ms (shortened from 300ms)
        // 2. Switch to new reel
        // 3. Start playing new reel immediately if preloaded
        setTimeout(() => {
            if (onReelChange) {
                onReelChange(nextReel.id);
            }

            setCurrentReel(nextReel);

            // Quickly reset navigation states
            setTimeout(() => {
                setDirection(null);
                setIsTransitioning(false);
                setIsPlaying(true);
            }, 100); // Even shorter delay for snappier UI
        }, 200); // Shorter animation time for more responsive feel
    };

    // Handle swipe gestures with better sensitivity
    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            const { dir } = eventData;

            // Don't process swipes during transitions
            if (isTransitioning) return;

            // If showing overlays, close them on any swipe
            if (showWhatIf || showInfo || showKeyboardHelp) {
                setShowWhatIf(false);
                setShowInfo(false);
                setShowKeyboardHelp(false);
                return;
            }

            // Map swipe direction to navigation direction (lowercase for consistency)
            switch (dir.toLowerCase()) {
                case 'up':
                    navigateToReel('up');
                    break;
                case 'down':
                    navigateToReel('down');
                    break;
                case 'left':
                    navigateToReel('left');
                    break;
                case 'right':
                    navigateToReel('right');
                    break;
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: false, // Only track on touch devices for better performance
        delta: 30, // Lower threshold for easier swiping (was 50)
        swipeDuration: 800, // Allow slightly longer swipes (was 500)
    });

    const handleVideoClick = () => {
        if (showWhatIf || showInfo || showKeyboardHelp) {
            // Close any open overlays
            setShowWhatIf(false);
            setShowInfo(false);
            setShowKeyboardHelp(false);
        } else {
            // Toggle playback
            setIsPlaying(!isPlaying);
        }
        // Always show controls when clicking
        setShowControls(true);
    };

    const handleThreadOpen = () => {
        if (currentReel && onThreadOpen) {
            onThreadOpen(currentReel.id);
        }
    };

    const toggleWhatIf = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowWhatIf(!showWhatIf);
        setShowControls(true);

        // Reset video ended state when opening what-if
        if (!showWhatIf) {
            setVideoEnded(false);
        }
    };

    const toggleLike = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsLiked(!isLiked);
        setShowControls(true);

        // Animate heart effect when liking
        if (!isLiked) {
            // Here you could add a heart animation
        }
    };

    const toggleSave = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsSaved(!isSaved);
        setShowControls(true);
    };

    const toggleMute = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setIsMuted(!isMuted);
        setShowControls(true);
    };

    const toggleInfo = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowInfo(!showInfo);
        setShowControls(true);
    };

    const toggleKeyboardHelp = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowKeyboardHelp(!showKeyboardHelp);
        setShowControls(true);
    };

    const handleWhatIfSelect = (scenarioId: string) => {
        // In a real app, you would navigate to the scenario
        setShowWhatIf(false);
        setShowControls(true);

        // For now, just close the overlay and show a notification
        console.log(`Selected scenario ${scenarioId}`);
    };

    // Get creator info
    const getCreator = () => {
        if (!currentReel) return null;
        return users.find(user => user.id === currentReel.userId);
    };

    const creator = getCreator();

    // Bail out if no current reel
    if (!currentReel) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <motion.div
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    // Determine available navigation directions based on current reel
    const canNavigateUp = Boolean(nextReels.up);
    const canNavigateDown = Boolean(nextReels.down);
    const canNavigateLeft = Boolean(nextReels.left);
    const canNavigateRight = Boolean(nextReels.right);

    return (
        <div
            ref={containerRef}
            className="reel-container h-screen w-full touch-none"
            {...handlers}
            onClick={handleVideoClick}
        >
            {/* Video Player with Enhanced Transitions */}
            <div className="relative w-full h-full bg-background">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentReel.id}
                        className="absolute inset-0"
                        initial={{
                            opacity: 0,
                            scale: direction ? 1 : 0.95,
                            x: direction === 'right' ? -100 : direction === 'left' ? 100 : 0,
                            y: direction === 'down' ? -100 : direction === 'up' ? 100 : 0
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: 0,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
                            y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0
                        }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                            duration: 0.2
                        }}
                    >
                        {/* Main Video Element */}
                        <video
                            ref={videoRef}
                            className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                            loop
                            playsInline
                            poster={currentReel.thumbnailUrl}
                            muted={isMuted}
                        />

                        {/* Loading overlay and thumbnail */}
                        {!videoLoaded && (
                            <div className="absolute inset-0 bg-background flex items-center justify-center">
                                <img
                                    src={currentReel.thumbnailUrl}
                                    alt={currentReel.title}
                                    className="w-full h-full object-cover opacity-50"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Episode indicator at the top */}
                <EpisodeIndicator
                    currentReelId={currentReel.id}
                    visible={showControls || videoEnded}
                />

                {/* Overlay with controls and info */}
                <div
                    className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowControls(true);
                    }}
                >
                    {/* Top Bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary/80 backdrop-blur-sm rounded-full px-4 py-1 text-sm">
                                {currentReel.type === 'hyper' ? 'HyperReel' : currentReel.episodeNumber ? `Episode ${currentReel.episodeNumber}` : 'Featured'}
                            </div>

                            {currentReel.seriesId && (
                                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                                    Series
                                </div>
                            )}
                        </div>

                        {/* App logo/name */}
                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-secondary rounded-full mr-2 flex items-center justify-center text-white font-bold">
                                K
                            </div>
                            <span className="font-bold">KnowScroll</span>
                        </motion.div>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-20 md:bottom-8 left-4 right-20">
                        <h2 className="text-xl md:text-2xl font-bold mb-1">{currentReel.title}</h2>
                        <p className="text-sm text-gray-200 mb-2 line-clamp-2">{currentReel.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {currentReel.tags.slice(0, 3).map((tag, index) => (
                                <motion.span
                                    key={index}
                                    className="text-xs bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full"
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>

                        {/* Creator Info */}
                        {creator && (
                            <motion.div
                                className="flex items-center"
                                whileHover={{ x: 3 }}
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/30 mr-2 flex items-center justify-center">
                                    <span className="text-sm font-semibold">{creator.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{creator.name}</p>
                                    <p className="text-xs text-gray-300">@{creator.username}</p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Side Controls */}
                    <div className="absolute right-4 bottom-24 md:bottom-28 flex flex-col items-center space-y-4">
                        <motion.button
                            className={`w-12 h-12 flex items-center justify-center ${isLiked ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm rounded-full transition-colors duration-300`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleLike}
                        >
                            <FaHeart className={`text-xl ${isLiked ? 'text-white' : 'text-white'}`} />
                            <motion.span
                                className="absolute -bottom-5 text-xs"
                                animate={{ scale: isLiked ? [1, 1.5, 1] : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isLiked ? (currentReel.likes + 1).toLocaleString() : currentReel.likes.toLocaleString()}
                            </motion.span>
                        </motion.button>

                        <motion.button
                            className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleThreadOpen}
                        >
                            <FaComment className="text-xl text-white" />
                            <span className="absolute -bottom-5 text-xs">Chat</span>
                        </motion.button>

                        <motion.button
                            className="w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.3)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaShare className="text-xl text-white" />
                            <span className="absolute -bottom-5 text-xs">Share</span>
                        </motion.button>

                        <motion.button
                            className={`w-12 h-12 flex items-center justify-center ${isSaved ? 'bg-primary' : 'bg-white/20'} backdrop-blur-sm rounded-full transition-colors duration-300`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleSave}
                        >
                            <FaBookmark className={`text-xl ${isSaved ? 'text-white' : 'text-white'}`} />
                            <span className="absolute -bottom-5 text-xs">Save</span>
                        </motion.button>

                        {currentReel.whatIfScenarios && currentReel.whatIfScenarios.length > 0 && (
                            <motion.button
                                className={`w-12 h-12 flex items-center justify-center ${showWhatIf ? 'bg-primary' : 'bg-white/20'} backdrop-blur-sm rounded-full transition-colors duration-300`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleWhatIf}
                            >
                                <FaLightbulb className="text-xl text-white" />
                                <span className="absolute -bottom-5 text-xs">What If</span>
                            </motion.button>
                        )}
                    </div>

                    {/* Video Controls Overlay - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center space-x-3">
                        <motion.button
                            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsPlaying(!isPlaying);
                            }}
                        >
                            {isPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg" />}
                        </motion.button>

                        <motion.button
                            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMute}
                        >
                            {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
                        </motion.button>

                        <div className="flex-1 mx-1">
                            <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute h-full bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                        </div>

                        <motion.button
                            className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleInfo}
                        >
                            <FaInfoCircle className="text-lg" />
                        </motion.button>

                        {isDesktop && (
                            <motion.button
                                className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full hidden md:flex"
                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleKeyboardHelp}
                            >
                                <FaKeyboard className="text-lg" />
                            </motion.button>
                        )}
                    </div>

                    {/* Desktop Arrow Controls with Enhanced UI - only show when enabled */}
                    {showArrows && isDesktop && (
                        <>
                            {/* Next Episode (Up) Arrow */}
                            {canNavigateUp && (
                                <motion.button
                                    className="absolute top-24 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-b from-primary/30 to-black/60 backdrop-blur-md flex items-center justify-center border border-primary/30 hidden md:flex z-20"
                                    initial={{ y: 0, opacity: 0.8 }}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "rgba(143, 70, 193, 0.4)",
                                        boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('up');
                                    }}
                                >
                                    <FaArrowUp className="text-xl text-white" />
                                </motion.button>
                            )}

                            {/* Previous Episode (Down) Arrow */}
                            {canNavigateDown && (
                                <motion.button
                                    className="absolute bottom-28 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-t from-primary/30 to-black/60 backdrop-blur-md flex items-center justify-center border border-primary/30 hidden md:flex z-20"
                                    initial={{ y: 0, opacity: 0.8 }}
                                    animate={{
                                        y: [0, 10, 0],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: 0.5
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "rgba(143, 70, 193, 0.4)",
                                        boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('down');
                                    }}
                                >
                                    <FaArrowDown className="text-xl text-white" />
                                </motion.button>
                            )}

                            {/* Left (Different Series) Arrow */}
                            {canNavigateLeft && (
                                <motion.button
                                    className="absolute top-1/2 left-10 transform -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-primary/30 to-black/60 backdrop-blur-md flex items-center justify-center border border-primary/30 hidden md:flex z-20"
                                    initial={{ x: 0, opacity: 0.8 }}
                                    animate={{
                                        x: [0, -10, 0],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: 1
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "rgba(143, 70, 193, 0.4)",
                                        boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('left');
                                    }}
                                >
                                    <FaArrowLeft className="text-xl text-white" />
                                </motion.button>
                            )}

                            {/* Right (Related Content) Arrow */}
                            {canNavigateRight && (
                                <motion.button
                                    className="absolute top-1/2 right-10 transform -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-l from-primary/30 to-black/60 backdrop-blur-md flex items-center justify-center border border-primary/30 hidden md:flex z-20"
                                    initial={{ x: 0, opacity: 0.8 }}
                                    animate={{
                                        x: [0, 10, 0],
                                        opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: 1.5
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        backgroundColor: "rgba(143, 70, 193, 0.4)",
                                        boxShadow: "0 0 20px rgba(143, 70, 193, 0.4)"
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToReel('right');
                                    }}
                                >
                                    <FaArrowRight className="text-xl text-white" />
                                </motion.button>
                            )}
                        </>
                    )}
                </div>

                {/* Swipe Direction Indicators - Only show during transition */}
                <AnimatePresence>
                    {direction && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className="w-20 h-20 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center"
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 1.2, opacity: 0 }}
                            >
                                {direction === 'up' && <FaArrowUp className="text-4xl text-white" />}
                                {direction === 'down' && <FaArrowDown className="text-4xl text-white" />}
                                {direction === 'left' && <FaArrowLeft className="text-4xl text-white" />}
                                {direction === 'right' && <FaArrowRight className="text-4xl text-white" />}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Navigation Hints - Only visible when video ends (handled by separate component) */}

                {/* What If Scenarios Overlay */}
                {currentReel.whatIfScenarios && (
                    <WhatIfOverlay
                        scenarios={currentReel.whatIfScenarios}
                        isVisible={showWhatIf}
                        onClose={() => setShowWhatIf(false)}
                        onSelectScenario={handleWhatIfSelect}
                    />
                )}

                {/* Info Modal */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md p-6 z-20"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowInfo(false);
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <FaInfoCircle className="text-primary-light text-xl mr-2" />
                                    <h3 className="text-2xl font-bold">{currentReel.title}</h3>
                                </div>

                                <motion.button
                                    className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowInfo(false);
                                    }}
                                >
                                    ✕
                                </motion.button>
                            </div>

                            <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
                                {/* Series Info */}
                                {currentReel.seriesId && currentReel.episodeNumber && (
                                    <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4">
                                        <div className="flex items-center mb-2">
                                            <div className="px-3 py-1 bg-primary/30 rounded-full text-xs mr-2">
                                                Series
                                            </div>
                                            <h4 className="font-semibold">
                                                Episode {currentReel.episodeNumber} of {
                                                    reels.filter(r => r.seriesId === currentReel.seriesId).length
                                                }
                                            </h4>
                                        </div>
                                        <p className="text-sm text-white/70 mb-2">
                                            Part of a multi-episode series. Swipe up/down to navigate between episodes.
                                        </p>
                                    </div>
                                )}

                                {/* Main Content */}
                                <div className="mb-6">
                                    <p className="text-white/90 text-base mb-6">{currentReel.description}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                                            <p className="text-xs text-white/70 mb-1">Views</p>
                                            <p className="font-semibold">{currentReel.views.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                                            <p className="text-xs text-white/70 mb-1">Likes</p>
                                            <p className="font-semibold">{currentReel.likes.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                                            <p className="text-xs text-white/70 mb-1">Duration</p>
                                            <p className="font-semibold">{Math.floor(currentReel.duration / 60)}:{(currentReel.duration % 60).toString().padStart(2, '0')}</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                                            <p className="text-xs text-white/70 mb-1">Published</p>
                                            <p className="font-semibold">{new Date(currentReel.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <h4 className="font-semibold mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {currentReel.tags.map((tag, index) => (
                                            <motion.span
                                                key={index}
                                                className="text-sm bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Creator Info */}
                                {creator && (
                                    <div className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4">
                                        <h4 className="font-semibold mb-3">Creator</h4>
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-primary/30 mr-3 flex items-center justify-center">
                                                <span className="text-lg font-semibold">{creator.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{creator.name}</p>
                                                <p className="text-sm text-white/70">@{creator.username}</p>
                                                <div className="mt-1">
                                                    <motion.button
                                                        className="text-xs bg-primary/30 hover:bg-primary/50 rounded-full px-3 py-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Follow
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Related Content */}
                                {currentReel.tags && currentReel.tags.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-3">Related Content</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {reels
                                                .filter(r =>
                                                    r.id !== currentReel.id &&
                                                    r.tags.some(tag => currentReel.tags.includes(tag))
                                                )
                                                .slice(0, 4)
                                                .map(relatedReel => (
                                                    <motion.div
                                                        key={relatedReel.id}
                                                        className="bg-white/5 backdrop-blur-sm rounded-xl p-3 flex items-center cursor-pointer"
                                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowInfo(false);
                                                            if (onReelChange) {
                                                                onReelChange(relatedReel.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="w-16 h-16 rounded-lg bg-gray-800 mr-3 flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={relatedReel.thumbnailUrl}
                                                                alt={relatedReel.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{relatedReel.title}</p>
                                                            <p className="text-xs text-white/70 line-clamp-2">{relatedReel.description}</p>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Keyboard Shortcuts Help */}
                <AnimatePresence>
                    {showKeyboardHelp && (
                        <motion.div
                            className="absolute inset-0 bg-black/80 backdrop-blur-md p-6 z-20"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowKeyboardHelp(false);
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <FaKeyboard className="text-primary-light text-xl mr-2" />
                                    <h3 className="text-2xl font-bold">Keyboard Shortcuts</h3>
                                </div>

                                <motion.button
                                    className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowKeyboardHelp(false);
                                    }}
                                >
                                    ✕
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                                    <h4 className="font-semibold mb-3">Navigation</h4>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <FaArrowUp className="text-sm" />
                                                </div>
                                                <span>Next episode</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <FaArrowDown className="text-sm" />
                                                </div>
                                                <span>Previous episode</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <FaArrowLeft className="text-sm" />
                                                </div>
                                                <span>Different series/content</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <FaArrowRight className="text-sm" />
                                                </div>
                                                <span>Related content</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
                                    <h4 className="font-semibold mb-3">Controls</h4>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">Space</span>
                                                </div>
                                                <span>Play/Pause</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">M</span>
                                                </div>
                                                <span>Mute/Unmute</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">L</span>
                                                </div>
                                                <span>Like</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">B</span>
                                                </div>
                                                <span>Save</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">I</span>
                                                </div>
                                                <span>Toggle info panel</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">W</span>
                                                </div>
                                                <span>Toggle &quot;What If&quot; scenarios</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">?</span>
                                                </div>
                                                <span>Show keyboard shortcuts</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center mr-3">
                                                    <span className="text-sm">ESC</span>
                                                </div>
                                                <span>Close any open panel</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hearts animation when liking */}
                <AnimatePresence>
                    {isLiked && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none overflow-hidden z-30"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2 }}
                        >
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-red-500"
                                    initial={{
                                        scale: 0,
                                        opacity: 0.8,
                                        x: Math.random() * window.innerWidth * 0.8,
                                        y: window.innerHeight * 0.8
                                    }}
                                    animate={{
                                        scale: Math.random() * 3 + 1,
                                        opacity: 0,
                                        x: Math.random() * window.innerWidth * 0.8,
                                        y: Math.random() * window.innerHeight * 0.4
                                    }}
                                    transition={{
                                        duration: Math.random() * 2 + 1,
                                        ease: "easeOut"
                                    }}
                                >
                                    <FaHeart className="text-2xl" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}