"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Play, CheckCircle, Clock, ArrowLeft, Star, Lock } from "lucide-react"

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const courseId = Number.parseInt(params.id)

  const course = {
    id: courseId,
    title: "Ngữ pháp cơ bản",
    level: "Sơ cấp",
    description: "Học các cấu trúc ngữ pháp cơ bản của tiếng Trung từ những kiến thức nền tảng nhất",
    totalLessons: 20,
    completedLessons: 12,
    duration: "4 tuần",
    students: 1250,
    rating: 4.8,
    instructor: "Thầy Lý Minh",
    image: "/chinese-grammar-textbook.png",
  }

  const chapters = [
    {
      id: 1,
      title: "Chương 1: Giới thiệu cơ bản",
      lessons: [
        { id: 1, title: "Cấu trúc câu cơ bản", duration: "15 phút", completed: true, unlocked: true },
        { id: 2, title: "Thứ tự từ trong câu", duration: "20 phút", completed: true, unlocked: true },
        { id: 3, title: "Chủ ngữ và vị ngữ", duration: "18 phút", completed: true, unlocked: true },
        { id: 4, title: "Kiểm tra chương 1", duration: "10 phút", completed: true, unlocked: true, isQuiz: true },
      ],
    },
    {
      id: 2,
      title: "Chương 2: Thì và thể",
      lessons: [
        { id: 5, title: "Thì hiện tại", duration: "22 phút", completed: true, unlocked: true },
        { id: 6, title: "Thì quá khứ", duration: "25 phút", completed: true, unlocked: true },
        { id: 7, title: "Thì tương lai", duration: "20 phút", completed: false, unlocked: true },
        { id: 8, title: "Kiểm tra chương 2", duration: "15 phút", completed: false, unlocked: false, isQuiz: true },
      ],
    },
    {
      id: 3,
      title: "Chương 3: Từ chỉ định lượng",
      lessons: [
        { id: 9, title: "Từ đếm cơ bản", duration: "18 phút", completed: false, unlocked: false },
        { id: 10, title: "Từ đếm đặc biệt", duration: "20 phút", completed: false, unlocked: false },
        { id: 11, title: "Luyện tập từ đếm", duration: "15 phút", completed: false, unlocked: false },
        { id: 12, title: "Kiểm tra chương 3", duration: "12 phút", completed: false, unlocked: false, isQuiz: true },
      ],
    },
  ]

  const totalLessons = chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
  const completedLessons = chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.filter((lesson) => lesson.completed).length,
    0,
  )
  const progressPercentage = (completedLessons / totalLessons) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">中</span>
            </div>
            <span className="font-space-grotesk font-bold text-xl">ChineseMaster</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/courses" className="text-primary font-medium">
              Khóa học
            </Link>
            <Link href="/flashcards" className="text-muted-foreground hover:text-foreground transition-colors">
              Flashcard
            </Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
              Cộng đồng
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/diverse-user-avatars.png" alt="User" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/courses"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại khóa học
        </Link>

        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Badge className="mb-2">{course.level}</Badge>
              <h1 className="font-space-grotesk font-bold text-3xl mb-2">{course.title}</h1>
              <p className="text-muted-foreground text-lg">{course.description}</p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {course.totalLessons} bài học
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {course.rating} ({course.students} học viên)
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Tiến độ khóa học</span>
                <span>{Math.round(progressPercentage)}% hoàn thành</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground mt-1">
                {completedLessons}/{totalLessons} bài học đã hoàn thành
              </p>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader className="text-center">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <CardTitle>Giảng viên</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src="/chinese-teacher.png" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-muted-foreground">Chuyên gia ngữ pháp tiếng Trung</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <div className="space-y-6">
          {chapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {chapter.title}
                  <Badge variant="outline">
                    {chapter.lessons.filter((l) => l.completed).length}/{chapter.lessons.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chapter.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        lesson.unlocked ? "hover:bg-muted/50 cursor-pointer" : "opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            lesson.completed
                              ? "bg-primary text-primary-foreground"
                              : lesson.unlocked
                                ? "bg-muted"
                                : "bg-muted/50"
                          }`}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : lesson.unlocked ? (
                            lesson.isQuiz ? (
                              <BookOpen className="h-5 w-5" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )
                          ) : (
                            <Lock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {lesson.title}
                            {lesson.isQuiz && (
                              <Badge variant="secondary" className="text-xs">
                                Quiz
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.unlocked && (
                          <Link href={`/courses/${courseId}/lessons/${lesson.id}`}>
                            <Button size="sm" variant={lesson.completed ? "outline" : "default"}>
                              {lesson.completed ? "Xem lại" : "Bắt đầu"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
