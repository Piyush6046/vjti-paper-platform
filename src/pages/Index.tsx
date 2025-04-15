
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Download, Upload, MessageSquare, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_PAPERS } from "@/constants";
import { PaperCard } from "@/components/papers/PaperCard";

const Index = () => {
  // Get 3 featured papers
  const featuredPapers = MOCK_PAPERS.slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-vjti-primary text-white">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">VJTI Paper Palace</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Access previous year question papers from all departments and semesters.
              Share, collaborate, and excel in your exams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-vjti-secondary text-vjti-primary hover:bg-vjti-secondary/90">
                <Link to="/papers">Browse Papers</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link to="/upload">Contribute Paper</Link>
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
                <div className="p-4 bg-vjti-primary/10 rounded-full mb-4">
                  <Download className="h-8 w-8 text-vjti-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Access Papers</h3>
                <p className="text-muted-foreground">
                  Find and download previous years' question papers for all branches and semesters.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
                <div className="p-4 bg-vjti-primary/10 rounded-full mb-4">
                  <Upload className="h-8 w-8 text-vjti-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Contribute</h3>
                <p className="text-muted-foreground">
                  Upload your own question papers to help other students in their exam preparation.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card">
                <div className="p-4 bg-vjti-primary/10 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-vjti-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Discuss</h3>
                <p className="text-muted-foreground">
                  Join the community chat to discuss papers, share tips, and solve doubts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Papers */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Papers</h2>
              <Button asChild variant="ghost" className="text-vjti-primary">
                <Link to="/papers">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPapers.map((paper) => (
                <PaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-vjti-secondary/10">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to contribute?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Help your fellow students by sharing your question papers. Your contribution can make a difference.
            </p>
            <Button asChild size="lg">
              <Link to="/upload">Upload a Paper</Link>
            </Button>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-vjti-primary text-white py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">VJTI Paper Palace</h3>
              <p className="text-vjti-primary-foreground/70">© {new Date().getFullYear()} All rights reserved</p>
            </div>
            <div className="flex space-x-6">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/contact" className="hover:underline">Contact</Link>
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
