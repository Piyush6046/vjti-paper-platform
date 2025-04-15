
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Download, Star, Upload, PenLine } from "lucide-react";
import { useState, useEffect } from "react";
import { Paper } from "@/types";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploadedPapers, setUploadedPapers] = useState<Paper[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      name: currentUser?.name || "",
      branch: "",
      year: "",
      bio: "",
      avatar: null as File | null,
    },
  });

  // Fetch user profile data and papers from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        // This would be a real API call in production
        const response = await axios.get(`/api/users/${currentUser.id}`);
        const userData = response.data;
        
        // Set form values from fetched user data
        form.reset({
          name: userData.name || currentUser.name,
          branch: userData.branch || "",
          year: userData.year || "",
          bio: userData.bio || "",
          avatar: null,
        });
        
        // Fetch user's uploaded papers
        const papersResponse = await axios.get(`/api/papers/user/${currentUser.id}`);
        setUploadedPapers(papersResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
        
        // For now, we'll simulate with mock data if there's an error
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, form]);

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account"
    });
    navigate("/");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("branch", data.branch);
      formData.append("year", data.year);
      formData.append("bio", data.bio);
      
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }
      
      // This would be a real API call in production
      await axios.put(`/api/users/${currentUser?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const branches = ["CS", "IT", "EXTC", "Electrical", "Production", "Chemical", "Metallurgy", "Civil", "Polytechnic"];
  const years = ["1", "2", "3"];

  return (
    <>
      <Navbar />
      <div className="container py-8 max-w-4xl">
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt={currentUser.name} />
                ) : (
                  <>
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{form.watch("name") || currentUser.name}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
                {form.watch("branch") && (
                  <Badge className="mt-1 mr-1">{form.watch("branch")}</Badge>
                )}
                {form.watch("year") && (
                  <Badge variant="outline" className="mt-1">Year {form.watch("year")}</Badge>
                )}
              </div>
              <div className="ml-auto flex gap-2">
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                    <PenLine className="h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardHeader>
            {isEditing && (
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                                disabled={isLoading}
                              >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                  <option key={branch} value={branch}>{branch}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                {...field}
                                disabled={isLoading}
                              >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field}
                              placeholder="Tell us about yourself"
                              disabled={isLoading}
                              className="resize-none"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={isLoading}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)} 
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Papers Uploaded</CardTitle>
                <CardDescription>
                  Papers you've shared with the VJTI community
                </CardDescription>
              </div>
              <Button asChild>
                <a href="/upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Paper
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="space-y-2">
                        <div className="h-5 bg-muted rounded w-48"></div>
                        <div className="h-4 bg-muted rounded w-32"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-5 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : uploadedPapers.length > 0 ? (
                <div className="space-y-4">
                  {uploadedPapers.map((paper) => (
                    <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Books for Sale</CardTitle>
              <CardDescription>
                Books you've listed for sale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't listed any books for sale yet</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Book for Sale</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Book for Sale</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="title">Book Title</label>
                        <Input id="title" placeholder="Enter book title" />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="author">Author</label>
                        <Input id="author" placeholder="Enter author name" />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="price">Price (₹)</label>
                        <Input id="price" type="number" placeholder="Enter price" />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="condition">Condition</label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">Select condition</option>
                          <option value="new">New</option>
                          <option value="like-new">Like New</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="description">Description</label>
                        <Textarea id="description" placeholder="Enter book description" />
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="image">Book Image</label>
                        <Input id="image" type="file" accept="image/*" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Add Book</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
