
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  branch?: Branch;
  year?: Year;
  bio?: string;
}

export interface Paper {
  id: string;
  title: string;
  description: string;
  branch: Branch;
  semester?: Semester;
  year?: Year;
  uploadDate: Date;
  uploadedBy: User;
  fileUrl: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  description: string;
  imageUrl?: string;
  listedBy: User;
  listedDate: Date;
  sold: boolean;
}

export interface Review {
  id: string;
  paperId: string;
  userId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  content: string;
  user: User;
  timestamp: Date;
}

export type Branch = 
  | "CS" 
  | "IT" 
  | "EXTC" 
  | "Electrical" 
  | "Production" 
  | "Chemical" 
  | "Metallurgy" 
  | "Civil" 
  | "Polytechnic";

export type Semester = "1" | "2" | "3" | "4";
export type Year = "1" | "2" | "3";

export interface Report {
  id: string;
  paperId: string;
  userId: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
}
