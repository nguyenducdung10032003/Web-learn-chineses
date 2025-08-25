"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Flame, Target, BookOpen, Clock, Award } from "lucide-react"

const achievements = [
  {
    id: 1,
    title: "Người mới bắt đầu",
    description: "Hoàn thành bài học đầu tiên",
    icon: BookOpen,
    progress: 100,
    maxProgress: 100,
    earned: true,
    category: "learning",
    xp: 50,
  },
  {
    id: 2,
    title: "Chuỗi 7 ngày",
    description: "Học liên tục 7 ngày",
    icon: Flame,
    progress: 5,
    maxProgress: 7,
    earned: false,
    category: "streak",
    xp: 200,
  },
  {
    id: 3,
    title: "Bậc thầy từ vựng",
    description: "Học 100 từ vựng mới",
    icon: Star,
    progress: 67,
    maxProgress: 100,
    earned: false,
    category: "vocabulary",
    xp: 300,
  },
  {
    id: 4,
    title: "Tốc độ ánh sáng",
    description: "Trả lời đúng 10 câu trong 30 giây",
    icon: Clock,
    progress: 0,
    maxProgress: 10,
    earned: false,
    category: "speed",
    xp: 150,
  },
  {
    id: 5,
    title: "Chiến binh ngữ pháp",
    description: "Hoàn thành 50 bài tập ngữ pháp",
    icon: Target,
    progress: 23,
    maxProgress: 50,
    earned: false,
    category: "grammar",
    xp: 250,
  },
  {
    id: 6,
    title: "Người dẫn đầu",
    description: "Đứng top 10 bảng xếp hạng",
    icon: Trophy,
    progress: 0,
    maxProgress: 1,
    earned: false,
    category: "competition",
    xp: 500,
  },
]

const categories = [
  { id: "all", name: "Tất cả", icon: Award },
  { id: "learning", name: "Học tập", icon: BookOpen },
  { id: "streak", name: "Chuỗi ngày", icon: Flame },
  { id: "vocabulary", name: "Từ vựng", icon: Star },
  { id: "grammar", name: "Ngữ pháp", icon: Target },
  { id: "speed", name: "Tốc độ", icon: Clock },
  { id: "competition", name: "Thi đấu", icon: Trophy },
]

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((achievement) => achievement.category === selectedCategory)

  const earnedCount = achievements.filter((a) => a.earned).length
  const totalXP = achievements.filter((a) => a.earned).reduce((sum, a) => sum + a.xp, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thành tích</h1>
        <p className="text-gray-600">Theo dõi tiến trình và thành tích học tập của bạn</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{earnedCount}</p>
                <p className="text-sm text-gray-600">Thành tích đạt được</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalXP}</p>
                <p className="text-sm text-gray-600">Tổng XP kiếm được</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((earnedCount / achievements.length) * 100)}%
                </p>
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const Icon = achievement.icon
          return (
            <Card key={achievement.id} className={`relative ${achievement.earned ? "ring-2 ring-emerald-500" : ""}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${achievement.earned ? "bg-emerald-100" : "bg-gray-100"}`}>
                    <Icon className={`h-6 w-6 ${achievement.earned ? "text-emerald-600" : "text-gray-400"}`} />
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Đã đạt
                    </Badge>
                  )}
                </div>
                <div>
                  <CardTitle className={`text-lg ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                    {achievement.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{achievement.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tiến độ</span>
                    <span className="font-medium">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Phần thưởng</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      +{achievement.xp} XP
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
