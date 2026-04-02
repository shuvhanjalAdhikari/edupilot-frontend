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
  BookOpen,
  Plus,
  Search,
  Loader2,
  Eye,
  Trash2,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// --- Types ---
interface DayPlan {
  day: number;
  title: string;
  objectives: string[];
  activities: string[];
  homework: string;
}

interface LessonPlan {
  id: number;
  subject: string;
  grade: number;
  topic: string;
  durationDays: number;
  days: DayPlan[];
  createdAt: string;
}

// --- Dummy Data ---
const initialPlans: LessonPlan[] = [
  {
    id: 1,
    subject: "Mathematics",
    grade: 8,
    topic: "Fractions",
    durationDays: 3,
    createdAt: "2024-02-01",
    days: [
      {
        day: 1,
        title: "Introduction to Fractions",
        objectives: ["Understand what fractions are", "Identify numerator and denominator"],
        activities: ["Class discussion", "Visual fraction models", "Group activity with fraction strips"],
        homework: "Complete 10 fraction identification exercises",
      },
      {
        day: 2,
        title: "Adding and Subtracting Fractions",
        objectives: ["Add fractions with same denominator", "Subtract fractions with same denominator"],
        activities: ["Worked examples on board", "Pair practice problems", "Quiz at end of class"],
        homework: "Solve 15 addition and subtraction problems",
      },
      {
        day: 3,
        title: "Multiplying and Dividing Fractions",
        objectives: ["Multiply two fractions", "Divide fractions using reciprocal"],
        activities: ["Step-by-step demonstration", "Independent practice", "Real-world word problems"],
        homework: "Complete worksheet on multiplication and division of fractions",
      },
    ],
  },
  {
    id: 2,
    subject: "Science",
    grade: 6,
    topic: "Photosynthesis",
    durationDays: 2,
    createdAt: "2024-02-05",
    days: [
      {
        day: 1,
        title: "What is Photosynthesis?",
        objectives: ["Define photosynthesis", "Identify inputs and outputs"],
        activities: ["Video on photosynthesis", "Diagram labeling", "Class Q&A"],
        homework: "Draw and label a diagram of photosynthesis",
      },
      {
        day: 2,
        title: "Factors Affecting Photosynthesis",
        objectives: ["List factors affecting photosynthesis", "Explain role of chlorophyll"],
        activities: ["Lab experiment with plants", "Group discussion", "Observation recording"],
        homework: "Write a one-page summary of today's lab",
      },
    ],
  },
];

// --- Form Schema ---
const planSchema = z.object({
  subject: z.string().min(1, "Subject required"),
  grade: z.string().min(1, "Grade required"),
  topic: z.string().min(2, "Topic required"),
  durationDays: z.string().min(1, "Duration required"),
});

type PlanForm = z.infer<typeof planSchema>;

// --- View Plan Dialog ---
function ViewPlanDialog({ plan }: { plan: LessonPlan }) {
  const [open, setOpen] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1"
      >
        <Eye className="w-3.5 h-3.5" />
        View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{plan.topic} — {plan.subject}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4 flex-wrap">
            <Badge variant="outline">Grade {plan.grade}</Badge>
            <Badge variant="outline">{plan.durationDays} Days</Badge>
            <Badge variant="outline">{plan.createdAt}</Badge>
          </div>
          <div className="space-y-3">
            {plan.days.map((day) => (
              <div
                key={day.day}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <span className="font-medium text-slate-700 text-sm">{day.title}</span>
                  </div>
                  {expandedDay === day.day ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Day Content */}
                {expandedDay === day.day && (
                  <div className="px-4 py-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Learning Objectives
                      </p>
                      <ul className="space-y-1">
                        {day.objectives.map((obj, i) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Activities
                      </p>
                      <ul className="space-y-1">
                        {day.activities.map((act, i) => (
                          <li key={i} className="text-sm text-slate-600 flex gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-semibold text-yellow-700 mb-1">Homework</p>
                      <p className="text-sm text-yellow-800">{day.homework}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function LessonsPage() {
  const [plans, setPlans] = useState<LessonPlan[]>(initialPlans);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
  });

  // Filtered plans
  const filtered = plans.filter((p) => {
    const matchSearch = p.topic.toLowerCase().includes(search.toLowerCase()) ||
      p.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || p.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  // Generate lesson plan
  const onSubmit = async (data: PlanForm) => {
    setGenerating(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const days: DayPlan[] = Array.from(
        { length: parseInt(data.durationDays) },
        (_, i) => ({
          day: i + 1,
          title: `Day ${i + 1} — ${data.topic}`,
          objectives: [`Objective 1 for day ${i + 1}`, `Objective 2 for day ${i + 1}`],
          activities: ["Introduction activity", "Main lesson", "Practice exercise"],
          homework: `Complete day ${i + 1} exercises on ${data.topic}`,
        })
      );
      const newPlan: LessonPlan = {
        id: plans.length + 1,
        subject: data.subject,
        grade: parseInt(data.grade),
        topic: data.topic,
        durationDays: parseInt(data.durationDays),
        days,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setPlans((prev) => [...prev, newPlan]);
      toast.success("Lesson plan generated!");
      reset();
      setOpen(false);
    } catch {
      toast.error("Failed to generate lesson plan");
    } finally {
      setGenerating(false);
    }
  };

  // Delete plan
  const deletePlan = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    toast.success("Lesson plan deleted");
  };

  return (
    <PageWrapper title="Lesson Plans">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Plans", value: plans.length, color: "bg-blue-500" },
            { label: "Subjects", value: new Set(plans.map((p) => p.subject)).size, color: "bg-purple-500" },
            { label: "Total Days Planned", value: plans.reduce((a, b) => a + b.durationDays, 0), color: "bg-green-500" },
            { label: "Grades Covered", value: new Set(plans.map((p) => p.grade)).size, color: "bg-orange-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className={`${stat.color} p-2.5 rounded-xl`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Generate Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search lesson plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56 bg-white"
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

          {/* Generate Plan */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Lesson Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
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
                  <Label>Grade</Label>
                  <Select onValueChange={(val) => setValue("grade", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[6, 7, 8, 9, 10].map((g) => (
                        <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade.message}</p>}
                </div>
                <div>
                  <Label>Topic</Label>
                  <Input {...register("topic")} placeholder="e.g. Fractions" className="mt-1" />
                  {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic.message}</p>}
                </div>
                <div>
                  <Label>Duration</Label>
                  <Select onValueChange={(val) => setValue("durationDays", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How many days?" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 5, 7].map((d) => (
                        <SelectItem key={d} value={d.toString()}>{d} {d === 1 ? "Day" : "Days"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.durationDays && <p className="text-xs text-red-500 mt-1">{errors.durationDays.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Lesson Plan"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lesson Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-800">{plan.topic}</CardTitle>
                    <p className="text-sm text-slate-400 mt-0.5">{plan.subject}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                    Grade {plan.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {plan.durationDays} {plan.durationDays === 1 ? "Day" : "Days"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {plan.createdAt}
                  </Badge>
                </div>

                {/* Day Pills */}
                <div className="flex gap-1 flex-wrap mb-4">
                  {plan.days.map((day) => (
                    <span
                      key={day.day}
                      className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                    >
                      Day {day.day}: {day.title.split("—")[1]?.trim() || day.title}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <ViewPlanDialog plan={plan} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deletePlan(plan.id)}
                    className="gap-1 text-red-500 hover:text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No lesson plans found</p>
            <p className="text-slate-400 text-sm">Generate your first lesson plan using the button above</p>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}