import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Trophy, Zap, Star, Play } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="secondary">
            <Star className="w-4 h-4 mr-1" />
            Ứng dụng học tiếng Trung #1 tại Việt Nam
          </Badge>
          <h1 className="font-space-grotesk font-bold text-4xl md:text-6xl mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Học Tiếng Trung
            <br />
            <span className="text-primary">Hiệu Quả & Thú Vị</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Khám phá phương pháp học tiếng Trung độc đáo với gamification, flashcard thông minh và cộng đồng học tập sôi
            động
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu học ngay
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Xem demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space-grotesk font-bold text-3xl md:text-4xl mb-4">Tại sao chọn ChineseMaster?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi kết hợp công nghệ hiện đại với phương pháp giảng dạy hiệu quả
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-space-grotesk">Học tập có hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Khóa học ngữ pháp từ cơ bản đến nâng cao với bài tập tương tác phong phú
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-space-grotesk">Flashcard thông minh</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Hệ thống lặp lại ngắt quãng (SRS) giúp ghi nhớ từ vựng lâu hơn và hiệu quả hơn
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-space-grotesk">Gamification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Điểm XP, huy hiệu, bảng xếp hạng và nhiều tính năng game hóa thú vị</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-space-grotesk">Cộng đồng học tập</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Diễn đàn thảo luận, thử thách nhóm và chatbot AI hỗ trợ 24/7</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="font-space-grotesk text-2xl md:text-3xl">
                Sẵn sàng bắt đầu hành trình học tiếng Trung?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Tham gia cùng hàng nghìn học viên đã thành công với ChineseMaster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Đăng ký miễn phí ngay
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">中</span>
                </div>
                <span className="font-space-grotesk font-bold text-xl">ChineseMaster</span>
              </div>
              <p className="text-muted-foreground">Ứng dụng học tiếng Trung hiệu quả nhất cho người Việt</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground transition-colors">
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link href="/flashcards" className="hover:text-foreground transition-colors">
                    Flashcard
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground transition-colors">
                    Cộng đồng
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Trung tâm trợ giúp
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Công ty</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Về chúng tôi
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Chính sách bảo mật
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Điều khoản sử dụng
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 ChineseMaster. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
