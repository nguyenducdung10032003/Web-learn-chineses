"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Palette, User, Sticker, Crown, Gem, ShoppingCart } from "lucide-react"

const shopItems = {
  themes: [
    {
      id: 1,
      name: "Chủ đề Sakura",
      description: "Giao diện hoa anh đào Nhật Bản",
      price: 500,
      image: "/sakura-theme.png",
      owned: false,
      category: "themes",
    },
    {
      id: 2,
      name: "Chủ đề Đêm tối",
      description: "Giao diện tối bảo vệ mắt",
      price: 300,
      image: "/dark-theme-abstract.png",
      owned: true,
      category: "themes",
    },
    {
      id: 3,
      name: "Chủ đề Biển xanh",
      description: "Giao diện màu xanh biển tươi mát",
      price: 400,
      image: "/ocean-theme.png",
      owned: false,
      category: "themes",
    },
  ],
  avatars: [
    {
      id: 4,
      name: "Avatar Panda",
      description: "Hình đại diện gấu trúc dễ thương",
      price: 200,
      image: "/panda-avatar.png",
      owned: false,
      category: "avatars",
    },
    {
      id: 5,
      name: "Avatar Rồng",
      description: "Hình đại diện rồng Trung Quốc",
      price: 350,
      image: "/dragon-avatar.png",
      owned: false,
      category: "avatars",
    },
    {
      id: 6,
      name: "Avatar Học giả",
      description: "Hình đại diện nhà học giả cổ điển",
      price: 250,
      image: "/scholar-avatar.png",
      owned: true,
      category: "avatars",
    },
  ],
  stickers: [
    {
      id: 7,
      name: "Bộ sticker Cảm xúc",
      description: "20 sticker biểu cảm dễ thương",
      price: 150,
      image: "/placeholder-25f23.png",
      owned: false,
      category: "stickers",
    },
    {
      id: 8,
      name: "Bộ sticker Động vật",
      description: "15 sticker động vật Trung Quốc",
      price: 180,
      image: "/assorted-animal-stickers.png",
      owned: false,
      category: "stickers",
    },
    {
      id: 9,
      name: "Bộ sticker Lễ hội",
      description: "25 sticker lễ hội truyền thống",
      price: 220,
      image: "/placeholder-6y9wq.png",
      owned: false,
      category: "stickers",
    },
  ],
  premium: [
    {
      id: 10,
      name: "Gói Premium 1 tháng",
      description: "Truy cập không giới hạn tất cả tính năng",
      price: 1000,
      image: "/premium-package.png",
      owned: false,
      category: "premium",
      features: ["Không quảng cáo", "Bài học nâng cao", "Ưu tiên hỗ trợ"],
    },
    {
      id: 11,
      name: "Boost XP x2",
      description: "Nhận gấp đôi XP trong 7 ngày",
      price: 300,
      image: "/xp-boost.png",
      owned: false,
      category: "premium",
    },
  ],
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("themes")
  const [userXP] = useState(2450) // Mock user XP

  const currentItems = shopItems[activeTab as keyof typeof shopItems]

  const handlePurchase = (item: any) => {
    if (userXP >= item.price && !item.owned) {
      // Handle purchase logic here
      console.log(`Purchasing ${item.name} for ${item.price} XP`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cửa hàng</h1>
        <p className="text-gray-600">Sử dụng XP để mua chủ đề, avatar và nhiều vật phẩm khác</p>
      </div>

      {/* User XP Display */}
      <Card className="mb-8 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Star className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">XP của bạn</h3>
                <p className="text-sm text-gray-600">Sử dụng để mua vật phẩm</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-600">{userXP.toLocaleString()}</p>
              <p className="text-sm text-gray-600">XP có sẵn</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shop Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Chủ đề
          </TabsTrigger>
          <TabsTrigger value="avatars" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Avatar
          </TabsTrigger>
          <TabsTrigger value="stickers" className="flex items-center gap-2">
            <Sticker className="h-4 w-4" />
            Sticker
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Premium
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <Card key={item.id} className={`${item.owned ? "ring-2 ring-emerald-500" : ""}`}>
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription className="mt-1">{item.description}</CardDescription>
                    </div>
                    {item.owned && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        Đã sở hữu
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.category === "premium" && "features" in item && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Tính năng:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Gem className="h-3 w-3 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-500" />
                      <span className="font-bold text-lg">{item.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">XP</span>
                    </div>
                    <Button
                      onClick={() => handlePurchase(item)}
                      disabled={item.owned || userXP < item.price}
                      className={item.owned ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                    >
                      {item.owned ? (
                        "Đã sở hữu"
                      ) : userXP < item.price ? (
                        "Không đủ XP"
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Mua
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Special Offers */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Ưu đãi đặc biệt
          </CardTitle>
          <CardDescription>Các gói ưu đãi có thời hạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border-2 border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Gói Khởi đầu</h3>
              <p className="text-sm text-gray-600 mb-3">Avatar + Chủ đề + 200 XP bonus</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-purple-600">800 XP</span>
                  <span className="text-sm text-gray-500 line-through ml-2">1000 XP</span>
                </div>
                <Badge className="bg-purple-500 hover:bg-purple-600">Tiết kiệm 20%</Badge>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border-2 border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Gói Cao cấp</h3>
              <p className="text-sm text-gray-600 mb-3">Tất cả vật phẩm + Premium 1 tháng</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-orange-600">2000 XP</span>
                  <span className="text-sm text-gray-500 line-through ml-2">2500 XP</span>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-600">Tiết kiệm 20%</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
