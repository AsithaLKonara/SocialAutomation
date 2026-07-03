export interface Post {
  id: string;
  topicId: string;
  platform: "Facebook" | "Instagram" | "LinkedIn";
  caption: string;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  engagementRate: number;
  imageUrl: string;
  status: "draft" | "scheduled" | "published";
  createdAt: string;
  scheduledFor?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  status: "active" | "completed" | "paused";
  keywords: string[];
}

export interface EngagementTrend {
  date: string;
  engagement: number;
}

export interface PlatformEngagement {
  name: string;
  engagement: number;
}
