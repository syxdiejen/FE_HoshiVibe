"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Filter,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react"
import { Button, Checkbox } from "antd"
import { getAllOrders, type Order } from "../../../api/ordersAPI"

export default function OrderManagementPage({
  onOpenDetail,
}: {
  onOpenDetail?: (orderId: string) => void
}) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getAllOrders()
        setOrders(data)
      } catch (err: any) {
        console.error("Error fetching orders:", err)
        setError(err?.response?.data?.message || "Không thể tải danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {statusLower === "paid" ? "Đã thanh toán" : "Hoàn thành"}
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Đang chờ
          </span>
        )
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Xử lý
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {status}
          </span>
        )
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.order_Id))
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Đơn hàng</h1>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-end gap-2">
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
              <Plus className="w-4 h-4 mr-1" />
              Mới
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
              <Filter className="w-4 h-4 mr-1" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="px-6 pb-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Đang tải danh sách đơn hàng...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-600">Không có đơn hàng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-12">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={toggleAllOrders}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đặt hàng</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gửi đến</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                      <th className="px-4 py-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.order_Id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <Checkbox
                            checked={selectedOrders.includes(order.order_Id)}
                            onChange={() => toggleOrderSelection(order.order_Id)}
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <button
                              className="text-sm font-medium text-blue-600 hover:underline"
                              onClick={() => onOpenDetail?.(order.order_Id)}
                              title="Xem chi tiết đơn hàng"
                            >
                              #{order.order_Id}
                            </button>
                            <p className="text-xs text-gray-500">User ID: {order.user_Id.substring(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-800">{formatDate(order.orderDate)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-800">{order.shippingAddress}</p>
                            <p className="text-xs text-gray-500 mt-1">Phone: {order.phoneNumber}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-800">{formatCurrency(order.finalPrice)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => onOpenDetail?.(order.order_Id)}
                            title="Xem chi tiết"
                          >
                            <MoreHorizontal className="w-5 h-5 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">2</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">3</button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
