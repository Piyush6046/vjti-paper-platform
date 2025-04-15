
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Book } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    condition: "",
    description: "",
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast({
          title: "Error",
          description: "Failed to load books",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login to list a book for sale",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newBook.title);
      formData.append("author", newBook.author);
      formData.append("price", newBook.price);
      formData.append("condition", newBook.condition);
      formData.append("description", newBook.description);
      
      if (newBook.image) {
        formData.append("bookImage", newBook.image);
      }

      const response = await axios.post("/api/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setBooks([response.data, ...books]);
      
      // Reset form
      setNewBook({
        title: "",
        author: "",
        price: "",
        condition: "",
        description: "",
        image: null
      });
      setImagePreview(null);
      
      toast({
        title: "Success",
        description: "Book listed successfully"
      });
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error",
        description: "Failed to list book",
        variant: "destructive"
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBook({ ...newBook, image: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "new": return "default";
      case "like-new": return "secondary";
      case "good": return "outline";
      case "fair": return "destructive";
      case "poor": return "destructive";
      default: return "outline";
    }
  };

  const getConditionLabel = (condition: string) => {
    return condition.replace('-', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Books for Sale</h1>
            <p className="text-muted-foreground">
              Buy and sell used textbooks from VJTI students
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author"
                className="w-[200px] md:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Sell a Book
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>List a Book for Sale</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="title">Book Title*</label>
                    <Input 
                      id="title" 
                      placeholder="Enter book title" 
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="author">Author*</label>
                    <Input 
                      id="author" 
                      placeholder="Enter author name" 
                      value={newBook.author}
                      onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="price">Price* (₹)</label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="Enter price" 
                      value={newBook.price}
                      onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="condition">Condition*</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newBook.condition}
                      onChange={(e) => setNewBook({ ...newBook, condition: e.target.value })}
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="new">New</option>
                      <option value="like-new">Like New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="description">Description*</label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter book description" 
                      value={newBook.description}
                      onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <label htmlFor="image">Book Image</label>
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Preview:</p>
                      <img 
                        src={imagePreview} 
                        alt="Book preview" 
                        className="max-h-[200px] object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddBook}
                    disabled={!newBook.title || !newBook.author || !newBook.price || !newBook.condition || !newBook.description}
                  >
                    List Book
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-4 h-[300px] animate-pulse"
                >
                  <div className="h-36 bg-muted rounded mb-4"></div>
                  <div className="h-5 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-muted rounded mb-4 w-1/2"></div>
                  <div className="h-6 bg-muted rounded mt-4 w-1/3"></div>
                </div>
              ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[3/2] relative bg-muted">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm line-clamp-2">{book.description}</p>
                  <div className="mt-2">
                    <Badge variant={getConditionBadgeVariant(book.condition)}>
                      {getConditionLabel(book.condition)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold">₹{book.price}</span>
                  <Button>Contact Seller</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium mb-2">No books found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 
                "Try a different search term" : 
                "Be the first to list a book for sale!"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Books;
