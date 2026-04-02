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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  MoreVertical,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// --- Types ---
interface Student {
  id: number;
  name: string;
  grade: number;
  email: string;
  parentEmail: string;
  average: number;
  status: "excellent" | "good" | "average" | "struggling";
}

// --- Dummy Data ---
const initialStudents: Student[] = [
  { id: 1, name: "Aarav Sharma", grade: 9, email: "aarav@school.com", parentEmail: "aarav.parent@gmail.com", average: 38, status: "struggling" },
  { id: 2, name: "Priya Thapa", grade: 8, email: "priya@school.com", parentEmail: "priya.parent@gmail.com", average: 82, status: "good" },
  { id: 3, name: "Rohan Karki", grade: 9, email: "rohan@school.com", parentEmail: "rohan.parent@gmail.com", average: 91, status: "excellent" },
  { id: 4, name: "Sita Rai", grade: 7, email: "sita@school.com", parentEmail: "sita.parent@gmail.com", average: 48, status: "struggling" },
  { id: 5, name: "Bikash Gurung", grade: 8, email: "bikash@school.com", parentEmail: "bikash.parent@gmail.com", average: 74, status: "average" },
  { id: 6, name: "Anita Magar", grade: 10, email: "anita@school.com", parentEmail: "anita.parent@gmail.com", average: 88, status: "excellent" },
  { id: 7, name: "Sunil Tamang", grade: 7, email: "sunil@school.com", parentEmail: "sunil.parent@gmail.com", average: 65, status: "average" },
  { id: 8, name: "Kamala Shrestha", grade: 10, email: "kamala@school.com", parentEmail: "kamala.parent@gmail.com", average: 55, status: "average" },
];

// --- Form Schema ---
const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  grade: z.string().min(1, "Please select a grade"),
  email: z.string().email("Invalid email address"),
  parentEmail: z.string().email("Invalid parent email address"),
});

type StudentForm = z.infer<typeof studentSchema>;

// --- Status Badge ---
function StatusBadge({ status }: { status: Student["status"] }) {
  const map = {
    excellent: "bg-green-100 text-green-700 border-green-200",
    good: "bg-blue-100 text-blue-700 border-blue-200",
    average: "bg-yellow-100 text-yellow-700 border-yellow-200",
    struggling: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
  });

  // Filtered students
  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || s.grade.toString() === gradeFilter;
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  // Add student
  const onSubmit = (data: StudentForm) => {
    const newStudent: Student = {
      id: students.length + 1,
      name: data.name,
      grade: parseInt(data.grade),
      email: data.email,
      parentEmail: data.parentEmail,
      average: 0,
      status: "average",
    };
    setStudents((prev) => [...prev, newStudent]);
    toast.success(`${data.name} added successfully!`);
    reset();
    setOpen(false);
  };

  // Summary stats
  const total = students.length;
  const excellent = students.filter((s) => s.status === "excellent").length;
  const struggling = students.filter((s) => s.status === "struggling").length;
  const avgScore = Math.round(students.reduce((a, b) => a + b.average, 0) / total);

  return (
    <PageWrapper title="Students">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Students", value: total, color: "bg-blue-500", icon: GraduationCap },
            { label: "Excellent", value: excellent, color: "bg-green-500", icon: TrendingUp },
            { label: "Struggling", value: struggling, color: "bg-red-500", icon: TrendingDown },
            { label: "Class Average", value: `${avgScore}%`, color: "bg-purple-500", icon: TrendingUp },
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

        {/* Filters & Add Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56 bg-white"
              />
            </div>

            {/* Grade Filter */}
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-32 bg-white">
                <SelectValue placeholder="Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {[7, 8, 9, 10].map((g) => (
                  <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="average">Average</SelectItem>
                <SelectItem value="struggling">Struggling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Student Button */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div>
                  <Label>Full Name</Label>
                  <Input {...register("name")} placeholder="John Doe" className="mt-1" />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>Grade</Label>
                  <Select onValueChange={(val) => setValue("grade", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[7, 8, 9, 10].map((g) => (
                        <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade.message}</p>}
                </div>
                <div>
                  <Label>Student Email</Label>
                  <Input {...register("email")} placeholder="student@school.com" className="mt-1" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>Parent Email</Label>
                  <Input {...register("parentEmail")} placeholder="parent@gmail.com" className="mt-1" />
                  {errors.parentEmail && <p className="text-xs text-red-500 mt-1">{errors.parentEmail.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Student
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {student.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-xs text-slate-400">Grade {student.grade}</p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-7 h-7">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>View Grades</DropdownMenuItem>
                      <DropdownMenuItem>Send Report</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    {student.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    {student.parentEmail}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <StatusBadge status={student.status} />
                  <span className="text-sm font-bold text-slate-700">
                    {student.average > 0 ? `${student.average}%` : "No grades yet"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No students found</p>
            <p className="text-slate-400 text-sm">Try adjusting your filters</p>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}