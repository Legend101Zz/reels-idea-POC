"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaPlay, FaPlus, FaUser } from 'react-icons/fa';
import ReelPlayer from '@/components/ReelPlayer';
import ThreadView from '@/components/ThreadView';
import { reels } from '@/data/reels';
import { users } from '@/data/users';

export default function FeedPage() {
    const [currentReelId, setCurrentReelId] = useState(reels[0]?.id || '');
    const [showThread, setShowThread] = useState(false);
    const [threadId, setThreadId] = useState<string | undefined>(undefined);

    const handleThreadOpen = (reelId: string) => {
        // In a real app, we'd look up if a thread exists for this reel
        // For now, we'll just open the thread view without a specific thread
        setThreadId(undefined);
        setShowThread(true);
    };

    const handleThreadClose = () => {
        setShowThread(false);
        setThreadId(undefined);
    };

    const handleCreateThread = (participants: typeof users) => {
        // In a real app, we'd create a thread in the backend
        // For now, we'll just simulate it by closing the view
        setShowThread(false);
    };

    return (
        <div className="h-screen w-full bg-background relative">
            {/* Main Reel View */}
            <ReelPlayer
                initialReelId={currentReelId}
                onThreadOpen={handleThreadOpen}
            />

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-background flex items-center justify-around">
                <button className="flex flex-col items-center justify-center">
                    <FaHome className="text-xl mb-1" />
                    <span className="text-xs">Home</span>
                </button>

                <button className="flex flex-col items-center justify-center">
                    <FaPlay className="text-xl mb-1" />
                    <span className="text-xs">Feed</span>
                </button>

                <button className="flex flex-col items-center justify-center -mt-8">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <FaPlus className="text-xl" />
                    </div>
                </button>

                <button className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <FaUser className="text-xl mb-1" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-xs">Profile</span>
                </button>
            </div>

            {/* Thread Modal */}
            {showThread && (
                <ThreadView
                    threadId={threadId}
                    initialParticipants={[users[0]]} // Add the first user from our mock data
                    onClose={handleThreadClose}
                    onCreateThread={handleCreateThread}
                />
            )}
        </div>
    );
}