export type ReelType = "standard" | "hyper" | "ai-generated";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  lastActive?: string;
}

export interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  views: number;
  likes: number;
  createdAt: string;
  userId: string;
  tags: string[];
  type: ReelType;
  seriesId?: string;
  episodeNumber?: number;
  alternateVersions?: string[]; // For HyperReels, IDs of alternate versions
  whatIfScenarios?: WhatIfScenario[]; // For AI-generated "What If" scenarios
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  episodeCount: number;
  userId: string;
  tags: string[];
  field: string; // e.g., "Physics", "History", etc.
  reelIds: string[]; // IDs of reels in this series
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  creatorId: string;
  participantIds: string[];
  seriesId?: string;
  reelIds: string[];
  messages: ThreadMessage[];
}

export interface ThreadMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  reelId?: string; // If the message references a specific reel
  timeInReel?: string; // Timestamp in the reel (e.g., "01:45")
}
