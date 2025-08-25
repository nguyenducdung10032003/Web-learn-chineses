"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Star, Target, BookOpen, Zap, Calendar, Gift } from "lucide-react"

const missions = {
  daily: [
    {
      id: 1,
      title: "Học 5 từ vựng mới",
      description: "Hoàn thành 5 flashcard từ vựng",
      progress: 3,
      maxProgress: 5,
      xpReward: 50,
      completed: false,
      icon: BookOpen,
      timeLeft: "18:30:45",
    },
    {
      id: 2,
      title: "Hoàn thành 1 bài học",
      description: "Học xong một bài trong khóa học",
      progress: 1,
      maxProgress: 1,
      xpReward: 100,
      completed: true,
      icon: Target,
      timeLeft: "18:30:45",
    },
    {
      id: 3,
      title: "Chơi 3 mini game",
      description: "Tham gia các trò chơi tốc độ",
      progress: 1,
      maxProgress: 3,
      xpReward: 75,
      completed: false,
      icon: Zap,
      timeLeft: "18:30:45",
    },
  ],
  weekly: [
    {
      id: 4,
      title: "Chuỗi học 7 ngày",
      description: "Học liên tục trong 7 ngày",
      progress: 5,
      maxProgress: 7,
      xpReward: 300,
      completed: false,
      icon: Calendar,
      timeLeft: "2 ngày 14:30:45",
    },
    {
      id: 5,
      title: "Hoàn thành 10 bài tập",
      description: "Làm xong 10 bài tập ngữ pháp",
      progress: 7,
      maxProgress: 10,
      xpReward: 200,
      completed: false,
      icon: BookOpen,
      timeLeft: "2 ngày 14:30:45",
    },
    {
      id: 6,
      title: "Đạt 1000 điểm trong game",
      description: "Tích lũy điểm từ các mini game",
      progress: 750,
      maxProgress: 1000,
      xpReward: 250,
      completed: false,
      icon: Star,
      timeLeft: "2 ngày 14:30:45",
    },
  ],
  special: [
    {
      id: 7,
      title: "Thử thách Tết Nguyên Đán",
      description: "Học 50 từ vựng về Tết trong tháng này",
      progress: 23,
      maxProgress: 50,
      xpReward: 500,
      completed: false,
      icon: Gift,
      timeLeft: "15 ngày",
      special: true,
    },
    {
      id: 8,
      title: "Bậc thầy ngữ pháp",
      description: "Hoàn thành tất cả bài tập ngữ pháp cấp độ trung bình",
      progress: 12,
      maxProgress: 20,
      xpReward: 800,
      completed: false,
      icon: Target,
      timeLeft: "30 ngày",
      special: true,
    },
  ],
}

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState("daily")

  const currentMissions = missions[activeTab as keyof typeof missions]

  const claimReward = (missionId: number) => {
    console.log(`Claiming reward for mission ${missionId}`)
    // Handle reward claiming logic here
  }

  const getTotalProgress = (missions: any[]) => {
    const completed = missions.filter((m) => m.completed).length
    return Math.round((completed / missions.length) * 100)
  }

  const getTotalXP = (missions: any[]) => {
    return missions.filter((m) => m.completed).reduce((sum, m) => sum + m.xpReward, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nhiệm vụ</h1>
        <p className="text-gray-600">Hoàn thành nhiệm vụ để nhận XP và phần thưởng</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getTotalProgress(missions.daily)}%</p>
                <p className="text-sm text-gray-600">Nhiệm vụ hàng ngày</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Calendar className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getTotalProgress(missions.weekly)}%</p>
                <p className="text-sm text-gray-600">Nhiệm vụ hàng tuần</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {getTotalXP(missions.daily) + getTotalXP(missions.weekly)}
                </p>
                <p className="text-sm text-gray-600">XP kiếm được hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hàng ngày
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Hàng tuần
          </TabsTrigger>
          <TabsTrigger value="special" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Đặc biệt
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {currentMissions.map((mission) => {
              const Icon = mission.icon
              const progressPercentage = (mission.progress / mission.maxProgress) * 100

              return (
                <Card
                  key={mission.id}
                  className={`${mission.completed ? "ring-2 ring-emerald-500 bg-emerald-50" : ""} ${mission.special ? "ring-2 ring-purple-500 bg-gradient-to-r from-purple-50 to-pink-50" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-3 rounded-lg ${mission.completed ? "bg-emerald-100" : mission.special ? "bg-purple-100" : "bg-gray-100"}`}
                        >
                          <Icon
                            className={`h-6 w-6 ${mission.completed ? "text-emerald-600" : mission.special ? "text-purple-600" : "text-gray-600"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                            {mission.completed && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                            {mission.special && <Badge className="bg-purple-500 hover:bg-purple-600">Đặc biệt</Badge>}
                          </div>
                          <p className="text-gray-600 mb-4">{mission.description}</p>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tiến độ</span>
                              <span className="font-medium">
                                {mission.progress}/{mission.maxProgress}
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">+{mission.xpReward} XP</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{mission.timeLeft}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => claimReward(mission.id)}
                              disabled={!mission.completed}
                              className={mission.completed ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                            >
                              {mission.completed ? "Nhận thưởng" : `${Math.round(progressPercentage)}%`}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Mission Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Mẹo hoàn thành nhiệm vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Nhiệm vụ hàng ngày</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hoàn thành vào buổi sáng để có động lực cả ngày</li>
                <li>• Kết hợp với thời gian nghỉ giải lao</li>
                <li>• Đặt nhắc nhở để không quên</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Nhiệm vụ hàng tuần</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Chia nhỏ thành mục tiêu hàng ngày</li>
                <li>• Theo dõi tiến độ thường xuyên</li>
                <li>• Tận dụng cuối tuần để bù đắp</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
