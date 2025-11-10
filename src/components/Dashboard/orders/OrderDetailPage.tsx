"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { getOrderById, type Order } from "../../../api/ordersAPI"

type Props = {
  orderId: string
  onBack?: () => void
}

export default function OrderDetailPage({ orderId, onBack }: Props) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (err: any) {
        console.error("Error fetching order:", err)
        setError(err?.response?.data?.message || "Không thể tải chi tiết đơn hàng")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " VND"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case "completed":
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-sm font-medium">
            {statusLower === "paid" ? "Đã thanh toán" : "Hoàn thành"} <CheckCircle2 className="w-4 h-4" />
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-4">{error || "Không tìm thấy đơn hàng"}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Quay lại danh sách đơn hàng
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-6 max-w-5xl">
          {/* Back */}
          <button
            onClick={onBack}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← Quay lại danh sách đơn hàng
          </button>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Chi tiết đơn hàng: #{order.order_Id}
            </h1>
            <p className="text-sm text-gray-600 mb-4">{formatDate(order.orderDate)}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Address & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipping */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Địa chỉ giao hàng</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{order.shippingAddress || "N/A"}</p>
                <p className="pt-2">
                  <span className="text-gray-600">Điện thoại: </span>
                  <a href={`tel:${order.phoneNumber}`} className="text-blue-600 hover:underline">
                    {order.phoneNumber}
                  </a>
                </p>
                <p className="pt-2">
                  <span className="text-gray-600">User ID: </span>
                  <span className="text-gray-800">{order.user_Id}</span>
                </p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng giá:</span>
                  <span className="text-gray-800 font-medium">{formatCurrency(order.totalPrice)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="text-red-600">-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                {order.voucher_Id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giảm giá:</span>
                    <span className="text-gray-800">{order.voucher_Id}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-800 font-semibold">Thành tiền:</span>
                  <span className="text-gray-800 font-semibold text-lg">{formatCurrency(order.finalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {order.orderDetails && order.orderDetails.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Các sản phẩm</th>
                        <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Số lượng</th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Giá gốc</th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Tổng số tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {order.orderDetails.map((detail, index) => (
                        <tr key={detail.orderDetail_Id || index}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {detail.productImageUrl && (
                                <img
                                  src={detail.productImageUrl}
                                  alt={detail.productName || "Product"}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="text-sm text-gray-800">
                                {detail.productName || `Product ${detail.product_Id || index + 1}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm text-gray-800">{detail.quantity || 0}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm text-gray-800">
                              {detail.price ? formatCurrency(detail.price) : "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm text-gray-800">
                              {detail.totalPrice ? formatCurrency(detail.totalPrice) : "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center justify-between w-64">
                      <span className="text-sm text-gray-700">Tổng giá:</span>
                      <span className="text-sm text-gray-800">{formatCurrency(order.totalPrice)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex items-center justify-between w-64">
                        <span className="text-sm text-gray-700">Giảm giá:</span>
                        <span className="text-sm text-red-600">-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between w-64 pt-2 border-t border-gray-200">
                      <span className="text-sm font-semibold text-gray-800">Tổng cộng:</span>
                      <span className="text-sm font-semibold text-gray-800">{formatCurrency(order.finalPrice)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-600">Không có sản phẩm nào trong đơn hàng này</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
