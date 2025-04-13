"use client"

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaChevronRight, FaPlay } from 'react-icons/fa';

// Enhanced trending cards with more detailed data
const trendingCards = [
  {
    id: 'card1',
    title: 'Black Holes Explained',
    subtitle: 'Learn How To Escape With Relativity (Or Not!)',
    color: 'from-[#8f46c1] to-[#a0459b]',
    image: '/test.jpeg',
    author: 'Dr. Alex Chen',
    views: '12.5k',
    duration: '8 min'
  },
  {
    id: 'card2',
    title: 'Inner Peace',
    subtitle: 'Mastering The Concept Of Daily Meditation',
    color: 'from-[#a0459b] to-[#bd4580]',
    image: '/test.jpeg',
    author: 'Maya Wilson',
    views: '9.8k',
    duration: '5 min'
  },
  {
    id: 'card3',
    title: 'Quantum Physics',
    subtitle: 'Understanding The Building Blocks Of Reality',
    color: 'from-[#bd4580] to-[#d56f66]',
    image: '/test.jpeg',
    author: 'Prof. James Liu',
    views: '11.2k',
    duration: '7 min'
  }
];

// Categories with enhanced design
const categories = [
  {
    name: "Physics",
    color: "from-[#8f46c1] to-[#a0459b]",
    icon: "🔭",
    courses: 42
  },
  {
    name: "History",
    color: "from-[#a0459b] to-[#bd4580]",
    icon: "📜",
    courses: 38
  },
  {
    name: "Psychology",
    color: "from-[#bd4580] to-[#c85975]",
    icon: "🧠",
    courses: 27
  },
  {
    name: "Technology",
    color: "from-[#c85975] to-[#d56f66]",
    icon: "💻",
    courses: 64
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants = {
  initial: { scale: 0.9, rotate: -5, opacity: 0 },
  animate: (i) => ({
    scale: 1,
    rotate: i % 2 === 0 ? -2 : 2,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.1
    }
  }),
  hover: {
    scale: 1.05,
    rotate: 0,
    zIndex: 10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    rotate: 0
  },
  exit: (i) => ({
    x: i % 2 === 0 ? -1000 : 1000,
    opacity: 0,
    transition: { duration: 0.5 }
  })
};

// Enhanced shimmer effect
const shimmer = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 300,
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardsControls = useAnimation();
  const cardsRef = useRef();

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle card swipe
  const handleSwipe = (direction) => {
    setSwipeDirection(direction);

    cardsControls.start({
      x: direction === 'left' ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5 }
    }).then(() => {
      setCurrentCardIndex((prev) =>
        direction === 'left'
          ? (prev + 1) % trendingCards.length
          : (prev - 1 + trendingCards.length) % trendingCards.length
      );
      cardsControls.set({ x: 0, opacity: 1 });
      setSwipeDirection(null);
    });
  };

  // Handle drag end for swipe
  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      handleSwipe('left');
    } else if (info.offset.x > threshold) {
      handleSwipe('right');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0c0612] via-[#131019] to-[#1a1522] text-white overflow-x-hidden font-sans">
      {/* Background animated shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#8f46c1]/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-[#d56f66]/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#a0459b]/10 blur-3xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '40%', right: '25%' }}
        />
      </div>

      {/* Initial Loading Animation */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0612]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">K</span>
              </div>
              <motion.div
                className="h-1 bg-white/20 rounded-full mt-4 w-32"
                initial={{ width: 0 }}
                animate={{ width: 128 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <motion.div
            className="w-10 h-10 bg-gradient-to-tr from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl font-bold">K</span>
          </motion.div>
          <motion.h1
            className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66] hidden md:block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            KnowScroll
          </motion.h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch className="text-lg" />
          </motion.button>
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-[#d56f66] rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            />
            <motion.button
              className="w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10"
            >
              <FaBell className="text-lg" />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      <main className="relative z-10 mt-2 px-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center md:text-left max-w-4xl mx-auto md:mx-0"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="block mb-2">
              Learn with Joy,
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
              Scroll with Purpose
            </span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-white/70 mb-8 max-w-xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Transform mindless scrolling into effortless learning with our multi-dimensional content experience.
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Link href="/feed">
              <motion.div
                className="px-8 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full font-semibold text-white shadow-lg flex items-center justify-center"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Start Exploring</span>
                <motion.span
                  initial={{ x: 0, opacity: 0 }}
                  whileHover={{ x: 5, opacity: 1 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.div>
            </Link>
            <motion.button
              className="px-8 py-3 bg-white/5 backdrop-blur-md rounded-full font-semibold text-white shadow-lg border border-white/10"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center">
                <FaPlay className="mr-2 text-sm" /> Watch Demo
              </span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Trending Cards Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Trending Today</h3>
            </div>
            <Link href="/trending">
              <motion.div
                className="flex items-center text-sm text-white/70 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="relative h-96 md:h-[450px] flex justify-center overflow-hidden">
            <motion.div
              ref={cardsRef}
              className="relative w-full h-full"
              animate={cardsControls}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Swipe Indicators */}
              <AnimatePresence>
                {swipeDirection === 'left' && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-start pl-6 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <FaChevronRight className="text-xl text-white" />
                    </div>
                  </motion.div>
                )}
                {swipeDirection === 'right' && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <FaChevronRight className="text-xl text-white transform rotate-180" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Cards */}
              <div className="relative h-96 md:h-[450px] flex justify-center">
                {trendingCards.map((card, i) => (
                  <Link href="/feed" key={card.id}>
                    <motion.div
                      className={`absolute w-72 md:w-80 h-96 md:h-[450px] rounded-3xl overflow-hidden shadow-xl 
                                  border border-white/10 ${i === currentCardIndex ? 'block' : 'hidden'}`}
                      style={{
                        left: '50%',
                        top: '50%',
                        x: '-50%',
                        y: '-50%',
                      }}
                      custom={i}
                      variants={cardVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      exit="exit"
                    >
                      {/* Card Background with Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                      <div className={`absolute inset-0 bg-gradient-to-tr ${card.color} opacity-90`} />

                      {/* Shimmer effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                        variants={shimmer}
                        initial="hidden"
                        whileHover="visible"
                      />

                      {/* Card Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            {card.icon || '📚'}
                          </div>
                          <div className="flex space-x-1">
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                              {card.views}
                            </div>
                            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                              {card.duration}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 text-xs font-medium text-white/70">BY {card.author}</div>
                          <h4 className="text-2xl font-bold mb-2">{card.title}</h4>
                          <p className="text-sm text-white/80 mb-6">{card.subtitle}</p>

                          <div className="flex justify-between items-center">
                            <motion.button
                              className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm flex items-center"
                              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaPlay className="mr-2 text-xs" /> Watch Now
                            </motion.button>

                            <div className="flex space-x-1">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-white/50"
                                animate={{ opacity: currentCardIndex === 0 ? 1 : 0.5 }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-white/50"
                                animate={{ opacity: currentCardIndex === 1 ? 1 : 0.5 }}
                              />
                              <motion.div
                                className="w-2 h-2 rounded-full bg-white/50"
                                animate={{ opacity: currentCardIndex === 2 ? 1 : 0.5 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Swipe Instructions (Mobile only) */}
            <motion.div
              className="absolute bottom-2 left-0 right-0 flex justify-center md:hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/70">
                Swipe cards to explore more
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-16 max-w-4xl mx-auto"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold mb-8 text-center"
          >
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">KnowScroll</span> Experience
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "↕️",
                title: "Vertical Exploration",
                description: "Swipe up/down to navigate through series and dive deeper into topics"
              },
              {
                icon: "↔️",
                title: "Alternate Perspectives",
                description: "Swipe left/right to explore different viewpoints on the same subject"
              },
              {
                icon: "💬",
                title: "Squad Huddles",
                description: "Join collaborative learning chats to discuss and solve challenges together"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  backgroundColor: "rgba(255, 255, 255, 0.08)"
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center mb-6"
          >
            <h3 className="text-xl font-bold">Browse Categories</h3>
            <Link href="/categories">
              <motion.div
                className="flex items-center text-sm text-white/70 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`rounded-xl overflow-hidden h-36 bg-gradient-to-r ${category.color} relative border border-white/10`}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  scale: 1.02
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  {category.icon}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h4 className="font-semibold text-lg">{category.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/70">{category.courses} courses</span>
                    <motion.div
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.2)", scale: 1.1 }}
                    >
                      <FaChevronRight className="text-xs" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* Navigation */}
      <motion.nav
        className="fixed bottom-0 inset-x-0 h-16 bg-black/30 backdrop-blur-md border-t border-white/10 flex items-center justify-around z-20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring" }}
      >
        <Link href="/">
          <motion.div
            className="flex flex-col items-center text-white"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </motion.div>
        </Link>

        <Link href="/feed">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span className="text-xs mt-1">Feed</span>
          </motion.div>
        </Link>

        <Link href="/create">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full flex items-center justify-center -mt-4 shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.div>
        </Link>

        <Link href="/explore">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-xs mt-1">Explore</span>
          </motion.div>
        </Link>

        <Link href="/profile">
          <motion.div
            className="flex flex-col items-center text-white/70"
            whileHover={{ scale: 1.1, color: "#d56f66" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#d56f66] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: "spring" }}
              />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </motion.div>
        </Link>
      </motion.nav>
    </div>
  );
}