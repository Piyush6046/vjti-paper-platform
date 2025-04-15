
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Branch } from "@/types";
import { BRANCHES, SEMESTERS, YEARS } from "@/constants";

interface PaperFiltersProps {
  onFilterChange: (filters: {
    search: string;
    branches: Branch[];
    semesters: string[];
    years: string[];
  }) => void;
}

export function PaperFilters({ onFilterChange }: PaperFiltersProps) {
  const [search, setSearch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, branches, semesters, years });
  };

  const handleBranchChange = (branch: Branch) => {
    const updatedBranches = branches.includes(branch)
      ? branches.filter((b) => b !== branch)
      : [...branches, branch];
    
    setBranches(updatedBranches);
    onFilterChange({ search, branches: updatedBranches, semesters, years });
  };

  const handleSemesterChange = (semester: string) => {
    const updatedSemesters = semesters.includes(semester)
      ? semesters.filter((s) => s !== semester)
      : [...semesters, semester];
    
    setSemesters(updatedSemesters);
    onFilterChange({ search, branches, semesters: updatedSemesters, years });
  };

  const handleYearChange = (year: string) => {
    const updatedYears = years.includes(year)
      ? years.filter((y) => y !== year)
      : [...years, year];
    
    setYears(updatedYears);
    onFilterChange({ search, branches, semesters, years: updatedYears });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search papers..."
          value={search}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Branch
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {BRANCHES.map((branch) => (
              <DropdownMenuCheckboxItem
                key={branch}
                checked={branches.includes(branch)}
                onSelect={(e) => {
                  e.preventDefault();
                  handleBranchChange(branch);
                }}
              >
                {branch}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Semester
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {SEMESTERS.map((semester) => (
              <DropdownMenuCheckboxItem
                key={semester}
                checked={semesters.includes(semester)}
                onSelect={(e) => {
                  e.preventDefault();
                  handleSemesterChange(semester);
                }}
              >
                Semester {semester}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              Year
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {YEARS.map((year) => (
              <DropdownMenuCheckboxItem
                key={year}
                checked={years.includes(year)}
                onSelect={(e) => {
                  e.preventDefault();
                  handleYearChange(year);
                }}
              >
                Year {year}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
