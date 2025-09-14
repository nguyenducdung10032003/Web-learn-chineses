"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  TrendingUp,
  BookOpen,
  Trophy,
  Calendar,
  Search,
  Download,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Shield,
} from "lucide-react";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  //   // Mock data based on the provided schema
  //   const [stats] = useState({
  //     totalUsers: 1247,
  //     activeUsers: 892,
  //     bannedUsers: 15,
  //     newUsersToday: 23,
  //     totalLessons: 15420,
  //     totalXP: 2847650,
  //     averageLevel: 8.3,
  //     completionRate: 67.2,
  //   })

  //   const [users] = useState([
  //     {
  //       id: 1,
  //       name: "Nguyễn Văn A",
  //       email: "nguyenvana@email.com",
  //       avatar: "/diverse-user-avatars.png",
  //       xp: 2450,
  //       level: 12,
  //       streak: 15,
  //       totalLessons: 45,
  //       completedLessons: 32,
  //       badgesEarned: 8,
  //       role: "student",
  //       status: "active",
  //       provider: "local",
  //       emailVerified: true,
  //       lastActive: "2024-01-15 14:30:00",
  //       lastLogin: "2024-01-15 09:15:00",
  //       createdAt: "2023-06-15 10:00:00",
  //     },
  //     {
  //       id: 2,
  //       name: "Trần Thị B",
  //       email: "tranthib@email.com",
  //       avatar: "/placeholder.svg",
  //       xp: 3250,
  //       level: 15,
  //       streak: 28,
  //       totalLessons: 60,
  //       completedLessons: 55,
  //       badgesEarned: 12,
  //       role: "student",
  //       status: "active",
  //       provider: "google",
  //       emailVerified: true,
  //       lastActive: "2024-01-15 16:45:00",
  //       lastLogin: "2024-01-15 08:30:00",
  //       createdAt: "2023-05-20 14:20:00",
  //     },
  //     {
  //       id: 3,
  //       name: "Lê Văn C",
  //       email: "levanc@email.com",
  //       avatar: "/placeholder.svg",
  //       xp: 890,
  //       level: 6,
  //       streak: 3,
  //       totalLessons: 25,
  //       completedLessons: 12,
  //       badgesEarned: 3,
  //       role: "student",
  //       status: "inactive",
  //       provider: "facebook",
  //       emailVerified: false,
  //       lastActive: "2024-01-10 12:00:00",
  //       lastLogin: "2024-01-08 19:20:00",
  //       createdAt: "2023-12-01 16:30:00",
  //     },
  //     {
  //       id: 4,
  //       name: "Phạm Thị D",
  //       email: "phamthid@email.com",
  //       avatar: "/placeholder.svg",
  //       xp: 150,
  //       level: 2,
  //       streak: 0,
  //       totalLessons: 8,
  //       completedLessons: 2,
  //       badgesEarned: 1,
  //       role: "student",
  //       status: "banned",
  //       provider: "local",
  //       emailVerified: true,
  //       lastActive: "2024-01-05 10:15:00",
  //       lastLogin: "2024-01-05 10:15:00",
  //       createdAt: "2024-01-01 09:00:00",
  //     },
  //   ])
  useEffect(() => {
    const fetchData = async () => {
      const statsRes = await fetch("http://localhost:3001/users/stats");
      const statsData = await statsRes.json();
      setStats(statsData);

      const usersRes = await fetch("http://localhost:3001/users/recent");
      const usersData = await usersRes.json();
      setUsers(usersData);
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Hoạt động
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Không hoạt động
          </Badge>
        );
      case "banned":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Bị cấm
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🔍";
      case "facebook":
        return "📘";
      default:
        return "📧";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-space-grotesk font-bold text-3xl mb-2">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-muted-foreground">
            Quản lý người dùng và thống kê hệ thống ChineseMaster
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng người dùng
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalUsers?.toLocaleString()}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">+{stats.newUsersToday} hôm nay</p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Người dùng hoạt động
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.activeUsers?.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {/* {((stats?.activeUsers / stats?.totalUsers) * 100).toFixed(1)}% tổng số */}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng bài học
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalLessons?.toLocaleString()}
                  </div>
                  {/* <p className="text-xs text-muted-foreground">{stats.completionRate}% hoàn thành</p> */}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng XP</CardTitle>
                  <Trophy className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalXP?.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trung bình level {stats?.averageLevel}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Người dùng mới gần đây</CardTitle>
                  <CardDescription>
                    Danh sách người dùng đăng ký trong 7 ngày qua
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Level {user.level}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.xp} XP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê trạng thái</CardTitle>
                  <CardDescription>
                    Phân bố trạng thái người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Hoạt động</span>
                      </div>
                      <span className="font-medium">{stats?.activeUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Không hoạt động</span>
                      </div>
                      <span className="font-medium">
                        {(
                          (stats?.totalUsers ?? 0) -
                          (stats?.activeUsers ?? 0) -
                          (stats?.bannedUsers ?? 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Bị cấm</span>
                      </div>
                      <span className="font-medium">{stats?.bannedUsers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
                <CardDescription>
                  Tìm kiếm và quản lý tài khoản người dùng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                      <SelectItem value="banned">Bị cấm</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Lọc theo vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả vai trò</SelectItem>
                      <SelectItem value="student">Học viên</SelectItem>
                      <SelectItem value="teacher">Giáo viên</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Excel
                  </Button>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Tiến độ</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Đăng nhập cuối</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="font-medium">
                                  {user.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{getProviderIcon(user.provider)}</span>
                                  <span>{user.email}</span>
                                  {user.emailVerified ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm">
                                  Level {user.level}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {user.xp} XP
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <BookOpen className="h-3 w-3" />
                                <span>
                                  {user.completedLessons}/{user.totalLessons}{" "}
                                  bài
                                </span>
                                <span>•</span>
                                <span>{user.badgesEarned} huy hiệu</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(user.status)}
                              {user.streak > 0 && (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <span>🔥</span>
                                  <span>{user.streak} ngày</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>
                                {new Date(user.lastLogin).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(user.lastLogin).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>
                                {new Date(user.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {user.status !== "banned" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê học tập</CardTitle>
                  <CardDescription>
                    Phân tích hoạt động học tập của người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Tổng bài học hoàn thành</span>
                      </div>
                      <span className="font-bold">
                        {stats?.totalLessons?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Tổng XP kiếm được</span>
                      </div>
                      <span className="font-bold">
                        {stats?.totalXP?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          Tỷ lệ hoàn thành trung bình
                        </span>
                      </div>
                      <span className="font-bold">
                        {stats?.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Level trung bình</span>
                      </div>
                      <span className="font-bold">{stats?.averageLevel}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động theo thời gian</CardTitle>
                  <CardDescription>
                    Thống kê đăng ký và hoạt động người dùng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm">Đăng ký hôm nay</span>
                      </div>
                      {/* <span className="font-bold text-green-600">+{stats.newUsersToday}</span> */}
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Hoạt động trong 24h</span>
                      </div>
                      <span className="font-bold">
                        {Math.floor(stats?.activeUsers * 0.3)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          Thời gian học trung bình
                        </span>
                      </div>
                      <span className="font-bold">45 phút/ngày</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Tỷ lệ xác thực email</span>
                      </div>
                      <span className="font-bold">87.5%</span>
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
