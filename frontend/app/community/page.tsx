"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Users,
  Trophy,
  ThumbsUp,
  Eye,
  Clock,
  Search,
  Plus,
  Star,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
} from "lucide-react"

const forumPosts = [
  {
    id: 1,
    title: "Cách phân biệt 的, 得, 地 trong tiếng Trung?",
    content: "Mình luôn bị nhầm lẫn giữa ba từ này. Có ai có mẹo gì để nhớ không?",
    author: "Nguyễn Minh Anh",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Ngữ pháp",
    replies: 12,
    likes: 25,
    views: 156,
    timeAgo: "2 giờ trước",
    tags: ["ngữ pháp", "từ loại"],
    solved: false,
  },
  {
    id: 2,
    title: "Chia sẻ phương pháp học từ vựng hiệu quả",
    content: "Mình đã thử nhiều cách và tìm được phương pháp phù hợp. Chia sẻ cho mọi người...",
    author: "Trần Văn Bình",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Mẹo học tập",
    replies: 8,
    likes: 34,
    views: 203,
    timeAgo: "4 giờ trước",
    tags: ["từ vựng", "phương pháp"],
    solved: false,
  },
  {
    id: 3,
    title: "Tại sao 我是学生 không cần 的?",
    content: "Trong câu này tại sao không dùng 我是的学生? Ai giải thích giúp mình với!",
    author: "Lê Thị Cẩm",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Ngữ pháp",
    replies: 15,
    likes: 18,
    views: 89,
    timeAgo: "6 giờ trước",
    tags: ["ngữ pháp", "cấu trúc câu"],
    solved: true,
  },
  {
    id: 4,
    title: "Tài liệu luyện thi HSK 4 miễn phí",
    content: "Mình có tổng hợp một số tài liệu hay cho HSK 4, chia sẻ cho mọi người...",
    author: "Phạm Đức Duy",
    avatar: "/placeholder.svg?height=40&width=40",
    category: "Tài liệu",
    replies: 22,
    likes: 67,
    views: 445,
    timeAgo: "1 ngày trước",
    tags: ["HSK", "tài liệu", "thi cử"],
    solved: false,
  },
]

const groupChallenges = [
  {
    id: 1,
    title: "Thử thách từ vựng HSK 3",
    description: "Học 100 từ vựng HSK 3 trong 7 ngày",
    participants: 45,
    maxParticipants: 50,
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    reward: "200 XP + Huy hiệu",
    difficulty: "Trung bình",
    category: "Từ vựng",
    status: "Đang diễn ra",
    joined: false,
  },
  {
    id: 2,
    title: "Cuộc thi ngữ pháp cơ bản",
    description: "Hoàn thành 50 câu hỏi ngữ pháp cơ bản",
    participants: 32,
    maxParticipants: 40,
    startDate: "2024-01-20",
    endDate: "2024-01-27",
    reward: "300 XP + Chủ đề đặc biệt",
    difficulty: "Dễ",
    category: "Ngữ pháp",
    status: "Sắp bắt đầu",
    joined: true,
  },
  {
    id: 3,
    title: "Marathon flashcard",
    description: "Hoàn thành 500 flashcard trong 14 ngày",
    participants: 28,
    maxParticipants: 30,
    startDate: "2024-01-10",
    endDate: "2024-01-24",
    reward: "500 XP + Avatar đặc biệt",
    difficulty: "Khó",
    category: "Flashcard",
    status: "Đang diễn ra",
    joined: false,
  },
]

const categories = [
  { id: "all", name: "Tất cả", icon: MessageSquare, count: 156 },
  { id: "grammar", name: "Ngữ pháp", icon: BookOpen, count: 45 },
  { id: "vocabulary", name: "Từ vựng", icon: Star, count: 38 },
  { id: "tips", name: "Mẹo học tập", icon: Lightbulb, count: 29 },
  { id: "resources", name: "Tài liệu", icon: HelpCircle, count: 22 },
  { id: "questions", name: "Hỏi đáp", icon: Target, count: 22 },
]

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("forum")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "grammar" && post.category === "Ngữ pháp") ||
      (selectedCategory === "vocabulary" && post.category === "Từ vựng") ||
      (selectedCategory === "tips" && post.category === "Mẹo học tập") ||
      (selectedCategory === "resources" && post.category === "Tài liệu") ||
      (selectedCategory === "questions" && post.category === "Hỏi đáp")

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const joinChallenge = (challengeId: number) => {
    console.log(`Joining challenge ${challengeId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cộng đồng</h1>
        <p className="text-gray-600">Kết nối với các học viên khác, chia sẻ kinh nghiệm và cùng nhau tiến bộ</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-gray-600">Thành viên</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">456</p>
                <p className="text-sm text-gray-600">Bài viết</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Thử thách</p>
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
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-gray-600">Hoạt động hôm nay</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Diễn đàn
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Thử thách nhóm
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Danh mục</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${
                            selectedCategory === category.id ? "bg-emerald-50 border-r-2 border-emerald-500" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Forum Content */}
            <div className="lg:col-span-3">
              {/* Search and New Post */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={() => setShowNewPost(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Đăng bài
                </Button>
              </div>

              {/* New Post Form */}
              {showNewPost && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Tạo bài viết mới</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Tiêu đề bài viết..." />
                    <Textarea placeholder="Nội dung bài viết..." rows={4} />
                    <div className="flex gap-2">
                      <Button>Đăng bài</Button>
                      <Button variant="outline" onClick={() => setShowNewPost(false)}>
                        Hủy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Forum Posts */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.author} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer">
                                {post.title}
                                {post.solved && (
                                  <Badge className="ml-2 bg-emerald-500 hover:bg-emerald-600">Đã giải quyết</Badge>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="font-medium text-gray-700">{post.author}</span>
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.timeAgo}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.replies} trả lời
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {post.likes} thích
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.views} lượt xem
                              </span>
                            </div>

                            <div className="flex gap-1">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupChallenges.map((challenge) => (
              <Card key={challenge.id} className={`${challenge.joined ? "ring-2 ring-emerald-500" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription className="mt-1">{challenge.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        challenge.status === "Đang diễn ra"
                          ? "default"
                          : challenge.status === "Sắp bắt đầu"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {challenge.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tham gia:</span>
                      <span className="font-medium">
                        {challenge.participants}/{challenge.maxParticipants} người
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(challenge.participants / challenge.maxParticipants) * 100}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Bắt đầu:</span>
                        <p className="font-medium">{challenge.startDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Kết thúc:</span>
                        <p className="font-medium">{challenge.endDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Độ khó:</span>
                        <Badge
                          variant={
                            challenge.difficulty === "Dễ"
                              ? "secondary"
                              : challenge.difficulty === "Trung bình"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Danh mục:</span>
                        <span className="font-medium">{challenge.category}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-sm font-medium text-emerald-800">Phần thưởng</p>
                      <p className="text-sm text-emerald-600">{challenge.reward}</p>
                    </div>

                    <Button
                      onClick={() => joinChallenge(challenge.id)}
                      disabled={challenge.joined || challenge.participants >= challenge.maxParticipants}
                      className={`w-full ${challenge.joined ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                    >
                      {challenge.joined
                        ? "Đã tham gia"
                        : challenge.participants >= challenge.maxParticipants
                          ? "Đã đầy"
                          : "Tham gia"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Quy tắc cộng đồng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Diễn đàn</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tôn trọng ý kiến của người khác</li>
                <li>• Sử dụng ngôn ngữ lịch sự, tích cực</li>
                <li>• Tìm kiếm trước khi đặt câu hỏi mới</li>
                <li>• Chia sẻ kiến thức và kinh nghiệm</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Thử thách nhóm</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tham gia đúng thời gian quy định</li>
                <li>• Không gian lận hoặc sử dụng công cụ hỗ trợ</li>
                <li>• Khuyến khích và hỗ trợ thành viên khác</li>
                <li>• Báo cáo vi phạm cho quản trị viên</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
