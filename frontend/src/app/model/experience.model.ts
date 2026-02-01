export interface Experience {
  _id: string;
  userId: any; // Can be string ID or populated object
  source: string;
  destination: string;
  busName?: string;
  story: string;
  rating: number;
  photos: string[];
  likes: string[];
  likesCount?: number;
  comments: {
    userId: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}
