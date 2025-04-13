"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaCheck, FaPlay } from 'react-icons/fa';
import { Thread, User } from '@/types';
import { threads } from '@/data/threads';
import { users } from '@/data/users';
import { reels } from '@/data/reels';

interface ThreadViewProps {
    threadId?: string;
    initialParticipants?: User[];
    onClose: () => void;
    onCreateThread?: (participants: User[]) => void;
}

export default function ThreadView({
    threadId,
    initialParticipants = [],
    onClose,
    onCreateThread
}: ThreadViewProps) {
    const [thread, setThread] = useState<Thread | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<User[]>(initialParticipants);
    const [step, setStep] = useState<'select' | 'view' | 'episodes'>(
        threadId ? 'view' : 'select'
    );
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    // Find thread from mock data
    useEffect(() => {
        if (threadId) {
            const foundThread = threads.find(t => t.id === threadId);
            if (foundThread) {
                setThread(foundThread);
            }
        }
    }, [threadId]);

    // Filter users based on search
    useEffect(() => {
        if (searchText) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                user.username.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchText]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const toggleFriendSelection = (user: User) => {
        if (selectedFriends.some(f => f.id === user.id)) {
            setSelectedFriends(selectedFriends.filter(f => f.id !== user.id));
        } else {
            setSelectedFriends([...selectedFriends, user]);
        }
    };

    const handleCreateThread = () => {
        if (onCreateThread) {
            onCreateThread(selectedFriends);
        }
        setStep('view');
    };

    // Get user by ID
    const getUserById = (userId: string): User | undefined => {
        return users.find(user => user.id === userId);
    };

    // Get series episodes
    const getSeriesEpisodes = () => {
        if (!thread || !thread.seriesId) return [];

        return reels.filter(reel => reel.seriesId === thread.seriesId)
            .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="absolute inset-x-0 bottom-0 top-16 bg-background rounded-t-3xl overflow-hidden"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="relative h-14 flex items-center justify-center border-b border-gray-800">
                        {step === 'select' && (
                            <h2 className="text-lg font-semibold">New Thread</h2>
                        )}

                        {step === 'view' && thread && (
                            <h2 className="text-lg font-semibold">{thread.title}</h2>
                        )}

                        {step === 'view' && !thread && (
                            <h2 className="text-lg font-semibold">Thread</h2>
                        )}

                        {step === 'episodes' && (
                            <h2 className="text-lg font-semibold">Episodes</h2>
                        )}

                        <button
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800"
                            onClick={onClose}
                        >
                            <FaTimes />
                        </button>

                        {step === 'select' && (
                            <button
                                className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full ${selectedFriends.length > 0 ? 'bg-primary' : 'bg-gray-800'
                                    }`}
                                onClick={handleCreateThread}
                                disabled={selectedFriends.length === 0}
                            >
                                <FaCheck />
                            </button>
                        )}

                        {step === 'view' && (
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full"
                                onClick={() => setStep('episodes')}
                            >
                                Episodes
                            </button>
                        )}

                        {step === 'episodes' && (
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm bg-primary/20 hover:bg-primary/30 px-3 py-1 rounded-full"
                                onClick={() => setStep('view')}
                            >
                                Thread
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
                        {/* Friend Selection */}
                        {step === 'select' && (
                            <div className="p-4">
                                <div className="relative mb-4">
                                    <input
                                        type="text"
                                        placeholder="Search friends..."
                                        className="w-full bg-gray-800 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={searchText}
                                        onChange={handleSearchChange}
                                    />
                                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <h3 className="text-gray-400 text-sm mb-3">Recent</h3>

                                <div className="space-y-2">
                                    {filteredUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                                            onClick={() => toggleFriendSelection(user)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {user.isOnline ? 'Online now' : user.lastActive ? `Last active: ${user.lastActive}` : ''}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                className={`w-6 h-6 rounded-full border ${selectedFriends.some(f => f.id === user.id)
                                                        ? 'bg-primary border-primary'
                                                        : 'border-gray-500'
                                                    } flex items-center justify-center`}
                                            >
                                                {selectedFriends.some(f => f.id === user.id) && (
                                                    <FaCheck className="text-xs" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Thread View */}
                        {step === 'view' && (
                            <div className="p-4">
                                {thread ? (
                                    <div className="space-y-4">
                                        {thread.messages.map(message => {
                                            const user = getUserById(message.userId);
                                            return (
                                                <div key={message.id} className="flex">
                                                    <div className="flex-shrink-0 mr-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                                                            {user ? user.name.charAt(0) : '?'}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center mb-1">
                                                            <p className="font-medium text-sm">{user ? user.name : 'Unknown User'}</p>
                                                            <p className="text-xs text-gray-400 ml-2">
                                                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm">{message.content}</p>

                                                        {message.reelId && message.timeInReel && (
                                                            <div className="mt-2 rounded-lg bg-gray-800 p-2 text-xs flex items-center">
                                                                <div className="bg-primary/30 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                                                    <FaPlay className="text-primary text-xs" />
                                                                </div>
                                                                <span>From Episode {reels.find(r => r.id === message.reelId)?.episodeNumber || '?'}</span>
                                                                <span className="ml-2 text-gray-400">{message.timeInReel}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Message Input */}
                                        <div className="mt-6 relative">
                                            <input
                                                type="text"
                                                placeholder="Message..."
                                                className="w-full bg-gray-800 rounded-full py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                                            />
                                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-64">
                                        <p className="text-gray-400">Start a new conversation about this content</p>
                                        <button className="mt-4 bg-primary hover:bg-primary-dark px-4 py-2 rounded-full text-sm font-medium">
                                            New Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Episodes View */}
                        {step === 'episodes' && (
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-4">Episodes</h3>

                                <div className="grid grid-cols-3 gap-3">
                                    {getSeriesEpisodes().map((episode, index) => (
                                        <div key={episode.id} className="relative">
                                            <div className={`aspect-square rounded-lg overflow-hidden ${thread?.reelIds.includes(episode.id) ? 'border-2 border-primary' : ''
                                                }`}>
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-2xl font-bold">{index + 1}</span>
                                                </div>
                                            </div>
                                            {thread?.reelIds.includes(episode.id) && (
                                                <div className="absolute -top-2 -right-2 bg-primary rounded-full w-6 h-6 flex items-center justify-center">
                                                    <FaCheck className="text-xs" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}