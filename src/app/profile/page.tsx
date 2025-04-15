"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    FaUser, FaVideo, FaBell, FaSearch, FaComment, FaShareAlt, FaPlus, FaEllipsisH,
    FaArrowLeft, FaTimes, FaCheck, FaClock, FaPlay, FaPause, FaLightbulb, FaPaperPlane,
    FaLock, FaBookmark, FaHeart, FaInfoCircle, FaRandom, FaMagic, FaGraduationCap
} from 'react-icons/fa';

// Mock data for the user profile
const userData = {
    id: "user1",
    name: "Alex Johnson",
    username: "@alex_science",
    bio: "Physics enthusiast | Science communicator | Always curious about the cosmos",
    avatar: "/images/avatar-alex.jpg",
    followers: 1245,
    following: 368,
    joinedDate: "April 2024",
    activity: {
        views: 284,
        threads: 12,
        contributions: 47
    }
};

// Mock data for series the user is watching
const watchingSeries = [
    {
        id: "series1",
        title: "Black Holes",
        description: "A comprehensive exploration of black holes and their properties",
        episodes: 5,
        progress: 3,
        thumbnailUrl: "/images/black-holes-thumb.jpg",
        tags: ["Physics", "Space", "Astronomy"],
        color: "from-[#8f46c1] to-[#a0459b]"
    },
    {
        id: "series2",
        title: "Quantum Physics",
        description: "Understanding quantum mechanics and its strange phenomena",
        episodes: 3,
        progress: 1,
        thumbnailUrl: "/images/quantum-physics-thumb.jpg",
        tags: ["Physics", "Quantum Theory"],
        color: "from-[#a0459b] to-[#bd4580]"
    },
    {
        id: "series3",
        title: "AI Revolution",
        description: "How artificial intelligence is changing our world",
        episodes: 4,
        progress: 4,
        thumbnailUrl: "/images/ai-revolution-thumb.jpg",
        tags: ["Technology", "AI", "Computing"],
        color: "from-[#bd4580] to-[#d56f66]"
    }
];

// Mock data for threads
const threadsData = [
    {
        id: "thread1",
        seriesId: "series1",
        title: "Black Holes",
        participants: [
            { id: "user1", name: "Alex", avatar: "/images/avatar-alex.jpg", isOnline: true },
            { id: "user2", name: "Jamie", avatar: "/images/avatar-jamie.jpg", lastActive: "2h ago" },
            { id: "user3", name: "Taylor", avatar: "/images/avatar-taylor.jpg", lastActive: "5m ago" }
        ],
        messages: [
            {
                id: "msg1",
                userId: "user1",
                content: "That part about event horizons was mind-blowing!",
                timestamp: "Today, 12:05 PM",
                episodeRef: { number: 2, timestamp: "01:45", title: "Event Horizons" }
            },
            {
                id: "msg2",
                userId: "user3",
                content: "Check this part!",
                timestamp: "Today, 12:10 PM",
                episodeRef: { number: 1, timestamp: "00:52", title: "Black Holes Explained" }
            },
            {
                id: "msg3",
                userId: "user2",
                content: "Do you think there's any possibility of using black holes for time travel?",
                timestamp: "Today, 12:15 PM"
            },
            {
                id: "msg4",
                userId: "user1",
                content: "Well, theoretically, the extreme gravity near a black hole does slow down time relative to observers further away (time dilation). But actual time travel? That's still in the realm of science fiction.",
                timestamp: "Today, 12:18 PM"
            }
        ],
        whatIfScenarios: [
            {
                id: "what-if-1",
                title: "What if... black holes are portals?",
                description: "Alternative theory generated based on the series content. This could explain disappearing matter.",
                generatedBy: "user1"
            },
            {
                id: "what-if-2",
                title: "What if... black holes contain entire universes?",
                description: "The mass could be powering the creation of new cosmic realms with different physics.",
                generatedBy: "AI"
            }
        ],
        episodes: [
            { number: 1, title: "Black Holes Explained", viewed: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "5:20" },
            { number: 2, title: "Event Horizons", viewed: true, current: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "6:15" },
            { number: 3, title: "Spaghettification", viewed: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "4:50" },
            { number: 4, title: "Hawking Radiation", viewed: false, locked: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "7:30" },
            { number: 5, title: "At the Center of Galaxies", viewed: false, locked: true, thumbnailUrl: "/images/black-holes-thumb.jpg", duration: "6:45" }
        ]
    },
    {
        id: "thread2",
        seriesId: "series2",
        title: "Quantum Physics",
        participants: [
            { id: "user1", name: "Alex", avatar: "/images/avatar-alex.jpg", isOnline: true },
            { id: "user3", name: "Taylor", avatar: "/images/avatar-taylor.jpg", lastActive: "5m ago" }
        ],
        messages: [
            {
                id: "msg1",
                userId: "user1",
                content: "The double-slit experiment still confuses me sometimes.",
                timestamp: "Yesterday, 15:30 PM"
            },
            {
                id: "msg2",
                userId: "user3",
                content: "Look at this part where they explain wave-particle duality.",
                timestamp: "Yesterday, 15:35 PM",
                episodeRef: { number: 1, timestamp: "03:24", title: "Wave-Particle Duality" }
            }
        ],
        episodes: [
            { number: 1, title: "Wave-Particle Duality", viewed: true, current: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "5:10" },
            { number: 2, title: "Superposition", viewed: false, locked: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "6:20" },
            { number: 3, title: "Entanglement", viewed: false, locked: true, thumbnailUrl: "/images/quantum-physics-thumb.jpg", duration: "7:15" }
        ]
    }
];

// Automated responses
const autoResponses = [
    "That's a really interesting perspective!",
    "I never thought about it that way before.",
    "That connects really well with what we learned in episode 2.",
    "Have you watched the part about quantum entanglement yet?",
    "The way the instructor explained that concept made it so much clearer.",
    "I'm going to rewatch that section, thanks for pointing it out!",
    "Did you see the visualization they used? It really helped me understand.",
    "I wonder how this applies to other phenomena we've learned about.",
    "That's exactly the point I was trying to make last time!",
    "Do you think this will be covered more in the upcoming episodes?"
];

// Friends data for creating threads
const friendsData = [
    { id: "user2", name: "Jamie Smith", username: "jamie_history", avatar: "/images/avatar-jamie.jpg", isOnline: false, lastActive: "2h ago" },
    { id: "user3", name: "Taylor Wong", username: "taylor_physics", avatar: "/images/avatar-taylor.jpg", isOnline: false, lastActive: "5m ago" },
    { id: "user4", name: "Jordan Lee", username: "jordan_math", avatar: "/images/avatar-alex.jpg", isOnline: true }
];

// Animation variants
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Main component
export default function UserProfile() {
    const [viewState, setViewState] = useState("profile"); // profile, thread, create-thread
    const [selectedThread, setSelectedThread] = useState(null);
    const [createThreadState, setCreateThreadState] = useState({ step: 1, seriesId: null, selectedFriends: [] });
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showWhatIf, setShowWhatIf] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentEpisode, setCurrentEpisode] = useState(1);

    const messagesEndRef = useRef(null);
    const controls = useAnimation();

    // Handle thread selection
    const handleSelectThread = (threadId) => {
        const thread = getThreadById(threadId);
        setSelectedThread(thread);
        setMessages(thread.messages);
        setCurrentEpisode(thread.episodes.find(ep => ep.current)?.number || 1);
        setViewState("thread");
    };

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Helper function to get a thread by ID
    const getThreadById = (threadId) => {
        return threadsData.find(thread => thread.id === threadId);
    };

    // Handle create thread flow
    const handleCreateThread = (seriesId) => {
        setCreateThreadState({ step: 1, seriesId, selectedFriends: [] });
        setViewState("create-thread");
    };

    // Toggle friend selection in create thread flow
    const toggleFriendSelection = (friend) => {
        setCreateThreadState(prev => {
            const friendExists = prev.selectedFriends.some(f => f.id === friend.id);
            return {
                ...prev,
                selectedFriends: friendExists
                    ? prev.selectedFriends.filter(f => f.id !== friend.id)
                    : [...prev.selectedFriends, friend]
            };
        });
    };

    // Handle going back
    const handleBack = () => {
        if (viewState === "thread" || viewState === "create-thread") {
            setViewState("profile");
            setSelectedThread(null);
            setMessages([]);
            setCreateThreadState({ step: 1, seriesId: null, selectedFriends: [] });
        } else if (createThreadState.step > 1) {
            setCreateThreadState(prev => ({ ...prev, step: prev.step - 1 }));
        }
    };

    // Simulate typing response
    const simulateResponse = () => {
        if (!selectedThread) return;

        // Get random participant who isn't the current user
        const otherParticipants = selectedThread.participants.filter(p => p.id !== userData.id);
        if (otherParticipants.length === 0) return;

        const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
        const randomResponse = autoResponses[Math.floor(Math.random() * autoResponses.length)];

        // Show typing indicator
        setIsTyping(true);

        // Simulate typing delay (1-3 seconds)
        const typingDelay = 1000 + Math.random() * 2000;

        setTimeout(() => {
            setIsTyping(false);

            // Add new message
            const newMsg = {
                id: `msg-${Date.now()}`,
                userId: randomParticipant.id,
                content: randomResponse,
                timestamp: "Just now"
            };

            setMessages(prev => [...prev, newMsg]);
        }, typingDelay);
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedThread) return;

        // Create new message
        const newMsg = {
            id: `msg-${Date.now()}`,
            userId: userData.id,
            content: newMessage,
            timestamp: "Just now"
        };

        // Add to messages
        setMessages(prev => [...prev, newMsg]);

        // Clear input
        setNewMessage("");

        // Trigger response after delay
        setTimeout(simulateResponse, 500);
    };

    // Handle keypress in message input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Get series info by ID
    const getSeriesById = (seriesId) => {
        return watchingSeries.find(series => series.id === seriesId);
    };

    // Handle episode change
    const handleEpisodeChange = (episodeNumber) => {
        // Only allow navigating to unlocked episodes
        if (selectedThread?.episodes.find(ep => ep.number === episodeNumber)?.locked) {
            return;
        }

        setCurrentEpisode(episodeNumber);

        // Update UI to show this episode as current
        if (selectedThread) {
            const updatedThread = { ...selectedThread };
            updatedThread.episodes = updatedThread.episodes.map(ep => ({
                ...ep,
                current: ep.number === episodeNumber
            }));
            setSelectedThread(updatedThread);
        }
    };

    // Generate What-If scenario
    const generateWhatIf = () => {
        controls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.5 }
        });
        setShowWhatIf(true);
    };

    // Render the UI based on current view state
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
            {/* Background gradients */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-primary-500 to-primary-800 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-tr from-primary-secondary to-primary-800 blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Header/Navigation */}
            <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
                <div className="flex items-center justify-between">
                    {viewState !== "profile" ? (
                        <motion.button
                            onClick={handleBack}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaArrowLeft />
                        </motion.button>
                    ) : (
                        <motion.div
                            className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center"
                            whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(143, 70, 193, 0.5)" }}
                        >
                            <FaUser />
                        </motion.div>
                    )}

                    <motion.h1
                        className="text-xl font-semibold"
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: -10 }}
                    >
                        {viewState === "profile" ? "Profile" :
                            viewState === "thread" ?
                                <div className="flex items-center">
                                    <span>{selectedThread?.title}</span>
                                    {selectedThread &&
                                        <div className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs">
                                            Ep {currentEpisode}
                                        </div>
                                    }
                                </div> :
                                viewState === "create-thread" ? "New Thread" : ""}
                    </motion.h1>

                    <div className="flex items-center space-x-2">
                        <motion.button
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaBell />
                            <motion.div
                                className="absolute -top-1 -right-1 w-3 h-3 bg-primary-secondary rounded-full"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.button>
                        <motion.button
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaSearch />
                        </motion.button>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.main
                    key={viewState}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="pb-20"
                >
                    {/* Profile View */}
                    {viewState === "profile" && (
                        <div className="px-4 py-6">
                            {/* User Info */}
                            <motion.div
                                className="mb-6"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.div className="flex items-center" variants={staggerItem}>
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary glass-card">
                                            <img
                                                src={userData.avatar}
                                                alt={userData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <motion.div
                                            className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-background"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        ></motion.div>
                                    </div>

                                    <div className="ml-4 flex-1">
                                        <h2 className="text-xl font-bold">{userData.name}</h2>
                                        <p className="text-white/60 text-sm">{userData.username}</p>
                                        <p className="text-sm mt-1">{userData.bio}</p>
                                    </div>
                                </motion.div>

                                {/* Stats */}
                                <motion.div
                                    className="grid grid-cols-3 gap-4 mt-6"
                                    variants={staggerItem}
                                >
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-3 text-center"
                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    >
                                        <motion.p
                                            className="text-primary-light text-xl font-bold"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                        >
                                            {userData.followers}
                                        </motion.p>
                                        <p className="text-sm text-white/60">Followers</p>
                                    </motion.div>
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-3 text-center"
                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    >
                                        <p className="text-primary-light text-xl font-bold">{userData.following}</p>
                                        <p className="text-sm text-white/60">Following</p>
                                    </motion.div>
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-3 text-center"
                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    >
                                        <p className="text-primary-light text-xl font-bold">{userData.activity.threads}</p>
                                        <p className="text-sm text-white/60">Threads</p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* User Activity */}
                            <motion.div
                                className="mb-8"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.h3
                                    className="text-lg font-semibold mb-4"
                                    variants={staggerItem}
                                >
                                    Activity
                                </motion.h3>
                                <motion.div
                                    className="grid grid-cols-3 gap-4"
                                    variants={staggerItem}
                                >
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-4"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.1)"
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-2">
                                            <FaVideo className="text-primary-light" />
                                        </div>
                                        <p className="text-xl font-bold">{userData.activity.views}</p>
                                        <p className="text-sm text-white/60">Watched</p>
                                    </motion.div>
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-4"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.1)"
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-2">
                                            <FaComment className="text-primary-light" />
                                        </div>
                                        <p className="text-xl font-bold">{userData.activity.threads}</p>
                                        <p className="text-sm text-white/60">Threads</p>
                                    </motion.div>
                                    <motion.div
                                        className="glass-card bg-white/5 rounded-xl p-4"
                                        whileHover={{
                                            y: -5,
                                            backgroundColor: "rgba(255,255,255,0.1)",
                                            boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.1)"
                                        }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-400/30 flex items-center justify-center mb-2">
                                            <FaShareAlt className="text-primary-light" />
                                        </div>
                                        <p className="text-xl font-bold">{userData.activity.contributions}</p>
                                        <p className="text-sm text-white/60">Shared</p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Watching Series */}
                            <motion.div
                                className="mb-8"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.div
                                    className="flex justify-between items-center mb-4"
                                    variants={staggerItem}
                                >
                                    <h3 className="text-lg font-semibold">Watching</h3>
                                    <button className="text-sm text-primary-light">See All</button>
                                </motion.div>

                                <motion.div
                                    className="space-y-4"
                                    variants={staggerItem}
                                >
                                    {watchingSeries.map((series, index) => (
                                        <motion.div
                                            key={series.id}
                                            className="glass-card bg-white/5 rounded-xl overflow-hidden"
                                            whileHover={{
                                                y: -5,
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                boxShadow: "0 10px 20px -5px rgba(143, 70, 193, 0.2)"
                                            }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: index * 0.1 }
                                            }}
                                        >
                                            <div className="flex">
                                                <div className="w-24 h-24 bg-gray-800 flex-shrink-0 relative overflow-hidden">
                                                    <img
                                                        src={series.thumbnailUrl}
                                                        alt={series.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-br opacity-60 mix-blend-overlay"
                                                        style={{ background: `linear-gradient(to bottom right, var(--primary), var(--primary-secondary))` }}
                                                    ></div>
                                                </div>
                                                <div className="p-3 flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-semibold">{series.title}</h4>
                                                        <motion.button
                                                            onClick={() => handleCreateThread(series.id)}
                                                            className="w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 flex items-center justify-center"
                                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(143, 70, 193, 0.4)" }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaShareAlt className="text-xs" />
                                                        </motion.button>
                                                    </div>
                                                    <p className="text-sm text-white/60">{series.progress} of {series.episodes} episodes</p>
                                                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-primary to-primary-secondary rounded-full"
                                                            style={{ width: `${(series.progress / series.episodes) * 100}%` }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(series.progress / series.episodes) * 100}%` }}
                                                            transition={{ duration: 1, delay: index * 0.2 }}
                                                        ></motion.div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {series.tags.map((tag, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs px-2 py-0.5 bg-white/10 rounded-full"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            {/* Threads Section */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                            >
                                <motion.h3
                                    className="text-lg font-semibold mb-4"
                                    variants={staggerItem}
                                >
                                    Discussion Threads
                                </motion.h3>

                                <motion.div
                                    className="space-y-4"
                                    variants={staggerItem}
                                >
                                    {threadsData.map((thread, index) => (
                                        <motion.div
                                            key={thread.id}
                                            className="glass-card bg-white/5 rounded-xl p-4"
                                            whileHover={{
                                                y: -5,
                                                backgroundColor: "rgba(255,255,255,0.1)",
                                                boxShadow: "0 10px 20px -5px rgba(143, 70, 193, 0.2)"
                                            }}
                                            onClick={() => handleSelectThread(thread.id)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.3 + index * 0.1 }
                                            }}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold">{thread.title}</h4>
                                                    <div className="flex items-center text-sm text-white/60">
                                                        <span>{thread.messages.length} messages</span>
                                                        {thread.episodes && (
                                                            <span className="ml-2 px-2 py-0.5 bg-primary/20 rounded-full text-xs">
                                                                {thread.episodes.filter(ep => ep.viewed).length}/{thread.episodes.length} eps
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex -space-x-2">
                                                    {thread.participants.slice(0, 3).map(participant => (
                                                        <div
                                                            key={participant.id}
                                                            className="w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                                                        >
                                                            <img
                                                                src={participant.avatar}
                                                                alt={participant.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    {thread.participants.length > 3 && (
                                                        <div className="w-8 h-8 rounded-full bg-primary/30 border-2 border-background flex items-center justify-center text-xs">
                                                            +{thread.participants.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Latest message preview */}
                                            <motion.div
                                                className="mt-3 p-3 bg-white/5 rounded-lg relative overflow-hidden"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                transition={{ delay: 0.5 + index * 0.1 }}
                                            >
                                                {/* Shimmer effect */}
                                                <motion.div
                                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                                    initial={{ x: -200, opacity: 0 }}
                                                    animate={{ x: 400, opacity: 1 }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                />

                                                <div className="flex items-center mb-1">
                                                    <div className="w-5 h-5 rounded-full overflow-hidden mr-2">
                                                        <img
                                                            src={thread.participants.find(p => p.id === thread.messages[thread.messages.length - 1].userId)?.avatar}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-xs text-white/60">
                                                        {thread.participants.find(p => p.id === thread.messages[thread.messages.length - 1].userId)?.name} · {thread.messages[thread.messages.length - 1].timestamp}
                                                    </p>
                                                </div>
                                                <p className="text-sm line-clamp-2 relative z-10">
                                                    {thread.messages[thread.messages.length - 1].content}
                                                </p>
                                                {thread.messages[thread.messages.length - 1].episodeRef && (
                                                    <motion.div
                                                        className="mt-2 flex items-center text-xs bg-primary/20 rounded-lg p-2"
                                                        whileHover={{ backgroundColor: "rgba(143, 70, 193, 0.3)" }}
                                                    >
                                                        <FaPlay className="mr-2 text-primary-light" />
                                                        <span>
                                                            Episode {thread.messages[thread.messages.length - 1].episodeRef.number}: {thread.messages[thread.messages.length - 1].episodeRef.timestamp}
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}

                    {/* Thread View */}
                    {viewState === "thread" && selectedThread && (
                        <div className="h-[calc(100vh-128px)] flex flex-col">
                            {/* Episodes Navigation */}
                            <div className="px-4 py-3 border-b border-white/10">
                                <p className="text-sm text-white/60 mb-2">Episodes</p>
                                <div className="flex space-x-3 overflow-x-auto pb-2">
                                    {selectedThread.episodes.map((episode, index) => (
                                        <motion.div
                                            key={episode.number}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden relative ${episode.locked ? 'grayscale' : ''} ${episode.current ? 'ring-2 ring-primary' : episode.viewed ? 'opacity-80' : 'opacity-50'}`}
                                            whileHover={!episode.locked ? {
                                                scale: 1.05,
                                                boxShadow: "0 10px 15px -3px rgba(143, 70, 193, 0.3)"
                                            } : {}}
                                            whileTap={!episode.locked ? { scale: 0.95 } : {}}
                                            onClick={() => handleEpisodeChange(episode.number)}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{
                                                opacity: episode.locked ? 0.5 : 1,
                                                y: 0,
                                                transition: { delay: index * 0.1 }
                                            }}
                                        >
                                            <img
                                                src={episode.thumbnailUrl}
                                                alt={`Episode ${episode.number}`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-1 left-1 text-xs font-bold">{episode.number}</div>

                                            {episode.viewed && (
                                                <motion.div
                                                    className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                >
                                                    <FaCheck className="text-[8px]" />
                                                </motion.div>
                                            )}

                                            {episode.locked && (
                                                <motion.div
                                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 0.7 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                >
                                                    <FaLock className="text-white/80" />
                                                </motion.div>
                                            )}

                                            {episode.current && (
                                                <motion.div
                                                    className="absolute bottom-1 right-1 text-xs font-bold bg-primary/80 rounded-full px-1.5 py-0.5"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    {episode.duration}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Episode Progress */}
                                <div className="mt-3 flex items-center justify-between px-1">
                                    <span className="text-xs text-white/60">Progress</span>
                                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-primary-secondary"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(selectedThread.episodes.filter(ep => ep.viewed).length / selectedThread.episodes.length) * 100}%` }}
                                            transition={{ duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-xs text-white/60">
                                        {selectedThread.episodes.filter(ep => ep.viewed).length}/{selectedThread.episodes.length}
                                    </span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => {
                                    const isCurrentUser = message.userId === userData.id;
                                    const sender = selectedThread.participants.find(p => p.id === message.userId);

                                    return (
                                        <motion.div
                                            key={message.id}
                                            className={`flex ${isCurrentUser ? 'justify-end' : ''}`}
                                            initial={{ opacity: 0, y: 20, x: isCurrentUser ? 20 : -20 }}
                                            animate={{ opacity: 1, y: 0, x: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            {!isCurrentUser && (
                                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                                    <img
                                                        src={sender?.avatar}
                                                        alt={sender?.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <motion.div
                                                className={`max-w-[75%] relative ${isCurrentUser ? 'bg-gradient-to-r from-primary/30 to-primary-secondary/30' : 'bg-white/10'} rounded-2xl p-3 ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                {/* Shimmer effect on hover */}
                                                <motion.div
                                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"
                                                    initial={{ opacity: 0, x: -100 }}
                                                    whileHover={{ opacity: 1, x: 200 }}
                                                    transition={{ duration: 1 }}
                                                />

                                                <div className="flex items-center mb-1">
                                                    <p className="text-xs font-semibold">{isCurrentUser ? 'You' : sender?.name}</p>
                                                    <p className="text-xs text-white/40 ml-2">{message.timestamp}</p>
                                                </div>

                                                <p className="text-sm">{message.content}</p>

                                                {message.episodeRef && (
                                                    <motion.div
                                                        className="mt-2 flex items-center text-xs bg-white/10 rounded-lg p-2 cursor-pointer"
                                                        whileHover={{
                                                            backgroundColor: "rgba(255,255,255,0.15)",
                                                            scale: 1.05
                                                        }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center mr-2">
                                                            <FaPlay className="text-[8px]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">Episode {message.episodeRef.number}: {message.episodeRef.title}</p>
                                                            <p className="text-white/60">{message.episodeRef.timestamp}</p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    );
                                })}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                            <img
                                                src={selectedThread.participants.find(p => p.id !== userData.id)?.avatar}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 px-4">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-white/60 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />

                                {/* What-If UI */}
                                {selectedThread.whatIfScenarios && selectedThread.whatIfScenarios.length > 0 && (
                                    <div className="my-6">
                                        <div className="flex justify-center">
                                            <motion.button
                                                className="bg-primary/20 text-primary-light rounded-full px-4 py-2 flex items-center text-sm"
                                                whileHover={{
                                                    scale: 1.05,
                                                    backgroundColor: "rgba(143, 70, 193, 0.3)",
                                                    boxShadow: "0 0 15px rgba(143, 70, 193, 0.3)"
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={generateWhatIf}
                                                animate={controls}
                                            >
                                                <FaLightbulb className="mr-2" />
                                                <FaMagic className="mr-2" />
                                                Generate What-If Scenario
                                            </motion.button>
                                        </div>

                                        <AnimatePresence>
                                            {showWhatIf && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, y: 20 }}
                                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                    exit={{ opacity: 0, height: 0, y: -20 }}
                                                    transition={{ type: "spring", damping: 20 }}
                                                    className="mt-4 overflow-hidden"
                                                >
                                                    <motion.div
                                                        className="bg-gradient-to-r from-primary/20 to-primary-secondary/20 rounded-xl p-4 border border-primary/30 relative"
                                                        whileHover={{
                                                            scale: 1.02,
                                                            boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.2)"
                                                        }}
                                                    >
                                                        {/* Shimmer effect */}
                                                        <motion.div
                                                            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl"
                                                            initial={{ x: -200 }}
                                                            animate={{ x: 400 }}
                                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                                        />

                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center">
                                                                <motion.div
                                                                    className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center mr-2"
                                                                    animate={{
                                                                        scale: [1, 1.1, 1],
                                                                        boxShadow: [
                                                                            "0 0 0 rgba(143, 70, 193, 0.4)",
                                                                            "0 0 20px rgba(143, 70, 193, 0.6)",
                                                                            "0 0 0 rgba(143, 70, 193, 0.4)"
                                                                        ]
                                                                    }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                >
                                                                    <FaLightbulb className="text-primary-light" />
                                                                </motion.div>
                                                                <h3 className="font-bold gradient-text">
                                                                    What if... black holes are portals?
                                                                </h3>
                                                            </div>
                                                            <motion.button
                                                                className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={() => setShowWhatIf(false)}
                                                            >
                                                                <FaTimes className="text-xs" />
                                                            </motion.button>
                                                        </div>

                                                        <p className="mt-2 text-sm ml-10">Alternative theory generated based on the series content. This could explain disappearing matter.</p>

                                                        <div className="mt-3 ml-10">
                                                            <motion.button
                                                                className="bg-gradient-to-r from-primary/40 to-primary-secondary/40 hover:from-primary/50 hover:to-primary-secondary/50 rounded-full px-3 py-1 text-xs"
                                                                whileHover={{
                                                                    scale: 1.05,
                                                                    boxShadow: "0 0 15px rgba(143, 70, 193, 0.3)"
                                                                }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <span className="flex items-center">
                                                                    <FaRandom className="mr-1" /> Explore this idea
                                                                </span>
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>

                                                    {/* Alternative scenarios */}
                                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                                        {selectedThread.whatIfScenarios.slice(0, 2).map((scenario, idx) => (
                                                            <motion.div
                                                                key={scenario.id}
                                                                className="bg-white/5 rounded-xl p-3 relative overflow-hidden"
                                                                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.3 }}
                                                                whileHover={{
                                                                    backgroundColor: "rgba(255,255,255,0.1)",
                                                                    y: -3
                                                                }}
                                                            >
                                                                <h4 className="text-sm font-semibold mb-1 text-primary-light">
                                                                    {scenario.title}
                                                                </h4>
                                                                <p className="text-xs text-white/70">{scenario.description}</p>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-3 border-t border-white/10">
                                <div className="flex items-center bg-white/5 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-primary/50">
                                    <input
                                        type="text"
                                        placeholder="Message..."
                                        className="bg-transparent flex-1 focus:outline-none text-sm"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <motion.button
                                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.15)" }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FaPlay className="text-xs" />
                                        </motion.button>
                                        <motion.button
                                            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center"
                                            whileHover={{
                                                scale: 1.1,
                                                boxShadow: "0 0 15px rgba(143, 70, 193, 0.5)"
                                            }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <FaPaperPlane className="text-xs" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Thread Flow */}
                    {viewState === "create-thread" && (
                        <div className="px-4 py-6">
                            {/* Step 1: Content Preview */}
                            {createThreadState.step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h3 className="text-lg font-semibold mb-4">Share Series</h3>

                                    {/* Series preview */}
                                    <div className="glass-card bg-white/5 rounded-xl overflow-hidden mb-6">
                                        <div className="h-40 relative">
                                            <img
                                                src={getSeriesById(createThreadState.seriesId)?.thumbnailUrl}
                                                alt={getSeriesById(createThreadState.seriesId)?.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-tr opacity-60 ${getSeriesById(createThreadState.seriesId)?.color || 'from-primary to-primary-secondary'}`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 w-full p-4">
                                                <h4 className="text-xl font-bold">{getSeriesById(createThreadState.seriesId)?.title}</h4>
                                                <p className="text-sm text-white/80">Part 1 of {getSeriesById(createThreadState.seriesId)?.episodes}</p>
                                            </div>

                                            {/* Animated tag */}
                                            <motion.div
                                                className="absolute top-3 right-3 bg-primary/80 text-white text-xs px-3 py-1 rounded-full"
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                {getSeriesById(createThreadState.seriesId)?.tags[0]}
                                            </motion.div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-4 px-1">
                                                <p className="text-sm text-white/80 mb-3">
                                                    {getSeriesById(createThreadState.seriesId)?.description}
                                                </p>

                                                <div className="flex items-center space-x-2">
                                                    <div className="flex items-center space-x-1 text-sm text-white/60">
                                                        <FaClock className="text-xs" />
                                                        <span>5-7 min per episode</span>
                                                    </div>
                                                    <div className="h-4 w-px bg-white/20"></div>
                                                    <div className="flex items-center space-x-1 text-sm text-white/60">
                                                        <FaGraduationCap className="text-xs" />
                                                        <span>Beginner friendly</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <h5 className="font-semibold mb-3">Share Options</h5>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <motion.button
                                                        className="glass-card bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center border-2 border-primary"
                                                        whileHover={{
                                                            backgroundColor: "rgba(255,255,255,0.1)",
                                                            y: -5,
                                                            boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.3)"
                                                        }}
                                                        animate={{
                                                            boxShadow: ["0 0 0px rgba(143, 70, 193, 0.3)", "0 0 20px rgba(143, 70, 193, 0.5)", "0 0 0px rgba(143, 70, 193, 0.3)"]
                                                        }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                                                            <FaComment className="text-primary-light" />
                                                        </div>
                                                        <span className="text-sm font-semibold">Create Thread</span>
                                                        <span className="text-xs text-white/60">Discuss with friends</span>
                                                    </motion.button>

                                                    <motion.button
                                                        className="glass-card bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center"
                                                        whileHover={{
                                                            backgroundColor: "rgba(255,255,255,0.1)",
                                                            y: -5
                                                        }}
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                                                            <FaShareAlt className="text-white/80" />
                                                        </div>
                                                        <span className="text-sm font-semibold">Share Link</span>
                                                        <span className="text-xs text-white/60">Copy or send</span>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <motion.button
                                                    className="bg-gradient-to-r from-primary to-primary-secondary hover:from-primary-dark hover:to-primary-secondary rounded-full px-4 py-2 flex items-center"
                                                    whileHover={{
                                                        scale: 1.05,
                                                        boxShadow: "0 5px 15px rgba(143, 70, 193, 0.4)"
                                                    }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setCreateThreadState(prev => ({ ...prev, step: 2 }))}
                                                >
                                                    <span className="mr-2">Create Thread</span>
                                                    <FaPlus className="text-xs" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Friend Selection */}
                            {createThreadState.step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h3 className="text-lg font-semibold mb-4">Select Friends</h3>

                                    {/* Search bar */}
                                    <div className="relative mb-6">
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full bg-white/5 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
                                    </div>

                                    {/* Selected Friends */}
                                    <AnimatePresence>
                                        {createThreadState.selectedFriends.length > 0 && (
                                            <motion.div
                                                className="mb-4"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                            >
                                                <p className="text-sm text-white/60 mb-2">Selected ({createThreadState.selectedFriends.length})</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {createThreadState.selectedFriends.map((friend, index) => (
                                                        <motion.div
                                                            key={friend.id}
                                                            className="flex items-center bg-primary/20 rounded-full pl-2 pr-3 py-1"
                                                            onClick={() => toggleFriendSelection(friend)}
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileHover={{
                                                                backgroundColor: "rgba(143, 70, 193, 0.3)",
                                                            }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                                                <img
                                                                    src={friend.avatar}
                                                                    alt={friend.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <span className="text-sm">{friend.name}</span>
                                                            <motion.div
                                                                whileHover={{ rotate: 90 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <FaTimes className="ml-2 text-xs" />
                                                            </motion.div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Friends list */}
                                    <motion.div variants={staggerContainer} initial="hidden" animate="show">
                                        <motion.p
                                            className="text-sm text-white/60 mb-2"
                                            variants={staggerItem}
                                        >
                                            Suggested
                                        </motion.p>
                                        <div className="space-y-3">
                                            {friendsData.map((friend, index) => (
                                                <motion.div
                                                    key={friend.id}
                                                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                                                    variants={staggerItem}
                                                    whileHover={{
                                                        backgroundColor: "rgba(255,255,255,0.1)",
                                                        y: -2,
                                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleFriendSelection(friend)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                                <img
                                                                    src={friend.avatar}
                                                                    alt={friend.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            {friend.isOnline && (
                                                                <motion.div
                                                                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                                                                    animate={{
                                                                        boxShadow: [
                                                                            "0 0 0px rgba(74, 222, 128, 0)",
                                                                            "0 0 8px rgba(74, 222, 128, 0.6)",
                                                                            "0 0 0px rgba(74, 222, 128, 0)"
                                                                        ]
                                                                    }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                ></motion.div>
                                                            )}
                                                        </div>

                                                        <div className="ml-3">
                                                            <p className="font-semibold">{friend.name}</p>
                                                            <p className="text-xs text-white/60">
                                                                {friend.isOnline ? 'Online now' : friend.lastActive ? `Last active: ${friend.lastActive}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className={`w-6 h-6 rounded-full ${createThreadState.selectedFriends.some(f => f.id === friend.id) ? 'bg-primary' : 'bg-white/10'} flex items-center justify-center`}>
                                                        {createThreadState.selectedFriends.some(f => f.id === friend.id) && (
                                                            <FaCheck className="text-xs" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Create button */}
                                    <div className="mt-8 flex justify-end">
                                        <motion.button
                                            className={`rounded-full px-6 py-3 flex items-center ${createThreadState.selectedFriends.length > 0 ? 'bg-gradient-to-r from-primary to-primary-secondary' : 'bg-white/10'}`}
                                            whileHover={createThreadState.selectedFriends.length > 0 ? {
                                                scale: 1.05,
                                                boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.3)"
                                            } : {}}
                                            whileTap={createThreadState.selectedFriends.length > 0 ? { scale: 0.95 } : {}}
                                            disabled={createThreadState.selectedFriends.length === 0}
                                            onClick={() => setViewState("profile")}
                                        >
                                            <span>Create Thread</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.main>
            </AnimatePresence>

            {/* Bottom Navigation */}
            <motion.nav
                className="fixed bottom-0 inset-x-0 h-16 bg-background/80 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-20"
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
            >
                <motion.button
                    className="flex flex-col items-center justify-center w-16"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="w-6 h-6 flex items-center justify-center mb-1">
                        <FaVideo className="text-white/60" />
                    </div>
                    <span className="text-xs text-white/60">Feed</span>
                </motion.button>

                <motion.button
                    className="flex flex-col items-center justify-center w-16"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="w-6 h-6 flex items-center justify-center mb-1">
                        <FaSearch className="text-white/60" />
                    </div>
                    <span className="text-xs text-white/60">Explore</span>
                </motion.button>

                <motion.button
                    className="flex flex-col items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary-secondary flex items-center justify-center -mt-6"
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(143, 70, 193, 0.3)",
                                "0 0 20px rgba(143, 70, 193, 0.5)",
                                "0 0 0px rgba(143, 70, 193, 0.3)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <FaPlus />
                    </motion.div>
                </motion.button>

                <motion.button
                    className="flex flex-col items-center justify-center w-16"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="w-6 h-6 flex items-center justify-center mb-1">
                        <FaComment className="text-white/60" />
                    </div>
                    <span className="text-xs text-white/60">Threads</span>
                </motion.button>

                <motion.button
                    className="flex flex-col items-center justify-center w-16"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <div className="w-6 h-6 flex items-center justify-center mb-1">
                        <FaUser className="text-primary-light" />
                    </div>
                    <span className="text-xs text-primary-light">Profile</span>
                </motion.button>
            </motion.nav>

            {/* CSS Styles */}
            <style jsx global>{`
        .glass-card {
          background: rgba(36, 27, 46, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .gradient-text {
          background: linear-gradient(to right, var(--primary), var(--primary-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
        </div>
    );
}