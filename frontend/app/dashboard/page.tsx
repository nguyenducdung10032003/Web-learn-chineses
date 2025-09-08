"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Trophy,
  Flame,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Zap,
  Clock,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { BASE_URL } from "@/constants";

export default function DashboardPage() {
  // const [user] = useState({
  //   name: "Nguyễn Văn A",
  //   email: "nguyenvana@email.com",
  //   avatar: "/diverse-user-avatars.png",
  //   level: 12,
  //   xp: 2450,
  //   xpToNextLevel: 3000,
  //   streak: 15,
  //   totalLessons: 45,
  //   completedLessons: 32,
  //   badges: [
  //     { id: 1, name: "Người mới bắt đầu", icon: "🌟", earned: true },
  //     { id: 2, name: "Học liên tục 7 ngày", icon: "🔥", earned: true },
  //     { id: 3, name: "Hoàn thành 100 câu hỏi", icon: "💯", earned: true },
  //     { id: 4, name: "Bậc thầy ngữ pháp", icon: "📚", earned: false },
  //   ],
  //   recentActivity: [
  //     { id: 1, type: "lesson", title: "Ngữ pháp cơ bản - Bài 5", xp: 50, time: "2 giờ trước" },
  //     { id: 2, type: "flashcard", title: "Từ vựng HSK 1", xp: 25, time: "1 ngày trước" },
  //     { id: 3, type: "quiz", title: "Kiểm tra chương 2", xp: 100, time: "2 ngày trước" },
  //   ],
  // })

  // const [dailyMissions] = useState([
  //   { id: 1, title: "Hoàn thành 1 bài học", progress: 1, target: 1, xp: 50, completed: true },
  //   { id: 2, title: "Làm 20 flashcards", progress: 15, target: 20, xp: 30, completed: false },
  //   { id: 3, title: "Tham gia thảo luận", progress: 0, target: 1, xp: 25, completed: false },
  // ])
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/users/me/dashboard`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Lỗi fetch dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  if (!user) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }

  const progressPercentage = (user.xp / user.xpToNextLevel) * 100;
  const lessonProgress = (user.completedLessons / user.totalLessons) * 100;
  const dailyMissions = user?.dailyMissions ?? [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-space-grotesk font-bold text-3xl mb-2">
            Chào mừng trở lại, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Hãy tiếp tục hành trình học tiếng Trung của bạn
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cấp độ hiện tại
              </CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {user.level}</div>
              <div className="mt-2">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {user.xp}/{user.xpToNextLevel} XP
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chuỗi ngày học
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.streak} ngày</div>
              <p className="text-xs text-muted-foreground">
                Tiếp tục phát huy!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiến độ khóa học
              </CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.completedLessons}/{user.totalLessons}
              </div>
              <div className="mt-2">
                <Progress value={lessonProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(lessonProgress)}% hoàn thành
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Huy hiệu đạt được
              </CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.badges?.filter((b: any) => b.earned).length ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">
                /{user.badges?.length ?? 0} huy hiệu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Missions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Nhiệm vụ hàng ngày
                </CardTitle>
                <CardDescription>
                  Hoàn thành để nhận XP và duy trì chuỗi ngày học
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          mission.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {mission.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{mission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {mission.progress}/{mission.target} • +{mission.xp} XP
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={(mission.progress / mission.target) * 100}
                      className="w-20 h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Tiếp tục học tập</CardTitle>
                <CardDescription>
                  Chọn hoạt động bạn muốn thực hiện
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/courses">
                    <Button
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                      variant="outline"
                    >
                      <BookOpen className="h-6 w-6" />
                      <span>Học bài mới</span>
                    </Button>
                  </Link>
                  <Link href="/flashcards">
                    <Button
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                      variant="outline"
                    >
                      <Zap className="h-6 w-6" />
                      <span>Luyện flashcard</span>
                    </Button>
                  </Link>
                  <Link href="/community">
                    <Button
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                      variant="outline"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span>Thảo luận</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {activity.type === "lesson" && (
                            <BookOpen className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === "flashcard" && (
                            <Zap className="h-5 w-5 text-primary" />
                          )}
                          {activity.type === "quiz" && (
                            <Trophy className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">+{activity.xp} XP</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge className="mx-auto">Level {user.level}</Badge>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-transparent" variant="outline">
                  Chỉnh sửa hồ sơ
                </Button>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Huy hiệu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {user.badges.map((badge) => (
                    <div
                      key={badge.badgeId}
                      className={`p-3 rounded-lg border text-center ${
                        badge.earned
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/50 opacity-50"
                      }`}
                    >
                      <div className="text-2xl mb-1">{badge.badge.icon}</div>
                      <p className="text-xs font-medium">{badge.badge.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Thử thách tuần
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="font-medium mb-2">Hoàn thành 50 flashcards</p>
                  <Progress value={60} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    30/50 hoàn thành
                  </p>
                  <Badge className="mt-2">+200 XP</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Bảng xếp hạng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">1</Badge>
                      <span className="text-sm">Trần Thị B</span>
                    </div>
                    <span className="text-sm font-medium">3,250 XP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">2</Badge>
                      <span className="text-sm">Lê Văn C</span>
                    </div>
                    <span className="text-sm font-medium">2,890 XP</span>
                  </div>
                  <div className="flex items-center justify-between bg-primary/5 p-2 rounded">
                    <div className="flex items-center gap-2">
                      <Badge>3</Badge>
                      <span className="text-sm font-medium">Bạn</span>
                    </div>
                    <span className="text-sm font-medium">{user.xp} XP</span>
                  </div>
                </div>
                <Link href="/leaderboard">
                  <Button
                    className="w-full mt-3 bg-transparent"
                    variant="outline"
                    size="sm"
                  >
                    Xem toàn bộ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
