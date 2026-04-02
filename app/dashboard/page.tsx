"use client";

import PageWrapper from "@/components/shared/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  MessageSquareText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- Dummy Data (will be replaced by real API data later) ---

const stats = [
  {
    label: "Total Students",
    value: "128",
    icon: GraduationCap,
    color: "bg-blue-500",
    change: "+4 this month",
  },
  {
    label: "Assignments Graded",
    value: "342",
    icon: ClipboardList,
    color: "bg-green-500",
    change: "+12 this week",
  },
  {
    label: "Class Average",
    value: "76%",
    icon: TrendingUp,
    color: "bg-purple-500",
    change: "+2% from last month",
  },
  {
    label: "Struggling Students",
    value: "14",
    icon: AlertTriangle,
    color: "bg-red-500",
    change: "Needs attention",
  },
];

const gradeDistribution = [
  { grade: "A", students: 32 },
  { grade: "B", students: 45 },
  { grade: "C", students: 28 },
  { grade: "D", students: 15 },
  { grade: "F", students: 8 },
];

const performanceTrend = [
  { month: "Sep", average: 68 },
  { month: "Oct", average: 72 },
  { month: "Nov", average: 70 },
  { month: "Dec", average: 75 },
  { month: "Jan", average: 74 },
  { month: "Feb", average: 76 },
];

const strugglingStudents = [
  { name: "Aarav Sharma", subject: "Mathematics", score: 38 },
  { name: "Priya Thapa", subject: "Science", score: 42 },
  { name: "Rohan Karki", subject: "English", score: 45 },
  { name: "Sita Rai", subject: "Mathematics", score: 48 },
];

const recentActivity = [
  { action: "Graded essays for Grade 8 Science", time: "2 mins ago" },
  { action: "Generated quiz on Photosynthesis", time: "1 hour ago" },
  { action: "Sent progress reports to 32 parents", time: "3 hours ago" },
  { action: "Created lesson plan for Grade 9 Math", time: "Yesterday" },
];

const quickActions = [
  { label: "Chat with Agent", href: "/chat", icon: MessageSquareText, color: "bg-blue-500" },
  { label: "Add Student", href: "/students", icon: GraduationCap, color: "bg-green-500" },
  { label: "Create Quiz", href: "/quizzes", icon: ClipboardList, color: "bg-purple-500" },
  { label: "New Lesson Plan", href: "/lessons", icon: BookOpen, color: "bg-orange-500" },
];

export default function DashboardPage() {
  return (
    <PageWrapper title="Dashboard">
      <div className="space-y-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Grade Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="grade" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                  <YAxis tick={{ fontSize: 13 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Struggling Students */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Struggling Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {strugglingStudents.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.subject}</p>
                    </div>
                    <Badge variant="destructive">{s.score}%</Badge>
                  </div>
                  <Progress value={s.score} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700">{a.action}</p>
                    <p className="text-xs text-slate-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col gap-2 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className={`${action.color} p-1.5 rounded-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-slate-600">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

        </div>
      </div>
    </PageWrapper>
  );
}