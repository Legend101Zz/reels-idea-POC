import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaPlay, FaVolumeUp, FaVolumeMute, FaPause, FaExpand, FaCompress } from 'react-icons/fa';

interface Reel {
    id: string;
    title: string;
    subtitle: string;
    videoUrl: string;
    thumbnailUrl: string;
    tags: string[];
    instructor: string;
    duration: string;
    views: string;
    color: string;
}

interface ReelsDeckProps {
    reels: Reel[];
    initialIndex?: number;
}

export default function ReelsDeck({ reels, initialIndex = 0 }: ReelsDeckProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [previousIndex, setPreviousIndex] = useState(initialIndex);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartY, setDragStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
    const deckRef = useRef<HTMLDivElement>(null);
    const cardControls = useAnimation();

    // Check if on mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle video loading and pausing
    useEffect(() => {
        const currentReel = reels[currentIndex];
        if (!currentReel) return;

        // Pause all videos first
        Object.values(videoRefs.current).forEach(videoEl => {
            if (videoEl && !videoEl.paused) {
                videoEl.pause();
            }
        });

        // Then play the current one if isPlaying is true
        const currentVideo = videoRefs.current[currentReel.id];
        if (currentVideo) {
            currentVideo.muted = isMuted;

            if (isPlaying) {
                currentVideo.play().catch(err => {
                    console.error("Error playing video:", err);
                    setIsPlaying(false);
                });
            }
        }
    }, [currentIndex, isPlaying, isMuted, reels]);

    // Handle shuffling/swiping cards
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (isShuffling) return;

        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        setIsDragging(true);
        setDragStartX(clientX);
        setDragStartY(clientY);
        setOffsetX(0);
        setOffsetY(0);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDragging) return;

        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const newOffsetX = clientX - dragStartX;
        const newOffsetY = clientY - dragStartY;

        setOffsetX(newOffsetX);
        setOffsetY(newOffsetY);

        // Determine swipe direction
        const absX = Math.abs(newOffsetX);
        const absY = Math.abs(newOffsetY);

        if (absX > absY && absX > 20) {
            setDirection(newOffsetX > 0 ? 'right' : 'left');
        } else if (absY > absX && absY > 20) {
            setDirection(newOffsetY > 0 ? 'down' : 'up');
        } else {
            setDirection(null);
        }
    };

    const handleDragEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const threshold = 100; // min distance to trigger card change

        if (direction === 'left' && Math.abs(offsetX) > threshold) {
            handleNextCard();
        } else if (direction === 'right' && Math.abs(offsetX) > threshold) {
            handlePreviousCard();
        } else if (direction === 'up' && Math.abs(offsetY) > threshold) {
            // Could handle vertical navigation here if needed
        } else if (direction === 'down' && Math.abs(offsetY) > threshold) {
            // Could handle vertical navigation here if needed
        } else {
            // Reset position if below threshold
            cardControls.start({
                x: 0,
                y: 0,
                rotate: 0,
                transition: { type: 'spring', stiffness: 500, damping: 30 }
            });
        }

        setDirection(null);
    };

    const handleNextCard = () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setPreviousIndex(currentIndex);

        // Animate current card exit
        cardControls.start({
            x: -window.innerWidth,
            rotate: -10,
            transition: { duration: 0.4 }
        }).then(() => {
            setCurrentIndex((prev) => (prev + 1) % reels.length);
            cardControls.set({ x: window.innerWidth, rotate: 10 });
            return cardControls.start({
                x: 0,
                rotate: 0,
                transition: { type: 'spring', stiffness: 200, damping: 20 }
            });
        }).then(() => {
            setIsShuffling(false);
            setIsPlaying(true); // Auto-play next card video
        });
    };

    const handlePreviousCard = () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setPreviousIndex(currentIndex);

        // Animate current card exit
        cardControls.start({
            x: window.innerWidth,
            rotate: 10,
            transition: { duration: 0.4 }
        }).then(() => {
            setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
            cardControls.set({ x: -window.innerWidth, rotate: -10 });
            return cardControls.start({
                x: 0,
                rotate: 0,
                transition: { type: 'spring', stiffness: 200, damping: 20 }
            });
        }).then(() => {
            setIsShuffling(false);
            setIsPlaying(true); // Auto-play next card video
        });
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering card shuffle
        setIsPlaying(!isPlaying);
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering card shuffle
        setIsMuted(!isMuted);
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering card shuffle
        setIsExpanded(!isExpanded);
    };

    const currentReel = reels[currentIndex];

    // Generate card positions for the deck effect
    const getCardStyle = (index: number) => {
        if (isExpanded) {
            return {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: index === currentIndex ? 10 : 5
            };
        }

        const totalCards = reels.length;
        const isCurrentCard = index === currentIndex;
        // Calculate how "far" this card is from the current card (in either direction)
        const distance = Math.min(
            Math.abs(index - currentIndex),
            Math.abs(index + totalCards - currentIndex),
            Math.abs(index - (currentIndex + totalCards))
        );

        const MAX_VISIBLE_CARDS = 3; // Only show 3 cards in the stack

        if (distance > MAX_VISIBLE_CARDS) {
            return { display: 'none' };
        }

        const isTopCard = distance === 0;
        const zIndex = MAX_VISIBLE_CARDS - distance;

        // Create a stacked deck effect
        const translateY = isTopCard ? 0 : -10 * distance;
        const translateX = isTopCard ? 0 : 5 * distance;
        const rotate = isTopCard ? 0 : (index < currentIndex ? -3 : 3) * distance;
        const scale = isTopCard ? 1 : 1 - 0.05 * distance;
        const opacity = isTopCard ? 1 : 1 - 0.2 * distance;

        return {
            position: 'absolute',
            transformOrigin: 'center bottom',
            zIndex,
            transform: `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
            opacity,
            boxShadow: isTopCard
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                : '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            transition: isShuffling ? 'none' : 'all 0.3s ease-out'
        };
    };

    return (
        <div className={`relative ${isExpanded ? 'fixed inset-0 z-50 bg-black/90' : 'h-[500px] md:h-[600px]'}`}>
            <div
                ref={deckRef}
                className={`relative w-full h-full flex items-center justify-center ${isExpanded ? 'p-4' : ''}`}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
            >
                <div className={`relative ${isExpanded ? 'w-full h-full max-w-3xl mx-auto' : 'w-72 h-96 md:w-80 md:h-[450px]'}`}>
                    {/* Navigation hints */}
                    {!isExpanded && !isDragging && !isShuffling && (
                        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                            <div className="flex space-x-12 opacity-30">
                                <motion.div
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                    animate={{ x: [-5, 0, -5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" />
                                    </motion.svg>
                                </motion.div>

                                <motion.div
                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                    animate={{ x: [5, 0, 5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <motion.svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" />
                                    </motion.svg>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Card Deck */}
                    {reels.map((reel, index) => {
                        const cardStyle = getCardStyle(index);

                        // Skip rendering cards that are too far from current card
                        if (cardStyle.display === 'none') return null;

                        return (
                            <motion.div
                                key={reel.id}
                                className={`absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-xl ${index === currentIndex ? 'cursor-grab active:cursor-grabbing' : ''
                                    }`}
                                style={cardStyle as any}
                                animate={index === currentIndex ? cardControls : undefined}
                                drag={index === currentIndex && !isShuffling ? true : false}
                                dragConstraints={deckRef}
                                onDragEnd={(_, info) => {
                                    const velocity = 500;
                                    if (info.offset.x > 100 || info.velocity.x > velocity) {
                                        handlePreviousCard();
                                    } else if (info.offset.x < -100 || info.velocity.x < -velocity) {
                                        handleNextCard();
                                    } else {
                                        cardControls.start({
                                            x: 0,
                                            rotate: 0,
                                            transition: { type: 'spring', stiffness: 500, damping: 30 }
                                        });
                                    }
                                }}
                            >
                                {/* Card content */}
                                <div className="absolute inset-0">
                                    {/* Video Background */}
                                    <div className="relative w-full h-full">
                                        <video
                                            ref={el => videoRefs.current[reel.id] = el}
                                            src={reel.videoUrl}
                                            poster={reel.thumbnailUrl}
                                            className="w-full h-full object-cover"
                                            playsInline
                                            loop
                                            muted={isMuted}
                                        />

                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                        {/* Background color fallback */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${reel.color} opacity-80 mix-blend-overlay`} />
                                    </div>

                                    {/* Card Content Overlay */}
                                    <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between">
                                        {/* Top bar with tag and duration */}
                                        <div className="flex justify-between items-start">
                                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                                                {reel.tags[0]}
                                            </div>

                                            <div className="flex space-x-2">
                                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs flex items-center">
                                                    {reel.duration}
                                                </div>

                                                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs flex items-center">
                                                    {reel.views}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom content */}
                                        <div>
                                            {/* Instructor info */}
                                            <div className="mb-2 flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-white/20 mr-2 flex items-center justify-center text-xs font-bold">
                                                    {reel.instructor.charAt(0)}
                                                </div>
                                                <span className="text-sm">{reel.instructor}</span>
                                            </div>

                                            {/* Title and description */}
                                            <h3 className="text-2xl font-bold mb-1">{reel.title}</h3>
                                            <p className="text-white/80 text-sm mb-4">{reel.subtitle}</p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {reel.tags.map((tag, i) => (
                                                    <span key={i} className="text-xs bg-white/10 backdrop-blur-md px-2 py-1 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Video controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={togglePlay}
                                                    >
                                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                                    </motion.button>

                                                    <motion.button
                                                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={toggleMute}
                                                    >
                                                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                                    </motion.button>
                                                </div>

                                                <motion.button
                                                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={toggleExpand}
                                                >
                                                    {isExpanded ? <FaCompress /> : <FaExpand />}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile swipe indicators (only show during active swipe) */}
                {isMobile && isDragging && direction && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
                        <div className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center ${direction === 'left' ? 'ml-auto mr-8' :
                                direction === 'right' ? 'mr-auto ml-8' : ''
                            }`}>
                            {direction === 'left' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            )}
                            {direction === 'right' && (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Card indicators */}
            {!isExpanded && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    <div className="flex space-x-2">
                        {reels.map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/30'}`}
                                whileHover={{ scale: 1.5 }}
                                onClick={() => {
                                    if (!isShuffling) {
                                        setPreviousIndex(currentIndex);
                                        setCurrentIndex(i);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}