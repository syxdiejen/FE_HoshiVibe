import { api } from "./axios"

export type DashboardStatsResponse = {
  message: string
  summary: {
    totalProducts: number
    totalOrders: number
    totalUsers: number
  }
}

export async function getDashboardStats() {
  const res = await api.get<DashboardStatsResponse>("/DashBoard/stats")
  return res.data
}


