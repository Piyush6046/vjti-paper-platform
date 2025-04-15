
import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { PaperCard } from "@/components/papers/PaperCard";
import { PaperFilters } from "@/components/papers/PaperFilters";
import { MOCK_PAPERS } from "@/constants";
import { Paper, Branch } from "@/types";

const Papers = () => {
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>(MOCK_PAPERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: {
    search: string;
    branches: Branch[];
    semesters: string[];
    years: string[];
  }) => {
    const { search, branches, semesters, years } = filters;

    let results = [...MOCK_PAPERS];

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (paper) =>
          paper.title.toLowerCase().includes(searchLower) ||
          paper.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by branches
    if (branches.length > 0) {
      results = results.filter((paper) => branches.includes(paper.branch));
    }

    // Filter by semesters
    if (semesters.length > 0) {
      results = results.filter((paper) => paper.semester && semesters.includes(paper.semester));
    }

    // Filter by years
    if (years.length > 0) {
      results = results.filter((paper) => paper.year && years.includes(paper.year));
    }

    setFilteredPapers(results);
  };

  return (
    <>
      <Navbar />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exam Papers</h1>
          <p className="text-muted-foreground">
            Browse and download previous years' question papers from all departments
          </p>
        </div>

        <PaperFilters onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border p-4 h-64 animate-pulse"
                >
                  <div className="h-7 bg-muted rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-muted rounded mb-2 w-1/4"></div>
                  <div className="h-20 bg-muted rounded mt-4"></div>
                  <div className="flex justify-between mt-6">
                    <div className="h-4 bg-muted rounded w-20"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No papers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search term
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Papers;
