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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Play,
  Plus,
  Search,
  Clock,
  Star,
  Zap,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
} from "lucide-react";
import { BASE_URL } from "@/constants";
import { format } from "date-fns";

export default function FlashcardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [flashcardDecks, setFlashcardDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studyStats, setStudyStats] = useState<any>(null);
  // const flashcardDecks = [
  //   {
  //     id: 1,
  //     title: "HSK 1 - Từ vựng cơ bản",
  //     description: "150 từ vựng thiết yếu cho người mới bắt đầu",
  //     totalCards: 150,
  //     studiedCards: 89,
  //     masteredCards: 45,
  //     level: "Sơ cấp",
  //     category: "HSK",
  //     lastStudied: "2 giờ trước",
  //     streak: 5,
  //     image: "/hsk1-vocabulary.png",
  //     color: "bg-green-500",
  //     isPersonal: false,
  //   },
  //   {
  //     id: 2,
  //     title: "HSK 2 - Từ vựng nâng cao",
  //     description: "300 từ vựng cho trình độ sơ trung cấp",
  //     totalCards: 300,
  //     studiedCards: 120,
  //     masteredCards: 67,
  //     level: "Trung cấp",
  //     category: "HSK",
  //     lastStudied: "1 ngày trước",
  //     streak: 3,
  //     image: "/hsk2-vocabulary.png",
  //     color: "bg-blue-500",
  //     isPersonal: false,
  //   },
  //   {
  //     id: 3,
  //     title: "Từ vựng hàng ngày",
  //     description: "Các từ thường dùng trong cuộc sống",
  //     totalCards: 200,
  //     studiedCards: 156,
  //     masteredCards: 98,
  //     level: "Sơ cấp",
  //     category: "Thường dùng",
  //     lastStudied: "3 giờ trước",
  //     streak: 12,
  //     image: "/daily-vocabulary.png",
  //     color: "bg-orange-500",
  //     isPersonal: false,
  //   },
  //   {
  //     id: 4,
  //     title: "Bộ từ vựng của tôi",
  //     description: "Từ vựng cá nhân hóa do bạn tạo",
  //     totalCards: 45,
  //     studiedCards: 32,
  //     masteredCards: 18,
  //     level: "Tùy chỉnh",
  //     category: "Cá nhân",
  //     lastStudied: "5 giờ trước",
  //     streak: 2,
  //     image: "/personal-deck.png",
  //     color: "bg-purple-500",
  //     isPersonal: true,
  //   },
  // ]

  // const studyStats = {
  //   totalCards: 695,
  //   studiedToday: 25,
  //   streak: 12,
  //   accuracy: 78,
  //   timeSpent: 45, // minutes
  // }

  // const recentActivity = [
  //   { deck: "HSK 1 - Từ vựng cơ bản", cards: 20, accuracy: 85, xp: 50, time: "2 giờ trước" },
  //   { deck: "Từ vựng hàng ngày", cards: 15, accuracy: 92, xp: 40, time: "1 ngày trước" },
  //   { deck: "HSK 2 - Từ vựng nâng cao", cards: 25, accuracy: 72, xp: 60, time: "2 ngày trước" },
  // ]
  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/decks`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        setFlashcardDecks(data);
      } catch (error) {
        console.error("Lỗi fetch decks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
    
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
      setStudyStats(data?.user?.studyStats ?? null);
    } catch (error) {
      console.error("Lỗi fetch dashboard:", error);
      setStudyStats(null);
    }
  };
  fetchDashboard();
  }, []);
  const filteredDecks = flashcardDecks.filter((deck) =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-space-grotesk font-bold text-3xl mb-2">
              Flashcards
            </h1>
            <p className="text-muted-foreground">
              Học từ vựng hiệu quả với hệ thống lặp lại ngắt quãng
            </p>
          </div>
          <Link href="/flashcards/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bộ thẻ mới
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số thẻ</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats?.totalCards}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Học hôm nay</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studyStats?.studiedToday}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chuỗi ngày</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats?.streak}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Độ chính xác
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats?.accuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Thời gian học
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyStats?.timeSpent}p</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="decks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="decks">Bộ thẻ</TabsTrigger>
            <TabsTrigger value="quick-study">Học nhanh</TabsTrigger>
            <TabsTrigger value="statistics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="decks" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bộ thẻ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Flashcard Decks */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck) => {
                const userDeck = deck.userDecks?.[0];
                return (
                  <Card
                    key={deck.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={`${BASE_URL}${deck.image}`}
                        alt={deck.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={deck.color}>{deck.level}</Badge>
                      </div>
                      {/* {deck.isPersonal && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary">Cá nhân</Badge>
                        </div>
                      )} */}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{deck.title}</CardTitle>
                      <CardDescription>{deck.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Tiến độ học</span>
                          {userDeck ? (
                            <span>
                              {Math.round(
                                (userDeck.studiedCards / deck.totalCards) * 100
                              )}
                              %
                            </span>
                          ) : (
                            <span>Chưa có tiến độ</span>
                          )}
                        </div>
                        <Progress
                          value={
                            userDeck
                              ? (userDeck.studiedCards / deck.totalCards) * 100
                              : 0
                          }
                        />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {userDeck ? (
                            <>
                              <span>
                                {userDeck.studiedCards}/{deck.totalCards} thẻ
                              </span>
                              <span>{userDeck.masteredCards} thành thạo</span>
                            </>
                          ) : (
                            <span>Chưa học</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {userDeck && userDeck.lastStudied ? (
                            <span>
                              Học lần cuối:{" "}
                              {format(
                                new Date(userDeck.lastStudied),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </span>
                          ) : (
                            <p>Chưa học </p>
                          )}

                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {userDeck ? (
                              <span>{userDeck.streak} ngày</span>
                            ) : (
                              <span>Chưa có streak</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/flashcards/${deck.id}/study`}
                            className="flex-1"
                          >
                            <Button className="w-full">
                              <Play className="h-4 w-4 mr-2" />
                              Học ngay
                            </Button>
                          </Link>
                          {/* <Link href={`/flashcards/${deck.id}/quick`}>
                            <Button variant="outline">
                              <Zap className="h-4 w-4" />
                            </Button>
                          </Link> */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="quick-study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Học nhanh 5 phút
                </CardTitle>
                <CardDescription>
                  Luyện tập nhanh với 10-20 thẻ ngẫu nhiên
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Ôn tập cần thiết</h3>
                        <p className="text-sm text-muted-foreground">
                          15 thẻ cần ôn lại
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Thẻ mới</h3>
                        <p className="text-sm text-muted-foreground">
                          20 thẻ chưa học
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Thẻ khó</h3>
                        <p className="text-sm text-muted-foreground">
                          8 thẻ cần luyện thêm
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">Ngẫu nhiên</h3>
                        <p className="text-sm text-muted-foreground">
                          Trộn tất cả bộ thẻ
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Hoạt động gần đây
                  </CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{activity.deck}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.cards} thẻ • {activity.accuracy}% chính
                            xác • {activity.time}
                          </p>
                        </div>
                        <Badge variant="secondary">+{activity.xp} XP</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent> */}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê tổng quan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Thẻ đã thành thạo</span>
                      <div className="flex items-center gap-2">
                        <Progress value={65} className="w-20" />
                        <span className="text-sm font-medium">228/695</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Thẻ đang học</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20" />
                        <span className="text-sm font-medium">169/695</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Thẻ chưa học</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-20" />
                        <span className="text-sm font-medium">298/695</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
