"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, Lock, Clock, Star, Users, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")

  const courses = [
    {
      id: 1,
      title: "Ngữ pháp cơ bản",
      level: "beginner",
      levelText: "Sơ cấp",
      description: "Học các cấu trúc ngữ pháp cơ bản của tiếng Trung",
      lessons: 20,
      completedLessons: 12,
      duration: "4 tuần",
      students: 1250,
      rating: 4.8,
      image: "/chinese-grammar-book.png",
      color: "bg-green-500",
      unlocked: true,
    },
    {
      id: 2,
      title: "Ngữ pháp trung cấp",
      level: "intermediate",
      levelText: "Trung cấp",
      description: "Nâng cao kỹ năng với các cấu trúc phức tạp hơn",
      lessons: 25,
      completedLessons: 0,
      duration: "6 tuần",
      students: 890,
      rating: 4.9,
      image: "/intermediate-chinese-textbook.png",
      color: "bg-blue-500",
      unlocked: true,
    },
    {
      id: 3,
      title: "Ngữ pháp nâng cao",
      level: "advanced",
      levelText: "Cao cấp",
      description: "Thành thạo các cấu trúc ngữ pháp phức tạp nhất",
      lessons: 30,
      completedLessons: 0,
      duration: "8 tuần",
      students: 456,
      rating: 4.7,
      image: "/advanced-chinese-grammar.png",
      color: "bg-purple-500",
      unlocked: false,
    },
    {
      id: 4,
      title: "Luyện thi HSK 1",
      level: "beginner",
      levelText: "Sơ cấp",
      description: "Chuẩn bị cho kỳ thi HSK cấp độ 1",
      lessons: 15,
      completedLessons: 8,
      duration: "3 tuần",
      students: 2100,
      rating: 4.6,
      image: "/hsk-test-preparation.png",
      color: "bg-orange-500",
      unlocked: true,
    },
  ]

  const recentLessons = [
    {
      id: 1,
      title: "Cấu trúc câu cơ bản",
      course: "Ngữ pháp cơ bản",
      progress: 100,
      lastStudied: "2 giờ trước",
    },
    {
      id: 2,
      title: "Thì hiện tại",
      course: "Ngữ pháp cơ bản",
      progress: 75,
      lastStudied: "1 ngày trước",
    },
    {
      id: 3,
      title: "Từ chỉ định lượng",
      course: "Luyện thi HSK 1",
      progress: 50,
      lastStudied: "2 ngày trước",
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-space-grotesk font-bold text-3xl mb-2">Khóa học</h1>
          <p className="text-muted-foreground">Chọn khóa học phù hợp với trình độ của bạn</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === "all" ? "default" : "outline"}
              onClick={() => setSelectedLevel("all")}
              size="sm"
            >
              Tất cả
            </Button>
            <Button
              variant={selectedLevel === "beginner" ? "default" : "outline"}
              onClick={() => setSelectedLevel("beginner")}
              size="sm"
            >
              Sơ cấp
            </Button>
            <Button
              variant={selectedLevel === "intermediate" ? "default" : "outline"}
              onClick={() => setSelectedLevel("intermediate")}
              size="sm"
            >
              Trung cấp
            </Button>
            <Button
              variant={selectedLevel === "advanced" ? "default" : "outline"}
              onClick={() => setSelectedLevel("advanced")}
              size="sm"
            >
              Cao cấp
            </Button>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Tất cả khóa học</TabsTrigger>
            <TabsTrigger value="continue">Tiếp tục học</TabsTrigger>
            <TabsTrigger value="grammar">Tra cứu ngữ pháp</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={course.color}>{course.levelText}</Badge>
                    </div>
                    {!course.unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {course.title}
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{course.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons} bài học
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students}
                        </span>
                      </div>

                      {course.completedLessons > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Tiến độ</span>
                            <span>{Math.round((course.completedLessons / course.lessons) * 100)}%</span>
                          </div>
                          <Progress value={(course.completedLessons / course.lessons) * 100} />
                        </div>
                      )}

                      <Link href={course.unlocked ? `/courses/${course.id}` : "#"}>
                        <Button className="w-full" disabled={!course.unlocked}>
                          {course.unlocked ? (
                            course.completedLessons > 0 ? (
                              <>
                                Tiếp tục học <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            ) : (
                              <>
                                Bắt đầu học <Play className="h-4 w-4 ml-2" />
                              </>
                            )
                          ) : (
                            <>
                              Chưa mở khóa <Lock className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="continue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bài học gần đây</CardTitle>
                <CardDescription>Tiếp tục từ nơi bạn đã dừng lại</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground">{lesson.course}</p>
                          <p className="text-xs text-muted-foreground">{lesson.lastStudied}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{lesson.progress}%</div>
                          <Progress value={lesson.progress} className="w-20" />
                        </div>
                        <Button size="sm">Tiếp tục</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grammar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tra cứu ngữ pháp</CardTitle>
                <CardDescription>Tìm kiếm nhanh các cấu trúc ngữ pháp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm cấu trúc ngữ pháp..." className="pl-10" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { title: "Cấu trúc câu cơ bản", examples: "主语 + 谓语 + 宾语", bookmarked: true },
                      { title: "Thì hiện tại", examples: "我学习中文", bookmarked: false },
                      { title: "Từ chỉ định lượng", examples: "一个、两本、三只", bookmarked: true },
                      { title: "Câu hỏi", examples: "你好吗？什么时候？", bookmarked: false },
                    ].map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{item.title}</h3>
                          <Button variant="ghost" size="sm">
                            <Star className={`h-4 w-4 ${item.bookmarked ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.examples}</p>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          Xem chi tiết
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
