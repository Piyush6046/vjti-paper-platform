
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Upload, MessageSquare, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const navigationItems = [
    { title: "Home", href: "/" },
    { title: "Papers", href: "/papers" },
    { title: "Community", href: "/community" },
    { title: "Upload", href: "/upload" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-vjti-primary" />
            <span className="ml-2 text-xl font-bold text-vjti-primary">VJTI Exams</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <ul className="flex space-x-4">
            {navigationItems.map((item) => (
              <li key={item.title}>
                <Link
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 sm:w-80">
              <div className="flex flex-col space-y-6 py-6">
                <div className="flex items-center justify-between">
                  <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                    <BookOpen className="h-6 w-6 text-vjti-primary" />
                    <span className="ml-2 text-xl font-bold text-vjti-primary">VJTI Exams</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-center py-2 hover:text-foreground text-muted-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col space-y-3 border-t border-border pt-4">
                  {currentUser ? (
                    <>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{currentUser.name}</span>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center py-2 hover:text-foreground text-muted-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Button variant="ghost" className="justify-start px-0" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" asChild>
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/register" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
