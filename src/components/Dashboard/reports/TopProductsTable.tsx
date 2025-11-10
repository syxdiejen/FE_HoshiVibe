"use client"

import { ChevronDown } from "lucide-react"
import { Button } from "antd"

type TopProduct = {
  id: string | number
  name: string
  revenue: string
  percentage: number
  image: string
}

type Props = {
  products: TopProduct[]
}

export default function TopProductsTable({ products }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Sản phẩm bán chạy nhất
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Doanh thu</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tỉ lệ (%)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-800">{product.revenue}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${product.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-800 w-12">{product.percentage}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <span className="text-sm text-gray-700">7 ngày qua</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
        <Button>Xem tất cả</Button>
      </div>
    </div>
  )
}

