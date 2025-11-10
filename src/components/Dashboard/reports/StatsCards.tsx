"use client"

import { Package, Users, TrendingUp } from "lucide-react"

type DashboardSummary = {
  totalProducts: number
  totalOrders: number
  totalUsers: number
}

type Props = {
  summary: DashboardSummary | null
  loading: boolean
}

export default function StatsCards({ summary, loading }: Props) {
  const statsCards = [
    {
      id: "products",
      label: "Tổng số sản phẩm",
      value: summary?.totalProducts ?? 0,
      suffix: "sản phẩm",
      Icon: Package,
    },
    {
      id: "orders",
      label: "Tổng số đơn hàng",
      value: summary?.totalOrders ?? 0,
      suffix: "đơn",
      Icon: TrendingUp,
    },
    {
      id: "users",
      label: "Tổng số khách hàng",
      value: summary?.totalUsers ?? 0,
      suffix: "người",
      Icon: Users,
    },
  ]

  const formatValue = (value: number, suffix: string) =>
    loading ? "Đang tải..." : `${value.toLocaleString("vi-VN")} ${suffix}`

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {statsCards.map((card) => {
        const Icon = card.Icon
        return (
          <div key={card.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">{card.label}</p>
                <p className="text-3xl font-semibold text-gray-800 mb-1">
                  {formatValue(card.value, card.suffix)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

