"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaUsers, FaPlay, FaChevronRight, FaBrain, FaClock, FaStar, FaCompass, FaGraduationCap, FaRegLightbulb } from 'react-icons/fa';
import Link from 'next/link';

// Sample content cards data for reels
const reels = [
  {
    id: 'reel1',
    title: 'Black Holes Explained',
    subtitle: 'Event Horizons & Beyond',
    color: 'from-[#8f46c1] to-[#a0459b]',
    secondaryColor: '#8f46c1',
    duration: '5:20',
    views: '12.5k',
    instructor: 'Dr. Alex Chen',
    tags: ['Physics', 'Space', 'Astronomy']
  },
  {
    id: 'reel2',
    title: 'Inner Peace',
    subtitle: 'Meditation Fundamentals',
    color: 'from-[#a0459b] to-[#bd4580]',
    secondaryColor: '#a0459b',
    duration: '4:10',
    views: '9.8k',
    instructor: 'Maya Wilson',
    tags: ['Mindfulness', 'Psychology', 'Health']
  },
  {
    id: 'reel3',
    title: 'Quantum Physics',
    subtitle: 'Wave-Particle Duality',
    color: 'from-[#bd4580] to-[#d56f66]',
    secondaryColor: '#bd4580',
    duration: '6:40',
    views: '11.2k',
    instructor: 'Prof. James Liu',
    tags: ['Physics', 'Science', 'Quantum']
  },
  {
    id: 'reel4',
    title: 'Ancient Rome',
    subtitle: 'Rise of the Empire',
    color: 'from-[#8f46c1] to-[#bd4580]',
    secondaryColor: '#9a4bb3',
    duration: '7:15',
    views: '8.4k',
    instructor: 'Dr. Sarah Miller',
    tags: ['History', 'Civilization', 'Politics']
  },
  {
    id: 'reel5',
    title: 'AI Revolution',
    subtitle: 'Machine Learning Basics',
    color: 'from-[#a0459b] to-[#d56f66]',
    secondaryColor: '#c84d7b',
    duration: '5:50',
    views: '10.7k',
    instructor: 'Michael Zhang',
    tags: ['Technology', 'AI', 'Computing']
  }
];

export default function KnowscrollExperience() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDeckExpanded, setIsDeckExpanded] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(2); // Middle card as default
  const [hoveredReelIndex, setHoveredReelIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const deckRef = useRef(null);
  const deckControls = useAnimation();

  // Check if mobile and set appropriate view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle advancing to next card
  const showNextCard = () => {
    if (isAnimating || isDeckExpanded) return;

    setIsAnimating(true);

    // Calculate next card index
    const nextIndex = (selectedReelIndex + 1) % reels.length;

    // Animate current card out
    deckControls.start({
      x: -300,
      opacity: 0,
      rotateY: 45,
      transition: { duration: 0.4 }
    }).then(() => {
      setSelectedReelIndex(nextIndex);
      deckControls.set({
        x: 300,
        opacity: 0,
        rotateY: -45,
        transition: { duration: 0 }
      });
      return deckControls.start({
        x: 0,
        opacity: 1,
        rotateY: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      });
    }).then(() => {
      setIsAnimating(false);
    });
  };

  // Handle deck expansion
  const toggleDeckExpansion = () => {
    if (isMobile) return;
    if (!isDeckExpanded && !isAnimating) {
      showNextCard();
    } else {
      setIsDeckExpanded(!isDeckExpanded);
    }
  };

  // Handle card selection from expanded deck
  const selectReel = (index) => {
    if (isDeckExpanded && !isAnimating) {
      setSelectedReelIndex(index);
      setIsDeckExpanded(false);
    }
  };

  // The benefit stats for guilt-free section
  const scrollBenefits = [
    {
      value: '85%',
      label: 'Knowledge Retention',
      color: 'text-[#8f46c1]',
      icon: <FaBrain className="text-lg" />
    },
    {
      value: '3x',
      label: 'Learning Efficiency',
      color: 'text-[#a0459b]',
      icon: <FaGraduationCap className="text-lg" />
    },
    {
      value: '-32%',
      label: 'Mindless Scrolling',
      color: 'text-[#d56f66]',
      icon: <FaClock className="text-lg" />
    }
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Card Deck Section */}
      <section className="relative mb-24 h-[520px] md:h-[600px]">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#8f46c1]/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#d56f66]/10 blur-3xl" />
        </div>

        {/* Section Title */}
        <div className="relative z-10 text-center pt-8 pb-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
              Knowledge
            </span> At Your Fingertips
          </motion.h2>
        </div>

        {/* Desktop 3D Card Deck */}
        {!isMobile && (
          <div
            className="relative w-full h-[450px] flex items-center justify-center perspective-1000"
            ref={deckRef}
          >
            <div className="relative w-full max-w-4xl mx-auto h-full flex items-center justify-center">
              {/* Deck instruction indicator */}
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: isDeckExpanded ? 0 : 0.9,
                  y: isDeckExpanded ? -30 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm flex items-center">
                  {isDeckExpanded ? "Select a reel" : "Click to see next reel"}
                  <FaChevronRight className="ml-1 text-xs" />
                </span>
              </motion.div>

              {/* The actual card deck */}
              <div
                className="relative w-80 h-96 cursor-pointer"
                onClick={toggleDeckExpansion}
              >
                <motion.div
                  className="absolute inset-0 z-50"
                  animate={deckControls}
                />

                {reels.map((reel, index) => {
                  // Calculate deck card positioning
                  const isSelected = index === selectedReelIndex;
                  const totalCards = reels.length;
                  const middleIndex = Math.floor(totalCards / 2);

                  // Base positions for stacked deck
                  const stackedRotateY = 0;
                  const stackedRotateZ = (index - middleIndex) * 1.5; // Slight rotation for stacked cards
                  const stackedTranslateX = (index - middleIndex) * 4; // Slight offset for stacked cards
                  const stackedTranslateY = (index - middleIndex) * 2;
                  const stackedZIndex = totalCards - Math.abs(index - middleIndex);
                  const stackedScale = 1 - Math.abs(index - middleIndex) * 0.03;

                  // Positions for expanded fan deck
                  const fanRotateY = 0;
                  const fanRotateZ = (index - middleIndex) * 10; // Spread cards in fan
                  const fanTranslateX = (index - middleIndex) * 120; // Spread cards horizontally
                  const fanTranslateY = Math.abs(index - middleIndex) * 10; // Slight vertical adjustment
                  const fanZIndex = isSelected ? 50 : totalCards - Math.abs(index - middleIndex);
                  const fanScale = isSelected ? 1.05 : 0.95; // Selected card slightly larger

                  // Use expanded or stacked values based on state
                  const rotateY = isDeckExpanded ? fanRotateY : stackedRotateY;
                  const rotateZ = isDeckExpanded ? fanRotateZ : stackedRotateZ;
                  const translateX = isDeckExpanded ? fanTranslateX : stackedTranslateX;
                  const translateY = isDeckExpanded ? fanTranslateY : stackedTranslateY;
                  const zIndex = isDeckExpanded ? fanZIndex : stackedZIndex;
                  const scale = isDeckExpanded ? fanScale : stackedScale;

                  return (
                    <motion.div
                      key={reel.id}
                      className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg preserve-3d cursor-pointer"
                      style={{
                        zIndex,
                        transformOrigin: "bottom center",
                        boxShadow: isSelected
                          ? "0 10px 30px rgba(0,0,0,0.3)"
                          : "0 5px 15px rgba(0,0,0,0.2)"
                      }}
                      initial={false}
                      animate={{
                        rotateY,
                        rotateZ,
                        x: translateX,
                        y: translateY,
                        scale
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25
                      }}
                      whileHover={isDeckExpanded ? {
                        scale: 1.02,
                        y: translateY - 10,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                      } : {}}
                      onClick={(e) => {
                        e.stopPropagation();
                        selectReel(index);
                      }}
                      onHoverStart={() => setHoveredReelIndex(index)}
                      onHoverEnd={() => setHoveredReelIndex(null)}
                    >
                      {/* Card content */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        {/* Card background with gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${reel.color}`} />

                        {/* Parallax shine effect on hover */}
                        {hoveredReelIndex === index && isDeckExpanded && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0"
                            initial={{ opacity: 0, x: -200 }}
                            animate={{ opacity: 1, x: 300 }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
                          />
                        )}

                        {/* Card content overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6">
                          {/* Card header */}
                          <div className="flex justify-between items-start">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                              Episode 1
                            </div>

                            <div className="flex space-x-2">
                              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center">
                                <FaClock className="mr-1 text-[10px]" /> {reel.duration}
                              </div>

                              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center">
                                <FaStar className="mr-1 text-[10px] text-yellow-400" /> 4.8
                              </div>
                            </div>
                          </div>

                          {/* Card body */}
                          <div>
                            {/* Instructor info */}
                            <div className="mb-2 flex items-center">
                              <div className="w-6 h-6 rounded-full bg-white/20 mr-2 flex items-center justify-center text-xs font-bold">
                                {reel.instructor.charAt(0)}
                              </div>
                              <span className="text-xs text-white/80">{reel.instructor}</span>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold mb-1">{reel.title}</h3>
                            <p className="text-white/80 text-sm mb-4">{reel.subtitle}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {reel.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-white/10 backdrop-blur-md px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Watch button */}
                            <motion.button
                              className={`px-5 py-2 bg-gradient-to-r ${reel.color} rounded-full text-sm flex items-center`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaPlay className="mr-2 text-xs" /> Watch Now
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Card edge styling for 3D effect */}
                      <div className="absolute inset-y-0 -right-[1px] w-[1px] bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>
                      <div className="absolute inset-y-0 -left-[1px] w-[1px] bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>
                      <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5"></div>
                      <div className="absolute inset-x-0 -top-[1px] h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5"></div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Deck interaction indicators */}
              {!isDeckExpanded && (
                <motion.div
                  className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    y: [0, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FaPlay className="text-xl text-white/70" />
                    <span className="ml-2 text-sm text-white/70">Tap to browse reels</span>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Card Carousel */}
        {isMobile && (
          <div className="relative w-full h-[420px] overflow-hidden bg-gradient-to-b from-black/20 to-transparent rounded-3xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-[300px] h-[380px]">
                <AnimatePresence>
                  {reels.map((reel, index) => {
                    const isActive = index === selectedReelIndex;

                    return (
                      <motion.div
                        key={reel.id}
                        className="absolute w-full h-full"
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                          rotateY: 45,
                          x: 300
                        }}
                        animate={isActive ? {
                          scale: 1,
                          opacity: 1,
                          rotateY: 0,
                          x: 0,
                          zIndex: 20
                        } : {
                          scale: 0.8,
                          opacity: 0,
                          rotateY: -45,
                          x: -300,
                          zIndex: 10
                        }}
                        exit={{
                          scale: 0.8,
                          opacity: 0,
                          rotateY: -45,
                          x: -300,
                          zIndex: 10
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      >
                        {/* Mobile card content */}
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-white/10 transform preserve-3d">
                          {/* Card background */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${reel.color}`} />

                          {/* Card shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                            initial={{ x: -200 }}
                            animate={{ x: 300 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                          />

                          {/* Content overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6">
                            <div className="flex justify-between">
                              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                                EP.1
                              </div>
                              <div className="flex space-x-2">
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center">
                                  <FaClock className="mr-1 text-[10px]" /> {reel.duration}
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center">
                                  <FaStar className="mr-1 text-[10px] text-yellow-400" /> 4.8
                                </div>
                              </div>
                            </div>

                            <div>
                              {/* Instructor info */}
                              <div className="mb-2 flex items-center">
                                <div className="w-6 h-6 rounded-full bg-white/20 mr-2 flex items-center justify-center text-xs font-bold">
                                  {reel.instructor.charAt(0)}
                                </div>
                                <span className="text-xs text-white/80">{reel.instructor}</span>
                              </div>

                              <h3 className="text-2xl font-bold mb-1">{reel.title}</h3>
                              <p className="text-white/80 text-sm mb-4">{reel.subtitle}</p>

                              <div className="flex flex-wrap gap-2 mb-6">
                                {reel.tags.map((tag, i) => (
                                  <span key={i} className="text-xs bg-white/10 backdrop-blur-md px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <motion.button
                                className={`w-full px-4 py-3 bg-gradient-to-r ${reel.color} rounded-full text-sm flex items-center justify-center`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaPlay className="mr-2 text-xs" /> Watch Now
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="absolute inset-y-0 left-0 flex items-center z-30">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center -ml-2"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (!isAnimating) {
                        setSelectedReelIndex((prev) =>
                          (prev - 1 + reels.length) % reels.length
                        );
                      }
                    }}
                  >
                    <FaChevronRight className="text-sm transform rotate-180" />
                  </motion.button>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center z-30">
                  <motion.button
                    className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center -mr-2"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (!isAnimating) {
                        setSelectedReelIndex((prev) =>
                          (prev + 1) % reels.length
                        );
                      }
                    }}
                  >
                    <FaChevronRight className="text-sm" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Card indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex space-x-2">
                {reels.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === selectedReelIndex ? 'bg-white' : 'bg-white/30'}`}
                    whileHover={{ scale: 1.5 }}
                    onClick={() => {
                      if (!isAnimating) {
                        setSelectedReelIndex(i);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Multi-dimensional Navigation Section */}
      <section className="relative mb-20">
        <motion.div
          className="max-w-5xl mx-auto px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">
                Multi-Dimensional
              </span> Navigation
            </h2>
            <p className="text-white/70 max-w-xl mx-auto">
              Move beyond linear content with our revolutionary navigation system
            </p>
          </motion.div>

          {/* Navigation methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Vertical Navigation */}
            <NavigationMethod
              title="Series Progression"
              description="Episode by episode learning journey"
              direction="vertical"
              color="#8f46c1"
              gradientFrom="from-[#8f46c1]/20"
              gradientTo="to-transparent"
              borderColor="border-[#8f46c1]/30"
            />

            {/* Horizontal Navigation */}
            <NavigationMethod
              title="Alternate Perspectives"
              description="Different angles on the same topic"
              direction="horizontal"
              color="#a0459b"
              gradientFrom="from-[#a0459b]/20"
              gradientTo="to-transparent"
              borderColor="border-[#a0459b]/30"
            />

            {/* Social Navigation */}
            <NavigationMethod
              title="Squad Huddles"
              description="Collaborative learning discussions"
              direction="social"
              color="#d56f66"
              gradientFrom="from-[#d56f66]/20"
              gradientTo="to-transparent"
              borderColor="border-[#d56f66]/30"
            />
          </div>
        </motion.div>
      </section>

      {/* Guilt-Free Scrolling Section */}
      <section className="relative mb-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0612] to-[#1a1522] border border-white/10" />

            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                {/* Left column - text content */}
                <div className="md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center mr-3">
                        <FaRegLightbulb className="text-xl" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold">
                        Guilt-Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8f46c1] to-[#d56f66]">Scrolling</span>
                      </h2>
                    </div>

                    <p className="text-white/70 mb-8 text-lg">
                      Transform idle time into knowledge growth. Every swipe becomes a meaningful learning moment.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {scrollBenefits.map((benefit, i) => (
                        <motion.div
                          key={i}
                          className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-2">
                              {benefit.icon}
                            </div>
                            <p className={`text-2xl font-bold ${benefit.color}`}>{benefit.value}</p>
                          </div>
                          <p className="text-sm text-white/70">{benefit.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-[#8f46c1] to-[#d56f66] rounded-full text-white font-medium"
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(143, 70, 193, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Your Journey
                    </motion.button>
                  </motion.div>
                </div>

                {/* Right column - visualization */}
                <div className="md:w-1/2">
                  <ComparisonVisual />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Navigation method visualization component
function NavigationMethod({ title, description, direction, color, gradientFrom, gradientTo, borderColor }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`rounded-xl overflow-hidden relative bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${borderColor} h-80 md:h-72`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Base phone outline */}
          <rect
            x="60"
            y="20"
            width="80"
            height="160"
            rx="10"
            fill="#121212"
            stroke="#333"
            strokeWidth="2"
          />
          <rect
            x="65"
            y="25"
            width="70"
            height="150"
            rx="5"
            fill="#0A0A0A"
          />

          {/* Screen content based on direction */}
          {direction === "vertical" && (
            <>
              <motion.path
                d="M100 55 L100 35"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="90,40 100,30 110,40"
                fill={color}
                animate={{ y: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <rect x="80" y="70" width="40" height="60" rx="5" fill={color} opacity="0.8" />

              <motion.path
                d="M100 145 L100 165"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ y: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="90,160 100,170 110,160"
                fill={color}
                animate={{ y: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </>
          )}

          {direction === "horizontal" && (
            <>
              <motion.path
                d="M45 100 L65 100"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ x: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="50,90 40,100 50,110"
                fill={color}
                animate={{ x: isHovered ? [-5, 0, -5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <rect x="80" y="70" width="40" height="60" rx="5" fill={color} opacity="0.8" />

              <motion.path
                d="M155 100 L135 100"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                animate={{ x: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.polygon
                points="150,90 160,100 150,110"
                fill={color}
                animate={{ x: isHovered ? [5, 0, 5] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </>
          )}

          {direction === "social" && (
            <>
              <circle cx="100" cy="70" r="20" fill={color} opacity="0.8" />
              <circle cx="70" cy="110" r="14" fill={color} opacity="0.6" />
              <circle cx="100" cy="120" r="12" fill={color} opacity="0.5" />
              <circle cx="130" cy="110" r="14" fill={color} opacity="0.6" />

              <motion.path
                d="M85 70 L115 70"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.path
                d="M100 55 L100 85"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                animate={{ scale: isHovered ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />

              <motion.path
                d="M70 110 L100 70"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.path
                d="M130 110 L100 70"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.path
                d="M70 110 L130 110"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ opacity: isHovered ? [0.3, 0.8, 0.3] : 0.3 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
            </>
          )}

          {/* Home indicator */}
          <rect x="90" y="170" width="20" height="2" rx="1" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
    </motion.div>
  );
}

// Before/After comparison visual component
function ComparisonVisual() {
  return (
    <motion.div
      className="relative w-full h-96"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Before Section */}
        <div className="h-1/2 md:h-full md:w-1/2 border-b md:border-b-0 md:border-r border-white/10 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">Before</div>

          <div className="flex flex-col h-full items-center justify-center">
            {/* Phone mockup with mindless scrolling */}
            <div className="relative w-36 h-64 md:w-40 md:h-72 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gray-900 overflow-hidden">
                {/* Social media feed mockup */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="relative w-full"
                    animate={{ y: ["0%", "-70%", "0%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Random content items */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-full py-2 px-2 border-b border-gray-800 flex items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-800 mr-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="h-2 w-24 bg-gray-800 rounded-full mb-1" />
                          <div className="h-2 w-16 bg-gray-800 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Notification bubbles floating up */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs"
                    style={{
                      left: `${20 + i * 12}%`,
                      bottom: '10%'
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: -100 - i * 20,
                      opacity: [0, 0.7, 0],
                      x: i % 2 === 0 ? [0, 10, -5, 0] : [0, -10, 5, 0]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.8,
                      ease: "easeOut"
                    }}
                  >
                    <span>+1</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Time wasted indicator */}
            <motion.div
              className="mt-4 px-4 py-2 bg-red-500/20 backdrop-blur-md rounded-full text-sm border border-red-500/30 flex items-center"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaClock className="mr-2 text-red-400" /> 2.5 hours wasted daily
            </motion.div>
          </div>
        </div>

        {/* After Section */}
        <div className="h-1/2 md:h-full md:w-1/2 p-6 relative">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">After</div>

          <div className="flex flex-col h-full items-center justify-center">
            {/* Phone mockup with KnowScroll */}
            <div className="relative w-36 h-64 md:w-40 md:h-72 bg-black rounded-3xl border-4 border-gray-800 overflow-hidden">
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-[#0c0612] to-[#1a1522] overflow-hidden">
                {/* Educational content mockup */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    animate={{ y: ["0%", "-60%", "0%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Educational content cards */}
                    {[...Array(4)].map((_, i) => {
                      const colors = [
                        "from-[#8f46c1] to-[#a0459b]",
                        "from-[#a0459b] to-[#bd4580]",
                        "from-[#bd4580] to-[#d56f66]",
                        "from-[#8f46c1] to-[#d56f66]"
                      ];

                      return (
                        <div
                          key={i}
                          className="w-full h-full py-2 px-2 flex flex-col justify-end"
                          style={{ height: '100%' }}
                        >
                          <div className={`w-full h-3/4 rounded-xl bg-gradient-to-br ${colors[i]} p-2 flex flex-col justify-between`}>
                            <div className="flex justify-between items-start">
                              <div className="w-4 h-4 rounded-full bg-white/20" />
                              <div className="w-8 h-2 rounded-full bg-white/20" />
                            </div>

                            <div>
                              <div className="h-3 w-20 bg-white/30 rounded-full mb-1" />
                              <div className="h-2 w-16 bg-white/20 rounded-full mb-3" />
                              <div className="h-4 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Navigation indicators */}
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute left-1/2 top-6 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaArrowUp className="text-xs text-white/80" />
                  </motion.div>

                  <motion.div
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <FaArrowRight className="text-xs text-white/80" />
                  </motion.div>
                </div>
              </div>

              {/* Knowledge bubbles floating up */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-full pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => {
                  const icons = [
                    <FaBrain key="brain" className="text-[8px] text-white" />,
                    <FaCompass key="compass" className="text-[8px] text-white" />,
                    <FaGraduationCap key="grad" className="text-[8px] text-white" />,
                    <FaRegLightbulb key="bulb" className="text-[8px] text-white" />,
                    <FaStar key="star" className="text-[8px] text-white" />
                  ];

                  return (
                    <motion.div
                      key={i}
                      className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-[#8f46c1] to-[#d56f66] flex items-center justify-center"
                      style={{
                        left: `${20 + i * 12}%`,
                        bottom: '10%'
                      }}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{
                        y: -100 - i * 20,
                        opacity: [0, 0.9, 0],
                        x: i % 2 === 0 ? [0, 10, -5, 0] : [0, -10, 5, 0]
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut"
                      }}
                    >
                      {icons[i]}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Knowledge gained indicator */}
            <motion.div
              className="mt-4 px-4 py-2 bg-green-500/20 backdrop-blur-md rounded-full text-sm border border-green-500/30 flex items-center"
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaGraduationCap className="mr-2 text-green-400" /> 15 new concepts learned
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}