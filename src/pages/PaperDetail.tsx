
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  Download,
  Calendar,
  Flag,
  ChevronLeft,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_PAPERS, MOCK_REVIEWS, REPORT_REASONS } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaperDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const paper = MOCK_PAPERS.find((p) => p.id === id);
  const reviews = MOCK_REVIEWS.filter((r) => r.paperId === id);

  if (!paper) {
    return (
      <>
        <Navbar />
        <div className="container py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Paper not found</h2>
          <p className="text-muted-foreground mb-6">
            The paper you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/papers">Back to Papers</Link>
          </Button>
        </div>
      </>
    );
  }

  const handleDownload = () => {
    // In a real app, this would initiate a download
    console.log("Downloading paper:", paper.id);
    alert("Download started! (This is a mock download)");
  };

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const handleReviewSubmit = () => {
    if (!currentUser) {
      alert("Please log in to submit a review");
      return;
    }

    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    // In a real app, this would submit the review to the backend
    alert("Review submitted successfully!");
    setReview("");
    setUserRating(0);
  };

  const handleReportSubmit = () => {
    if (!currentUser) {
      alert("Please log in to report a paper");
      return;
    }

    if (!reportReason) {
      alert("Please select a reason for reporting");
      return;
    }

    // In a real app, this would submit the report to the backend
    alert("Report submitted successfully!");
    setReportReason("");
    setReportDescription("");
  };

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <Link
          to="/papers"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to papers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Paper details */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{paper.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                    <Badge variant="outline" className="bg-vjti-primary/10 text-vjti-primary">
                      {paper.branch}
                    </Badge>
                    {paper.semester && (
                      <Badge variant="secondary" className="text-xs">
                        Semester {paper.semester}
                      </Badge>
                    )}
                    {paper.year && (
                      <Badge variant="secondary" className="text-xs">
                        Year {paper.year}
                      </Badge>
                    )}
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{format(new Date(paper.uploadDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report Paper</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              Reason for reporting
                            </label>
                            <Select
                              value={reportReason}
                              onValueChange={setReportReason}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                              </SelectTrigger>
                              <SelectContent>
                                {REPORT_REASONS.map((reason) => (
                                  <SelectItem key={reason} value={reason}>
                                    {reason}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">
                              Description (optional)
                            </label>
                            <Textarea
                              placeholder="Please provide more details about the issue"
                              value={reportDescription}
                              onChange={(e) => setReportDescription(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button
                            onClick={handleReportSubmit}
                            className="w-full"
                          >
                            Submit Report
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{paper.description}</p>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <Star className="h-5 w-5 fill-vjti-secondary text-vjti-secondary mr-1" />
                  <span className="font-medium">
                    {paper.rating} ({paper.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Download className="h-5 w-5 mr-1" />
                  <span>{paper.downloadCount} downloads</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <Avatar>
                  <AvatarFallback>{paper.uploadedBy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Uploaded by {paper.uploadedBy.name}</p>
                </div>
              </div>

              <Button onClick={handleDownload} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download Paper
              </Button>
            </div>

            {/* Reviews section */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Reviews</h2>

              {reviews.length > 0 ? (
                <div className="space-y-6 mb-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{review.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(review.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-vjti-secondary text-vjti-secondary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-6">No reviews yet</p>
              )}

              {currentUser ? (
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-3">Write a Review</h3>
                  <div className="mb-4">
                    <p className="text-sm mb-2">Your rating</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= userRating
                                ? "fill-vjti-secondary text-vjti-secondary"
                                : "text-muted-foreground hover:text-vjti-secondary"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm mb-2 block">Your review</label>
                    <Textarea
                      placeholder="Share your thoughts about this paper"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleReviewSubmit}>Submit Review</Button>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm mb-2">
                    Please{" "}
                    <Link to="/login" className="text-vjti-accent hover:underline">
                      log in
                    </Link>{" "}
                    to leave a review
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related papers */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Related Papers</h2>
                <div className="space-y-4">
                  {MOCK_PAPERS.filter(
                    (p) => p.branch === paper.branch && p.id !== paper.id
                  )
                    .slice(0, 3)
                    .map((relatedPaper) => (
                      <Link
                        key={relatedPaper.id}
                        to={`/papers/${relatedPaper.id}`}
                        className="block group"
                      >
                        <div className="p-3 border border-border rounded-md group-hover:border-vjti-primary">
                          <div className="flex items-start">
                            <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div>
                              <p className="font-medium group-hover:text-vjti-accent line-clamp-2">
                                {relatedPaper.title}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Star className="h-3 w-3 fill-vjti-secondary text-vjti-secondary mr-1" />
                                <span>
                                  {relatedPaper.rating} ({relatedPaper.reviewCount})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaperDetail;
