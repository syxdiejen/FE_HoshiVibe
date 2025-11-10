"use client"

import { Button, Card, Typography, Alert } from "antd"
const { Title, Text } = Typography

export default function FailPaymentReturn({ onBackToCart }: { onBackToCart: () => void }) {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const rsp = params.get("vnp_ResponseCode")
  const msg =
    params.get("message") ||
    (rsp ? `Thanh toán không thành công (mã ${rsp}). Vui lòng thử lại.` : "Thanh toán không thành công. Vui lòng thử lại.")

  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Card style={{ maxWidth: 720, width: "100%", borderRadius: 16 }}>
        <Title level={2} style={{ marginBottom: 8 }}>Thanh toán thất bại</Title>
        <Alert type="error" showIcon message={msg} />
        <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
          Nếu tiền đã trừ, vui lòng liên hệ hỗ trợ để được kiểm tra giao dịch.
        </Text>
        <Button style={{ marginTop: 16 }} block onClick={onBackToCart}>
          Quay lại giỏ hàng
        </Button>
      </Card>
    </div>
  )
}
