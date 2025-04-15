
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Star, Calendar } from "lucide-react";
import { Paper } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  const {
    id,
    title,
    description,
    branch,
    semester,
    year,
    uploadDate,
    rating,
    reviewCount,
    downloadCount,
  } = paper;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link to={`/papers/${id}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
            <Badge variant="outline" className="bg-vjti-primary/10 text-vjti-primary">
              {branch}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(uploadDate), { addSuffix: true })}</span>
            {(semester || year) && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {semester ? `Sem ${semester}` : `Year ${year}`}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-vjti-secondary text-vjti-secondary mr-1" />
              <span>
                {rating} ({reviewCount})
              </span>
            </div>
            <div className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              <span>{downloadCount}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
