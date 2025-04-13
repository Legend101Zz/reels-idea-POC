"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaSearch, FaBell, FaChevronRight } from 'react-icons/fa';

// Mock data for trending cards
const trendingCards = [
  {
    id: 'card1',
    title: 'Black Holes Explained',
    subtitle: 'Learn How To Escape With Relativity (Or Not!)',
    color: 'from-blue-600 to-purple-700',
    image: '/api/placeholder/400/500'
  },
  {
    id: 'card2',
    title: 'Inner Peace',
    subtitle: 'Mastering The Concept Of Daily Meditation',
    color: 'from-purple-600 to-pink-600',
    image: '/api/placeholder/400/500'
  },
  {
    id: 'card3',
    title: 'Quantum Physics',
    subtitle: 'Understanding The Building Blocks Of Reality',
    color: 'from-yellow-500 to-orange-600',
    image: '/api/placeholder/400/500'
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
  animate: (i: any) => ({
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
  }
};

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-background via-background to-bg-light text-white overflow-x-hidden">
      {/* Background animated shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary-light/10 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Header */}
      <motion.header
        className="relative z-10 px-6 py-4 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold">K</span>
          </div>
          <h1 className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light hidden md:block">
            KnowScroll
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSearch className="text-lg" />
          </motion.button>
          <motion.button
            className="w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBell className="text-lg" />
          </motion.button>
        </div>
      </motion.header>

      <main className="relative z-10 mt-4 px-6">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-12 text-center md:text-left max-w-4xl mx-auto md:mx-0"
        >
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="block">
              Learn with Joy,
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
              Scroll with Purpose
            </span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-8"
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
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-light rounded-full font-semibold text-white shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(124, 77, 255, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                Start Exploring
              </motion.div>
            </Link>
            <motion.button
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
            >
              Watch Demo
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
            className="flex justify-between items-center mb-4"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 12L5 9M5 9L12 2L19 9M5 9V21M19 9L22 12M19 9V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Trending Today</h3>
            </div>
            <Link href="/trending">
              <motion.div
                className="flex items-center text-sm text-gray-300 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="relative h-96 md:h-[450px] flex justify-center">
            {trendingCards.map((card, i) => (
              <Link href="/feed" key={card.id}>
                <motion.div
                  className={`absolute w-64 md:w-72 h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl 
                              bg-gradient-to-b ${card.color} p-4 flex flex-col justify-between
                              border border-white/10`}
                  style={{
                    left: `calc(50% - ${32 * (trendingCards.length - 1) / 2}% + ${i * 32}%)`,
                    marginTop: `${i * 10}px`,
                    zIndex: trendingCards.length - i
                  }}
                  custom={i}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md" />
                  </div>

                  <div className="relative z-10 text-white">
                    <h4 className="text-2xl font-bold mb-2">{card.title}</h4>
                    <p className="text-sm text-white/80 mb-4">{card.subtitle}</p>
                    <motion.button
                      className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Click To Play
                    </motion.button>
                  </div>
                </motion.div>
              </Link>
            ))}
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
            Discover the <span className="text-primary-light">KnowScroll</span> Experience
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
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories Section */}
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
            <h3 className="text-xl font-bold">Browse Categories</h3>
            <Link href="/categories">
              <motion.div
                className="flex items-center text-sm text-gray-300 hover:text-white"
                whileHover={{ x: 3 }}
              >
                View All <FaChevronRight className="ml-1 text-xs" />
              </motion.div>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Physics", color: "from-blue-600 to-indigo-700", icon: "🔭" },
              { name: "History", color: "from-amber-500 to-red-600", icon: "📜" },
              { name: "Psychology", color: "from-green-500 to-teal-700", icon: "🧠" },
              { name: "Technology", color: "from-purple-600 to-pink-600", icon: "💻" }
            ].map((category, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`rounded-xl overflow-hidden h-32 bg-gradient-to-r ${category.color} relative`}
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-4xl">
                  {category.icon}
                </div>
                <div className="absolute bottom-0 inset-x-0 h-12 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <h4 className="font-semibold">{category.name}</h4>
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
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1, color: "#B599FF" }}
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
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1, color: "#B599FF" }}
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
            className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center -mt-4 shadow-lg"
            whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(124, 77, 255, 0.5)" }}
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
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1, color: "#B599FF" }}
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
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1, color: "#B599FF" }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </motion.div>
        </Link>
      </motion.nav>
    </div>
  );
}