
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BRANCHES, SEMESTERS, YEARS } from "@/constants";
import { Upload as UploadIcon, Loader2 } from "lucide-react";

const uploadSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  branch: z.string({
    required_error: "Please select a branch",
  }),
  semester: z.string().optional(),
  year: z.string().optional(),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "Please upload a file")
    .transform((files) => files[0]),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const Upload = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showYearField, setShowYearField] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values: UploadFormValues) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload papers",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would upload the file to a server
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Paper uploaded successfully",
        description: "Thank you for your contribution!",
      });
      navigate("/papers");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your paper.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBranchChange = (value: string) => {
    form.setValue("branch", value);
    
    // If Polytechnic is selected, show year field instead of semester
    if (value === "Polytechnic") {
      setShowYearField(true);
      form.setValue("semester", undefined);
    } else {
      setShowYearField(false);
      form.setValue("year", undefined);
    }
  };

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="container max-w-lg mx-auto py-16 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Login Required</h1>
            <p className="text-muted-foreground mb-8">
              You need to be logged in to upload papers.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Upload Paper</h1>
        <p className="text-muted-foreground mb-8">
          Share a past exam paper to help other students
        </p>

        <div className="border border-border rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Data Structures Mid-Term Exam 2023"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about the exam paper, topics covered, etc."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={handleBranchChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BRANCHES.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!showYearField ? (
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SEMESTERS.map((semester) => (
                              <SelectItem key={semester} value={semester}>
                                Semester {semester}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {YEARS.map((year) => (
                              <SelectItem key={year} value={year}>
                                Year {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Paper File (PDF)</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-vjti-primary/50 transition-colors">
                        <input
                          type="file"
                          id="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => onChange(e.target.files)}
                          {...fieldProps}
                        />
                        <label htmlFor="file" className="cursor-pointer">
                          <UploadIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm font-medium mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF files only (Max 10MB)
                          </p>
                          {value instanceof FileList && value.length > 0 && (
                            <p className="mt-2 text-sm text-vjti-accent font-medium">
                              Selected: {value[0].name}
                            </p>
                          )}
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Paper"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Upload;
