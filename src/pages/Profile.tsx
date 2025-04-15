
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Download, Star } from "lucide-react";
import { useState } from "react";
import { Paper } from "@/types";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploadedPapers, setUploadedPapers] = useState<Paper[]>([]);
  
  // In a real application, we would fetch the user's uploaded papers from the backend
  // This is just mock data for now
  useState(() => {
    // Mock data for demonstration
    if (currentUser) {
      const mockPapers: Paper[] = [
        {
          id: "paper1",
          title: "Data Structures and Algorithms",
          description: "Mid-term exam paper for DSA course",
          branch: "CS",
          semester: "3",
          year: "2",
          uploadDate: new Date(2024, 2, 15),
          uploadedBy: currentUser,
          fileUrl: "/mock-papers/dsa.pdf",
          rating: 4.5,
          reviewCount: 12,
          downloadCount: 45
        },
        {
          id: "paper2",
          title: "Database Management Systems",
          description: "Final exam paper for DBMS course",
          branch: "CS",
          semester: "4",
          year: "2",
          uploadDate: new Date(2024, 3, 5),
          uploadedBy: currentUser,
          fileUrl: "/mock-papers/dbms.pdf",
          rating: 4.8,
          reviewCount: 8,
          downloadCount: 32
        }
      ];
      setUploadedPapers(mockPapers);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container py-8 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
              </div>
              <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Papers Uploaded</CardTitle>
              <CardDescription>
                Papers you've shared with the VJTI community
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadedPapers.length > 0 ? (
                <div className="space-y-4">
                  {uploadedPapers.map((paper) => (
                    <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{paper.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {paper.branch} • Semester {paper.semester} • Uploaded {paper.uploadDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{paper.rating} ({paper.reviewCount})</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Download className="h-4 w-4 mr-1" />
                          <span>{paper.downloadCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You haven't uploaded any papers yet</p>
                  <Button className="mt-4" asChild>
                    <a href="/upload">Upload your first paper</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
