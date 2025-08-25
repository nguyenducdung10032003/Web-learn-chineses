"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, Flame, Star } from "lucide-react"

const leaderboardData = {
  weekly: [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2850,
      streak: 12,
      level: 15,
      change: 2,
    },
    {
      id: 2,
      name: "Trần Văn Bình",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2720,
      streak: 8,
      level: 14,
      change: -1,
    },
    {
      id: 3,
      name: "Lê Thị Cẩm",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2650,
      streak: 15,
      level: 13,
      change: 1,
    },
    {
      id: 4,
      name: "Phạm Đức Duy",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2580,
      streak: 6,
      level: 13,
      change: 0,
    },
    {
      id: 5,
      name: "Hoàng Thị Ế",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2450,
      streak: 9,
      level: 12,
      change: 3,
    },
    {
      id: 6,
      name: "Vũ Văn Phong",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2380,
      streak: 4,
      level: 12,
      change: -2,
    },
    {
      id: 7,
      name: "Đặng Thị Giang",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2320,
      streak: 11,
      level: 11,
      change: 1,
    },
    {
      id: 8,
      name: "Bùi Văn Hải",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2280,
      streak: 7,
      level: 11,
      change: -1,
    },
    {
      id: 9,
      name: "Ngô Thị Lan",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2150,
      streak: 5,
      level: 10,
      change: 0,
    },
    {
      id: 10,
      name: "Lý Văn Minh",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 2100,
      streak: 13,
      level: 10,
      change: 2,
    },
  ],
  monthly: [
    {
      id: 1,
      name: "Trần Văn Bình",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 8950,
      streak: 28,
      level: 18,
      change: 1,
    },
    {
      id: 2,
      name: "Nguyễn Minh Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 8720,
      streak: 25,
      level: 17,
      change: -1,
    },
    {
      id: 3,
      name: "Lê Thị Cẩm",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 8450,
      streak: 30,
      level: 16,
      change: 0,
    },
    {
      id: 4,
      name: "Hoàng Thị Ế",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 7980,
      streak: 22,
      level: 15,
      change: 2,
    },
    {
      id: 5,
      name: "Phạm Đức Duy",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 7850,
      streak: 18,
      level: 15,
      change: -1,
    },
  ],
  allTime: [
    {
      id: 1,
      name: "Lê Thị Cẩm",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 25680,
      streak: 45,
      level: 28,
      change: 0,
    },
    {
      id: 2,
      name: "Nguyễn Minh Anh",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 24950,
      streak: 38,
      level: 27,
      change: 1,
    },
    {
      id: 3,
      name: "Trần Văn Bình",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 24200,
      streak: 42,
      level: 26,
      change: -1,
    },
    {
      id: 4,
      name: "Hoàng Thị Ế",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 22800,
      streak: 35,
      level: 25,
      change: 0,
    },
    {
      id: 5,
      name: "Vũ Văn Phong",
      avatar: "/placeholder.svg?height=40&width=40",
      xp: 21950,
      streak: 28,
      level: 24,
      change: 1,
    },
  ],
}

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />
    default:
      return <span className="text-lg font-bold text-gray-500">#{position}</span>
  }
}

const getRankBadge = (position: number) => {
  switch (position) {
    case 1:
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Vàng</Badge>
    case 2:
      return <Badge className="bg-gray-400 hover:bg-gray-500">Bạc</Badge>
    case 3:
      return <Badge className="bg-amber-600 hover:bg-amber-700">Đồng</Badge>
    default:
      return null
  }
}

const getChangeIndicator = (change: number) => {
  if (change > 0) {
    return <span className="text-green-600 text-sm">↑{change}</span>
  } else if (change < 0) {
    return <span className="text-red-600 text-sm">↓{Math.abs(change)}</span>
  }
  return <span className="text-gray-400 text-sm">-</span>
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("weekly")

  const currentData = leaderboardData[activeTab as keyof typeof leaderboardData]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng xếp hạng</h1>
        <p className="text-gray-600">Cạnh tranh với các học viên khác và leo lên top đầu</p>
      </div>

      {/* User's Current Position */}
      <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Trophy className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Vị trí của bạn</h3>
                <p className="text-sm text-gray-600">Hạng #15 trong tuần này</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">1,850 XP</p>
              <p className="text-sm text-gray-600">Cần 200 XP để lên top 10</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Tuần này</TabsTrigger>
          <TabsTrigger value="monthly">Tháng này</TabsTrigger>
          <TabsTrigger value="allTime">Tất cả thời gian</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {currentData.map((user, index) => (
              <Card key={user.id} className={`${index < 3 ? "ring-2 ring-emerald-200" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          {getRankBadge(index + 1)}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">Level {user.level}</span>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="text-sm text-gray-600">{user.streak} ngày</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-blue-500" />
                        <span className="text-lg font-bold text-gray-900">{user.xp.toLocaleString()} XP</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm text-gray-600">Thay đổi:</span>
                        {getChangeIndicator(user.change)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Competition Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            Cuộc thi tuần này
          </CardTitle>
          <CardDescription>Tham gia cuộc thi và nhận phần thưởng hấp dẫn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-semibold">Hạng 1</p>
              <p className="text-sm text-gray-600">500 XP + Huy hiệu vàng</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold">Hạng 2-3</p>
              <p className="text-sm text-gray-600">300 XP + Huy hiệu bạc</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="font-semibold">Hạng 4-10</p>
              <p className="text-sm text-gray-600">100 XP + Huy hiệu đồng</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
