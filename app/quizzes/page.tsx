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
  ClipboardList,
  Plus,
  Search,
  Loader2,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// --- Types ---
interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  subject: string;
  grade: number;
  topic: string;
  type: string;
  numQuestions: number;
  questions: Question[];
  createdAt: string;
}

// --- Dummy Data ---
const initialQuizzes: Quiz[] = [
  {
    id: 1,
    subject: "Science",
    grade: 6,
    topic: "Photosynthesis",
    type: "MCQ",
    numQuestions: 5,
    createdAt: "2024-02-01",
    questions: [
      { question: "What do plants use to make food?", options: ["Sunlight", "Moonlight", "Starlight", "Firelight"], answer: "Sunlight" },
      { question: "What gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Carbon Dioxide" },
      { question: "What is the green pigment in plants called?", options: ["Melanin", "Chlorophyll", "Carotene", "Anthocyanin"], answer: "Chlorophyll" },
      { question: "Where does photosynthesis occur?", options: ["Root", "Stem", "Chloroplast", "Mitochondria"], answer: "Chloroplast" },
      { question: "What do plants release during photosynthesis?", options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Water"], answer: "Oxygen" },
    ],
  },
  {
    id: 2,
    subject: "Mathematics",
    grade: 8,
    topic: "Fractions",
    type: "MCQ",
    numQuestions: 4,
    createdAt: "2024-02-03",
    questions: [
      { question: "What is 1/2 + 1/4?", options: ["1/6", "3/4", "2/6", "1/3"], answer: "3/4" },
      { question: "What is 3/4 - 1/4?", options: ["2/4", "1/2", "1/4", "3/8"], answer: "1/2" },
      { question: "What is 2/3 x 3/4?", options: ["6/12", "1/2", "5/7", "2/7"], answer: "1/2" },
      { question: "What is 1/2 ÷ 1/4?", options: ["1/8", "2", "1/2", "4"], answer: "2" },
    ],
  },
];

// --- Form Schema ---
const quizSchema = z.object({
  subject: z.string().min(1, "Subject required"),
  grade: z.string().min(1, "Grade required"),
  topic: z.string().min(2, "Topic required"),
  type: z.string().min(1, "Question type required"),
  numQuestions: z.string().min(1, "Number of questions required"),
});

type QuizForm = z.infer<typeof quizSchema>;

// --- View Quiz Dialog ---
function ViewQuizDialog({ quiz }: { quiz: Quiz }) {
  const [open, setOpen] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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
            <DialogTitle>{quiz.topic} — {quiz.subject} Quiz</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            <Badge variant="outline">Grade {quiz.grade}</Badge>
            <Badge variant="outline">{quiz.type}</Badge>
            <Badge variant="outline">{quiz.numQuestions} Questions</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAnswers(!showAnswers)}
            className="mb-4 gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {showAnswers ? "Hide Answers" : "Show Answers"}
          </Button>
          <div className="space-y-5">
            {quiz.questions.map((q, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4">
                <p className="font-medium text-slate-800 mb-3">
                  {i + 1}. {q.question}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`text-sm px-3 py-2 rounded-lg border ${
                        showAnswers && opt === q.answer
                          ? "bg-green-50 border-green-300 text-green-700 font-medium"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </div>
                  ))}
                </div>
                {showAnswers && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    ✓ Answer: {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
  });

  // Filtered quizzes
  const filtered = quizzes.filter((q) => {
    const matchSearch = q.topic.toLowerCase().includes(search.toLowerCase()) ||
      q.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || q.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  // Generate quiz (will call AI later)
  const onSubmit = async (data: QuizForm) => {
    setGenerating(true);
    try {
      // Dummy questions for now — will be replaced by AI
      await new Promise((res) => setTimeout(res, 1500));
      const dummyQuestions: Question[] = Array.from(
        { length: parseInt(data.numQuestions) },
        (_, i) => ({
          question: `Sample question ${i + 1} about ${data.topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          answer: "Option A",
        })
      );
      const newQuiz: Quiz = {
        id: quizzes.length + 1,
        subject: data.subject,
        grade: parseInt(data.grade),
        topic: data.topic,
        type: data.type,
        numQuestions: parseInt(data.numQuestions),
        questions: dummyQuestions,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setQuizzes((prev) => [...prev, newQuiz]);
      toast.success("Quiz generated successfully!");
      reset();
      setOpen(false);
    } catch {
      toast.error("Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  // Delete quiz
  const deleteQuiz = (id: number) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    toast.success("Quiz deleted");
  };

  return (
    <PageWrapper title="Quizzes">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Quizzes", value: quizzes.length, color: "bg-blue-500" },
            { label: "Subjects Covered", value: new Set(quizzes.map((q) => q.subject)).size, color: "bg-purple-500" },
            { label: "Total Questions", value: quizzes.reduce((a, b) => a + b.numQuestions, 0), color: "bg-green-500" },
            { label: "Grades Covered", value: new Set(quizzes.map((q) => q.grade)).size, color: "bg-orange-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className={`${stat.color} p-2.5 rounded-xl`}>
                  <ClipboardList className="w-5 h-5 text-white" />
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
                placeholder="Search quizzes..."
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

          {/* Generate Quiz */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Generate Quiz
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Quiz</DialogTitle>
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
                  <Input {...register("topic")} placeholder="e.g. Photosynthesis" className="mt-1" />
                  {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic.message}</p>}
                </div>
                <div>
                  <Label>Question Type</Label>
                  <Select onValueChange={(val) => setValue("type", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MCQ">Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value="True/False">True / False</SelectItem>
                      <SelectItem value="Short Answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
                </div>
                <div>
                  <Label>Number of Questions</Label>
                  <Select onValueChange={(val) => setValue("numQuestions", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How many questions?" />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20].map((n) => (
                        <SelectItem key={n} value={n.toString()}>{n} Questions</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.numQuestions && <p className="text-xs text-red-500 mt-1">{errors.numQuestions.message}</p>}
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
                    "Generate Quiz"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quiz Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-slate-800">{quiz.topic}</CardTitle>
                    <p className="text-sm text-slate-400 mt-0.5">{quiz.subject}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                    Grade {quiz.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge variant="outline" className="text-xs">
                    <ClipboardList className="w-3 h-3 mr-1" />
                    {quiz.numQuestions} Questions
                  </Badge>
                  <Badge variant="outline" className="text-xs">{quiz.type}</Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {quiz.createdAt}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <ViewQuizDialog quiz={quiz} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteQuiz(quiz.id)}
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
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No quizzes found</p>
            <p className="text-slate-400 text-sm">Generate your first quiz using the button above</p>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}