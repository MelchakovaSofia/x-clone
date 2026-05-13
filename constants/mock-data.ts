export type StoryItem = {
  id: string;
  username: string;
  avatar: string;
  hasStory: boolean;
};

export const STORIES: StoryItem[] = [
  {
    id: "1",
    username: "sof1a",
    avatar: "https://i.pravatar.cc/120?img=5",
    hasStory: true,
  },
  {
    id: "2",
    username: "andrii",
    avatar: "https://i.pravatar.cc/120?img=12",
    hasStory: true,
  },
  {
    id: "3",
    username: "kate",
    avatar: "https://i.pravatar.cc/120?img=20",
    hasStory: false,
  },
  {
    id: "4",
    username: "serhii",
    avatar: "https://i.pravatar.cc/120?img=15",
    hasStory: true,
  },
  {
    id: "5",
    username: "oleh",
    avatar: "https://i.pravatar.cc/120?img=8",
    hasStory: false,
  },
  {
    id: "6",
    username: "maria",
    avatar: "https://i.pravatar.cc/120?img=32",
    hasStory: true,
  },
];

