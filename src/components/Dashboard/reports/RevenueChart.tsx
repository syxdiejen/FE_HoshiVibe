"use client"

import { useState } from "react"

type ChartDataPoint = {
  month: number
  value: number
}

type Props = {
  chartData: ChartDataPoint[]
  loading?: boolean
}

export default function RevenueChart({ chartData, loading = false }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<{ month: number; value: number; x: number; y: number } | null>(null)
  
  const maxValue = Math.max(...chartData.map((d) => d.value), 1) // Avoid division by zero

  // Calculate max value in millions and round up to nearest whole number
  const maxValueInMillions = Math.ceil(maxValue / 1000000)
  
  // Create Y-axis labels: 0, 1M, 2M, 3M, ... up to maxValueInMillions
  // Use 5 evenly spaced labels
  const numLabels = 5
  const yAxisLabels = Array.from({ length: numLabels }, (_, i) => {
    const value = Math.round((maxValueInMillions * i) / (numLabels - 1))
    return value
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND"
  }

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">Tổng doanh số từng tháng</h2>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-800">Tổng doanh số từng tháng</h2>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: '280px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500 pr-4">
          {yAxisLabels.reverse().map((label, i) => (
            <span key={i}>{label}M</span>
          ))}
        </div>

        {/* Chart area */}
        <div className="ml-8 h-64 border-l border-b border-gray-200 relative chart-container">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-100" />
            ))}
          </div>

          {/* Polyline */}
          {chartData.length > 0 && (
            <svg 
              className="absolute inset-0 w-full h-full" 
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                points={chartData
                  .map((d, i) => {
                    const x = (i / Math.max(chartData.length - 1, 1)) * 100
                    // Scale based on maxValueInMillions (convert to actual value for comparison)
                    const scaledMax = maxValueInMillions * 1000000
                    const y = 100 - (d.value / scaledMax) * 100
                    return `${x}%,${y}%`
                  })
                  .join(" ")}
              />
              {chartData.map((d, i) => {
                const x = (i / Math.max(chartData.length - 1, 1)) * 100
                const scaledMax = maxValueInMillions * 1000000
                const y = 100 - (d.value / scaledMax) * 100
                const xPercent = `${x}%`
                const yPercent = `${y}%`
                
                const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>) => {
                  const svg = e.currentTarget.closest('svg')
                  const chartContainer = svg?.closest('.chart-container')
                  if (svg && chartContainer) {
                    const svgRect = svg.getBoundingClientRect()
                    const containerRect = chartContainer.getBoundingClientRect()
                    const xPos = (x / 100) * svgRect.width
                    const yPos = (y / 100) * svgRect.height
                    setHoveredPoint({
                      month: d.month,
                      value: d.value,
                      x: xPos + (svgRect.left - containerRect.left),
                      y: yPos + (svgRect.top - containerRect.top)
                    })
                  }
                }
                
                return (
                  <g key={i}>
                    <circle 
                      cx={xPercent} 
                      cy={yPercent} 
                      r="6" 
                      fill="#3B82F6"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={handleMouseEnter}
                    />
                    <circle 
                      cx={xPercent} 
                      cy={yPercent} 
                      r="10" 
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={handleMouseEnter}
                    />
                  </g>
                )
              })}
            </svg>
          )}
          
          {/* Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg z-10 pointer-events-none whitespace-nowrap"
              style={{
                left: `${hoveredPoint.x}px`,
                top: `${hoveredPoint.y}px`,
                transform: 'translate(-50%, calc(-100% - 8px))',
              }}
            >
              <div className="font-semibold">{monthNames[hoveredPoint.month - 1]}</div>
              <div className="text-white/90">{formatCurrency(hoveredPoint.value)}</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>

        {/* X-axis labels */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
          {chartData.map((d) => {
            const monthName = monthNames[d.month - 1] || `T${d.month}`
            return (
              <span key={d.month} className="text-center" style={{ flex: 1 }}>
                {monthName.substring(6)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

