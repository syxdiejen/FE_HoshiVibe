"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "../../../api/dashboardAPI"
import { getAllOrders, getOrderById, type Order, type OrderDetail } from "../../../api/ordersAPI"
import StatsCards from "./StatsCards"
import RevenueChart from "./RevenueChart"
import TopProductsTable from "./TopProductsTable"

type DashboardSummary = {
  totalProducts: number
  totalOrders: number
  totalUsers: number
}

type ChartDataPoint = {
  month: number
  value: number
}

type TopProduct = {
  id: string
  name: string
  revenue: number
  percentage: number
  image: string
}

export default function StatisticsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate top products from orders
  const calculateTopProducts = async (orders: Order[]): Promise<TopProduct[]> => {
    // Aggregate product data from order details
    const productMap = new Map<string, { name: string; revenue: number; image: string; count: number }>()

    // Process each order
    for (const order of orders) {
      // Only count paid/completed orders
      if (order.status.toLowerCase() === "paid" || order.status.toLowerCase() === "completed") {
        // If orderDetails is empty, try to fetch individual order details
        let orderDetails: OrderDetail[] = order.orderDetails || []
        
        if (orderDetails.length === 0) {
          try {
            const fullOrder = await getOrderById(order.order_Id)
            orderDetails = fullOrder.orderDetails || []
          } catch {
            // Skip if we can't fetch order details
            continue
          }
        }

        // Aggregate product revenue
        orderDetails.forEach((detail) => {
          // Calculate totalPrice if not provided (price * quantity)
          const totalPrice = detail.totalPrice || (detail.price && detail.quantity ? detail.price * detail.quantity : 0)
          
          // Check if we have product information and valid revenue
          if (detail.product_Id && totalPrice > 0) {
            const productId = detail.product_Id
            const existing = productMap.get(productId) || {
              name: detail.productName || `Product ${productId}`,
              revenue: 0,
              image: detail.productImageUrl || "/placeholder.svg",
              count: 0,
            }
            
            productMap.set(productId, {
              ...existing,
              revenue: existing.revenue + totalPrice,
              count: existing.count + (detail.quantity || 1),
            })
          }
        })
      }
    }

    // Convert to array and sort by revenue (descending)
    const products = Array.from(productMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        revenue: data.revenue,
        image: data.image,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4) // Get top 4

    // Calculate total revenue for percentage calculation
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

    // Add percentage and format
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      revenue: product.revenue,
      percentage: totalRevenue > 0 ? Math.round((product.revenue / totalRevenue) * 100) : 0,
      image: product.image,
    }))
  }

  // Calculate monthly income from orders
  const calculateMonthlyIncome = (orders: Order[]): ChartDataPoint[] => {
    // Initialize all 12 months with 0 income
    const monthlyIncome: { [key: number]: number } = {}
    for (let i = 1; i <= 12; i++) {
      monthlyIncome[i] = 0
    }

    // Get current year to filter orders
    const currentYear = new Date().getFullYear()

    // Group orders by month and sum finalPrice
    orders.forEach((order) => {
      // Only count paid/completed orders
      if (order.status.toLowerCase() === "paid" || order.status.toLowerCase() === "completed") {
        const orderDate = new Date(order.orderDate)
        
        // Only include orders from the current year
        if (orderDate.getFullYear() === currentYear) {
          const month = orderDate.getMonth() + 1 // getMonth() returns 0-11, we need 1-12
          monthlyIncome[month] = (monthlyIncome[month] || 0) + order.finalPrice
        }
      }
    })

    // Convert to array format and ensure it's sorted by month
    return Object.entries(monthlyIncome)
      .map(([month, value]) => ({
        month: parseInt(month),
        value: value,
      }))
      .sort((a, b) => a.month - b.month) // Ensure months are sorted 1-12
  }

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch dashboard stats and orders in parallel
        const [statsData, orders] = await Promise.all([
          getDashboardStats(),
          getAllOrders(),
        ])

        if (mounted) {
          setSummary(statsData.summary)
          const monthlyData = calculateMonthlyIncome(orders)
          setChartData(monthlyData)
          
          // Calculate top products from orders
          const topProductsData = await calculateTopProducts(orders)
          setTopProducts(topProductsData)
        }
      } catch {
        if (mounted) {
          setError("Không thể tải thống kê. Vui lòng thử lại sau.")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  // Format top products for display
  const formattedTopProducts: Array<{
    id: string | number
    name: string
    revenue: string
    percentage: number
    image: string
  }> = topProducts.map((product) => ({
    id: product.id,
    name: product.name,
    revenue: formatCurrency(product.revenue),
    percentage: product.percentage,
    image: product.image,
  }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Thống kê</h1>
        </div>

        {/* Stats Cards */}
        <div className="px-6 pb-6">
          <StatsCards summary={summary} loading={loading} />
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>

        {/* Revenue Chart */}
        <div className="px-6 pb-6">
          <RevenueChart chartData={chartData} loading={loading} />
        </div>

        {/* Top Products Table */}
        <div className="px-6 pb-6">
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-sm text-gray-600">Đang tải dữ liệu sản phẩm...</p>
            </div>
          ) : formattedTopProducts.length > 0 ? (
            <TopProductsTable products={formattedTopProducts} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-sm text-gray-600">Không có dữ liệu sản phẩm</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
