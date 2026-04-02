"use client";

import { useState, useRef } from "react";
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
  FolderOpen,
  Plus,
  Search,
  Trash2,
  FileText,
  Upload,
  BookOpen,
  FlaskConical,
  Languages,
  Clock,
  Eye,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// --- Types ---
interface Material {
  id: number;
  title: string;
  subject: string;
  grade: number;
  type: "Notes" | "Past Paper" | "Reference" | "Worksheet";
  content: string;
  uploadedAt: string;
  size: string;
}

// --- Dummy Data ---
const initialMaterials: Material[] = [
  {
    id: 1,
    title: "Photosynthesis Complete Notes",
    subject: "Science",
    grade: 6,
    type: "Notes",
    content: "Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to produce oxygen and energy in the form of sugar. Chlorophyll in the chloroplasts absorbs light energy...",
    uploadedAt: "2024-02-01",
    size: "24 KB",
  },
  {
    id: 2,
    title: "Fractions Past Paper 2023",
    subject: "Mathematics",
    grade: 8,
    type: "Past Paper",
    content: "Section A: Answer all questions. 1. Simplify 3/6. 2. Add 1/2 + 1/4. 3. Multiply 2/3 x 3/4...",
    uploadedAt: "2024-02-03",
    size: "18 KB",
  },
  {
    id: 3,
    title: "English Grammar Reference Sheet",
    subject: "English",
    grade: 9,
    type: "Reference",
    content: "Parts of Speech: Noun, Verb, Adjective, Adverb, Pronoun, Preposition, Conjunction, Interjection. Tenses: Simple Present, Past, Future...",
    uploadedAt: "2024-02-05",
    size: "32 KB",
  },
  {
    id: 4,
    title: "Algebra Worksheet — Grade 9",
    subject: "Mathematics",
    grade: 9,
    type: "Worksheet",
    content: "Solve the following equations: 1. 2x + 3 = 7, 2. 3x - 5 = 10, 3. x/2 + 4 = 8...",
    uploadedAt: "2024-02-07",
    size: "15 KB",
  },
  {
    id: 5,
    title: "World War II Study Notes",
    subject: "History",
    grade: 10,
    type: "Notes",
    content: "World War II began in 1939 when Germany invaded Poland. The war involved most of the world's nations forming two opposing military alliances...",
    uploadedAt: "2024-02-08",
    size: "41 KB",
  },
];

// --- Form Schema ---
const materialSchema = z.object({
  title: z.string().min(2, "Title required"),
  subject: z.string().min(1, "Subject required"),
  grade: z.string().min(1, "Grade required"),
  type: z.string().min(1, "Type required"),
  content: z.string().min(10, "Please add some content"),
});

type MaterialForm = z.infer<typeof materialSchema>;

// --- Subject Icon ---
function SubjectIcon({ subject }: { subject: string }) {
  if (subject === "Science") return <FlaskConical className="w-5 h-5 text-green-500" />;
  if (subject === "English") return <Languages className="w-5 h-5 text-purple-500" />;
  if (subject === "Mathematics") return <BookOpen className="w-5 h-5 text-blue-500" />;
  return <FileText className="w-5 h-5 text-slate-500" />;
}

// --- Type Badge ---
function TypeBadge({ type }: { type: Material["type"] }) {
  const map = {
    "Notes": "bg-blue-100 text-blue-700 border-blue-200",
    "Past Paper": "bg-purple-100 text-purple-700 border-purple-200",
    "Reference": "bg-green-100 text-green-700 border-green-200",
    "Worksheet": "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[type]}`}>
      {type}
    </span>
  );
}

// --- View Material Dialog ---
function ViewMaterialDialog({ material }: { material: Material }) {
  const [open, setOpen] = useState(false);
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
            <DialogTitle>{material.title}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 flex-wrap mb-4">
            <Badge variant="outline">{material.subject}</Badge>
            <Badge variant="outline">Grade {material.grade}</Badge>
            <TypeBadge type={material.type} />
            <Badge variant="outline">{material.size}</Badge>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {material.content}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Uploaded: {material.uploadedAt} · Stored in ChromaDB for RAG search
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MaterialForm>({
    resolver: zodResolver(materialSchema),
  });

  // Filtered materials
  const filtered = materials.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = subjectFilter === "all" || m.subject === subjectFilter;
    const matchType = typeFilter === "all" || m.type === typeFilter;
    return matchSearch && matchSubject && matchType;
  });

  // Upload material
  const onSubmit = (data: MaterialForm) => {
    const newMaterial: Material = {
      id: materials.length + 1,
      title: data.title,
      subject: data.subject,
      grade: parseInt(data.grade),
      type: data.type as Material["type"],
      content: data.content,
      uploadedAt: new Date().toISOString().split("T")[0],
      size: `${Math.floor(data.content.length / 50)} KB`,
    };
    setMaterials((prev) => [...prev, newMaterial]);
    toast.success("Material uploaded to ChromaDB!");
    reset();
    setOpen(false);
  };

  // Delete material
  const deleteMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    toast.success("Material deleted from ChromaDB");
  };

  // Stats
  const totalSize = materials.length * 24;
  const subjects = new Set(materials.map((m) => m.subject)).size;
  const notes = materials.filter((m) => m.type === "Notes").length;
  const papers = materials.filter((m) => m.type === "Past Paper").length;

  return (
    <PageWrapper title="Materials">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Materials", value: materials.length, color: "bg-blue-500" },
            { label: "Subjects", value: subjects, color: "bg-purple-500" },
            { label: "Notes", value: notes, color: "bg-green-500" },
            { label: "Past Papers", value: papers, color: "bg-orange-500" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 pt-6">
                <div className={`${stat.color} p-2.5 rounded-xl`}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ChromaDB Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <FolderOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              All materials are stored in ChromaDB
            </p>
            <p className="text-xs text-blue-600">
              The AI agent uses these materials for RAG-powered search and lesson plan generation.
              {" "}{materials.length} documents · ~{totalSize} KB indexed
            </p>
          </div>
        </div>

        {/* Filters & Upload Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search materials..."
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
                <SelectItem value="History">History</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36 bg-white">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Notes">Notes</SelectItem>
                <SelectItem value="Past Paper">Past Paper</SelectItem>
                <SelectItem value="Reference">Reference</SelectItem>
                <SelectItem value="Worksheet">Worksheet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Material */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Material to ChromaDB</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                <div>
                  <Label>Title</Label>
                  <Input {...register("title")} placeholder="e.g. Photosynthesis Notes" className="mt-1" />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Subject</Label>
                    <Select onValueChange={(val) => setValue("subject", val)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <Label>Grade</Label>
                    <Select onValueChange={(val) => setValue("grade", val)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[6, 7, 8, 9, 10].map((g) => (
                          <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade.message}</p>}
                  </div>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select onValueChange={(val) => setValue("type", val)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Material type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Notes">Notes</SelectItem>
                      <SelectItem value="Past Paper">Past Paper</SelectItem>
                      <SelectItem value="Reference">Reference</SelectItem>
                      <SelectItem value="Worksheet">Worksheet</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>}
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    {...register("content")}
                    placeholder="Paste your material content here — this will be stored in ChromaDB and used by the AI agent for search and lesson planning..."
                    className="mt-1 min-h-[120px]"
                  />
                  {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload to ChromaDB
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <SubjectIcon subject={material.subject} />
                    </div>
                    <div>
                      <CardTitle className="text-sm text-slate-800 leading-snug">
                        {material.title}
                      </CardTitle>
                      <p className="text-xs text-slate-400 mt-0.5">{material.subject}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
                    G{material.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Content Preview */}
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                  {material.content}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <TypeBadge type={material.type} />
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {material.uploadedAt}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {material.size}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <ViewMaterialDialog material={material} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMaterial(material.id)}
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
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No materials found</p>
            <p className="text-slate-400 text-sm">Upload your first material using the button above</p>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
