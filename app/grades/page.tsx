"use client";

import { useState } from "react";
import PageWrapper from "@/components/shared/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Types ---
interface Grade {
  id: number;
  studentName: string;
  subject: string;
  assignmentTitle: string;
  score: number;
  totalMarks: number;
  feedback: string;
  date: string;
}

// --- Dummy Data ---
const initialGrades: Grade[] = [
  { id: 1, studentName: "Aarav Sharma", subject: "Mathematics", assignmentTitle: "Algebra Test", score: 38, totalMarks: 100, feedback: "Needs improvement in equations", date: "2024-02-01" },
  { id: 2, studentName: "Priya Thapa", subject: "Science", assignmentTitle: "Lab Report", score: 82, totalMarks: 100, feedback: "Good understanding of concepts", date: "2024-02-02" },
  { id: 3, studentName: "Rohan Karki", subject: "English", assignmentTitle: "Essay Writing", score: 91, totalMarks: 100, feedback: "Excellent writing skills", date: "2024-02-03" },
  { id: 4, studentName: "Sita Rai", subject: "Mathematics", assignmentTitle: "Geometry Quiz", score: 48, totalMarks: 100, feedback: "Struggling with proofs", date: "2024-02-04" },
  { id: 5, studentName: "Bikash Gurung", subject: "Science", assignmentTitle: "Chapter Test", score: 74, totalMarks: 100, feedback: "Satisfactory performance", date: "2024-02-05" },
  { id: 6, studentName: "Anita Magar", subject: "English", assignmentTitle: "Book Review", score: 88, totalMarks: 100, feedback: "Very well written", date: "2024-02-06" },
  { id: 7, studentName: "Sunil Tamang", subject: "Mathematics", assignmentTitle: "Algebra Test", score: 65, totalMarks: 100, feedback: "Average performance", date: "2024-02-07" },
  { id: 8, studentName: "Kamala Shrestha", subject: "Science", assignmentTitle: "Lab Report", score: 55, totalMarks: 100, feedback: "Needs more practice", date: "2024-02-08" },
];

const subjectChartData = [
  { subject: "Math", average: 50 },
  { subject: "Science", average: 70 },
  { subject: "English", average: 89 },
];

// --- Form Schema ---
const gradeSchema = z.object({
  studentName: z.string().min(2, "Student name required"),
  subject: z.string().min(1, "Subject required"),
  assignmentTitle: z.string().min(2, "Assignment title required"),
  score: z.string().min(1, "Score required"),
  totalMarks: z.string().min(1, "Total marks required"),
  feedback: z.string().min(5, "Please provide feedback"),
});

type GradeForm = z.infer<typeof gradeSchema>;

// --- Grade Badge ---
function GradeBadge({ score, total }: { score: number; total: number }) {
  const pct = (score / total) * 100;
  if (pct >= 85) return <Badge className="bg-green-100 text-green-700 border border-green-200">A</Badge>;
  if (pct >= 70) return <Badge className="bg-blue-100 text-blue-700 border border-blue-200">B</Badge>;
  if (pct >= 55) return <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-200">C</Badge>;
  if (pct >= 40) return <Badge className="bg-orange-100 text-orange-700 border border-orange-200">D</Badge>;
  return <Badge className="bg-red-100 text-red-700 border border-red-200">F</Badge>;
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GradeForm>({
    resolver: zodResolver(gradeSchema),
  });

  // Filtered grades
  const filtered = grades.filter((g) => {
    const matchSearch = g.studentName.toLowerCase().includes(search.toLowerCase()) ||
      g.assignmentTitle.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || g.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  // Stats
  const avg = Math.round(grades.reduce((a, b) => a + (b.score / b.totalMarks) * 100, 0) / grades.length);
  const highest = Math.max(...grades.map((g) => (g.score / g.totalMarks) * 100));
  const lowest = Math.min(...grades.map((g) => (g.score / g.totalMarks) * 100));
  const failing = grades.filter((g) => (g.score / g.totalMarks) * 100 < 40).length;

  // Add grade
  const onSubmit = (data: GradeForm) => {
    const newGrade: Grade = {
      id: grades.length + 1,
      studentName: data.studentName,
      subject: data.subject,
      assignmentTitle: data.assignmentTitle,
      score: parseFloat(data.score),
      totalMarks: parseFloat(data.totalMarks),
      feedback: data.feedback,
      date: new Date().toISOString().split("T")[0],
    };
    setGrades((prev) => [...prev, newGrade]);
    toast.success("Grade added successfully!");
    reset();
    setOpen(false);
  };

  return (
    <PageWrapper title="Grades">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Class Average", value: `${avg}%`, icon: BarChart3, color: "bg-blue-500" },
            { label: "Highest Score", value: `${Math.round(highest)}%`, icon: Award, color: "bg-green-500" },
            { label: "Lowest Score", value: `${Math.round(lowest)}%`, icon: TrendingDown, color: "bg-red-500" },
            { label: "Failing Students", value: failing, icon: AlertTriangle, color: "bg-orange-500" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-3 pt-6">
                  <div className={`${stat.color} p-2.5 rounded-xl`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart + Table Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Subject Averages Chart */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Average by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={subjectChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="subject" type="category" tick={{ fontSize: 12 }} width={50} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Student Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {grades
                .sort((a, b) => (b.score / b.totalMarks) - (a.score / a.totalMarks))
                .slice(0, 5)
                .map((g) => {
                  const pct = Math.round((g.score / g.totalMarks) * 100);
                  return (
                    <div key={g.id} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-slate-600 truncate">{g.studentName.split(" ")[0]}</div>
                      <Progress value={pct} className="flex-1 h-2" />
                      <div className="w-10 text-right text-sm font-medium text-slate-700">{pct}%</div>
                      <GradeBadge score={g.score} total={g.totalMarks} />
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>

        {/* Filters & Add Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search student or assignment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 bg-white"
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-36 bg-white">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Grade */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Grade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Grade</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div>
                  <Label>Student Name</Label>
                  <Input {...register("studentName")} placeholder="John Doe" className="mt-1" />
                  {errors.studentName && <p className="text-xs text-red-500 mt-1">{errors.studentName.message}</p>}
                </div>
                <div>
                  <Label>Subject</Label>
                  <Select onValueChange={(val) => setValue("subject", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <Label>Assignment Title</Label>
                  <Input {...register("assignmentTitle")} placeholder="Algebra Test" className="mt-1" />
                  {errors.assignmentTitle && <p className="text-xs text-red-500 mt-1">{errors.assignmentTitle.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Score</Label>
                    <Input {...register("score")} type="number" placeholder="78" className="mt-1" />
                    {errors.score && <p className="text-xs text-red-500 mt-1">{errors.score.message}</p>}
                  </div>
                  <div>
                    <Label>Total Marks</Label>
                    <Input {...register("totalMarks")} type="number" placeholder="100" className="mt-1" />
                    {errors.totalMarks && <p className="text-xs text-red-500 mt-1">{errors.totalMarks.message}</p>}
                  </div>
                </div>
                <div>
                  <Label>Feedback</Label>
                  <Textarea {...register("feedback")} placeholder="Write feedback for the student..." className="mt-1" />
                  {errors.feedback && <p className="text-xs text-red-500 mt-1">{errors.feedback.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Grade
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grades Table */}
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium text-slate-700">{g.studentName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{g.subject}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{g.assignmentTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{g.score}/{g.totalMarks}</span>
                        <span className="text-xs text-slate-400">
                          ({Math.round((g.score / g.totalMarks) * 100)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <GradeBadge score={g.score} total={g.totalMarks} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">{g.feedback}</TableCell>
                    <TableCell className="text-slate-400 text-sm">{g.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No grades found</p>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </PageWrapper>
  );
}