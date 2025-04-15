
import { Branch, Semester, Year, Paper } from "@/types";

export const BRANCHES: Branch[] = [
  "CS",
  "IT",
  "EXTC",
  "Electrical", 
  "Production",
  "Chemical",
  "Metallurgy",
  "Civil",
  "Polytechnic"
];

export const SEMESTERS = ["1", "2", "3", "4"];
export const YEARS = ["1", "2", "3"];
export const REPORT_REASONS = [
  "Incorrect information",
  "Outdated content",
  "Wrong categorization",
  "Copyright violation",
  "Duplicate content",
  "Other"
];

// Mock data for initial development
export const MOCK_PAPERS: Paper[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms Mid-Term 2023",
    description: "Mid-term question paper for DSA course covering arrays, linked lists, and sorting algorithms",
    branch: "CS" as Branch,
    semester: "3" as Semester,
    uploadDate: new Date("2023-12-10"),
    uploadedBy: {
      id: "user1",
      name: "Rahul Sharma",
      email: "rahul.s@vjti.ac.in"
    },
    fileUrl: "/papers/dsa-mid-term-2023.pdf",
    rating: 4.5,
    reviewCount: 12,
    downloadCount: 145
  },
  {
    id: "2",
    title: "Digital Electronics Final Exam 2022",
    description: "Final examination paper for Digital Electronics covering boolean algebra, logic gates, and circuit design",
    branch: "EXTC" as Branch,
    semester: "4" as Semester,
    uploadDate: new Date("2022-05-20"),
    uploadedBy: {
      id: "user2",
      name: "Priya Patel",
      email: "priya.p@vjti.ac.in"
    },
    fileUrl: "/papers/digital-electronics-2022.pdf",
    rating: 4.8,
    reviewCount: 24,
    downloadCount: 210
  },
  {
    id: "3",
    title: "Engineering Mechanics 2023",
    description: "Latest exam paper for Engineering Mechanics with solution hints",
    branch: "Civil" as Branch,
    semester: "2" as Semester,
    uploadDate: new Date("2023-06-15"),
    uploadedBy: {
      id: "user3",
      name: "Arjun Kumar",
      email: "arjun.k@vjti.ac.in"
    },
    fileUrl: "/papers/engineering-mechanics-2023.pdf",
    rating: 4.2,
    reviewCount: 8,
    downloadCount: 98
  },
  {
    id: "4",
    title: "Basic Electrical Engineering 2022",
    description: "Previous year question paper for BEE with detailed solutions",
    branch: "Electrical" as Branch,
    semester: "1" as Semester,
    uploadDate: new Date("2022-12-28"),
    uploadedBy: {
      id: "user4",
      name: "Sneha Desai",
      email: "sneha.d@vjti.ac.in"
    },
    fileUrl: "/papers/electrical-engineering-basics-2022.pdf",
    rating: 4.7,
    reviewCount: 15,
    downloadCount: 178
  },
  {
    id: "5",
    title: "Programming Fundamentals First Year",
    description: "First year programming paper with C language basics",
    branch: "Polytechnic" as Branch,
    year: "1" as Year,
    uploadDate: new Date("2023-01-10"),
    uploadedBy: {
      id: "user5",
      name: "Raj Malhotra",
      email: "raj.m@vjti.ac.in"
    },
    fileUrl: "/papers/programming-fundamentals-poly.pdf",
    rating: 4.3,
    reviewCount: 9,
    downloadCount: 112
  }
];

export const MOCK_REVIEWS = [
  {
    id: "r1",
    paperId: "1",
    userId: "user2",
    user: {
      id: "user2",
      name: "Priya Patel",
      email: "priya.p@vjti.ac.in",
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    rating: 5,
    comment: "Very helpful paper, covers all the important topics!",
    createdAt: new Date("2023-12-15")
  },
  {
    id: "r2",
    paperId: "1",
    userId: "user3",
    user: {
      id: "user3",
      name: "Arjun Kumar",
      email: "arjun.k@vjti.ac.in",
      avatar: "https://i.pravatar.cc/150?u=arjun"
    },
    rating: 4,
    comment: "Good questions, helped me prepare well for the exam.",
    createdAt: new Date("2023-12-18")
  }
];

export const MOCK_MESSAGES = [
  {
    id: "m1",
    content: "Has anyone solved the 2022 Data Structures paper? I'm struggling with the graph algorithms section.",
    user: {
      id: "user1",
      name: "Rahul Sharma",
      email: "rahul.s@vjti.ac.in",
      avatar: "https://i.pravatar.cc/150?u=rahul"
    },
    timestamp: new Date("2023-12-18T14:22:00")
  },
  {
    id: "m2",
    content: "I found the solution approach. Check out the notes shared in the resources section!",
    user: {
      id: "user2",
      name: "Priya Patel",
      email: "priya.p@vjti.ac.in",
      avatar: "https://i.pravatar.cc/150?u=priya"
    },
    timestamp: new Date("2023-12-18T14:30:00")
  },
  {
    id: "m3",
    content: "Thanks! That was helpful. Does anyone have study materials for the upcoming Digital Electronics exam?",
    user: {
      id: "user3",
      name: "Arjun Kumar",
      email: "arjun.k@vjti.ac.in",
      avatar: "https://i.pravatar.cc/150?u=arjun"
    },
    timestamp: new Date("2023-12-18T14:45:00")
  }
];
