"use client"

import { Button, Card, Typography } from "antd"
import { CheckCircle, Package } from "lucide-react"
const { Title, Text } = Typography

export default function SuccessPaymentReturn({
  onNavigateOrders,
  onNavigateHome,
}: {
  onNavigateOrders: () => void
  onNavigateHome: () => void
}) {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const orderId = params.get("orderId") || params.get("vnp_TxnRef") || "—"
  const amountRaw = params.get("amount") || params.get("vnp_Amount") // vnp_Amount có thể là x100
  const amount = amountRaw
    ? (() => {
        const n = Number(amountRaw)
        // nếu BE gửi vnp_Amount x100 thì chia 100; nếu đã là VND thì giữ nguyên
        const guess = n > 0 && n % 100 === 0 ? n / 100 : n
        return guess.toLocaleString("vi-VN") + " VNĐ"
      })()
    : undefined

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Card style={{ maxWidth: 880, width: "100%", borderRadius: 16 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 80, height: 80, background: "#d1fae5", borderRadius: 999,
              margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <CheckCircle size={40} color="#059669" />
          </div>
          <Title level={3} style={{ marginBottom: 0 }}>Đặt hàng thành công!</Title>
          <Text type="secondary">Thanh toán đã được xác nhận</Text>
        </div>

        <Card size="small" style={{ marginBottom: 16, background: "#f9fafb" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text type="secondary">Mã đơn hàng</Text><Text strong>#{orderId}</Text>
          </div>
          {amount && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <Text type="secondary">Tổng tiền</Text>
              <Text strong style={{ color: "#f59e0b", fontSize: 18 }}>{amount}</Text>
            </div>
          )}
        </Card>

        <Card size="small" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
          <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Package size={16} /> Thông tin tiếp theo
          </Title>
          <div style={{ display: "grid", gap: 6 }}>
            <div>• Kiểm tra email / mục Đơn hàng để theo dõi trạng thái.</div>
            <div>• Nhân viên sẽ liên hệ xác nhận giao hàng nếu cần.</div>
          </div>
        </Card>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button block onClick={onNavigateHome}>Tiếp tục mua sắm</Button>
          <Button type="primary" style={{ background: "#000" }} block onClick={onNavigateOrders}>
            Xem đơn hàng
          </Button>
        </div>
      </Card>
    </div>
  )
}
