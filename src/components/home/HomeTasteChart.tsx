"use client"

type HomeTasteChartProps = {
  acidity: number
  bitterness: number
  body: number
  flavor: number
  sweetness: number
}

type Point = {
  x: number
  y: number
}

const chartAxes = [
  { angle: -Math.PI / 2, label: "酸味" },
  { angle: -Math.PI / 2 + (Math.PI * 2) / 5, label: "フレーバー" },
  { angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 2, label: "ボディ" },
  { angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 3, label: "苦味" },
  { angle: -Math.PI / 2 + ((Math.PI * 2) / 5) * 4, label: "甘味" },
] as const

const chartCenter = 120
const chartLabelRadius = 94
const chartRadius = 72
const chartSize = chartCenter * 2
const chartSteps = 5

export function HomeTasteChart({
  acidity,
  bitterness,
  body,
  flavor,
  sweetness,
}: HomeTasteChartProps) {
  const values = [acidity, flavor, body, bitterness, sweetness]
  const outerPoints = buildRadarPolygon(
    chartAxes.map(() => chartSteps),
    chartRadius,
    chartCenter,
  )
  const dataPoints = buildRadarPolygon(values, chartRadius, chartCenter)

  return (
    <svg
      viewBox={`0 0 ${chartSize} ${chartSize}`}
      role="img"
      aria-label="Taste chart"
      data-testid="home-taste-chart"
      className="mx-auto h-64 w-full max-w-[18rem]"
    >
      {Array.from({ length: chartSteps }, (_, index) => {
        const step = index + 1
        const ringPoints = buildRadarPolygon(
          chartAxes.map(() => step),
          chartRadius,
          chartCenter,
        )

        return (
          <polygon
            key={step}
            points={toSvgPoints(ringPoints)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        )
      })}

      {outerPoints.map((point, index) => (
        <line
          key={chartAxes[index].label}
          x1={chartCenter}
          y1={chartCenter}
          x2={point.x}
          y2={point.y}
          stroke="#e5e7eb"
          strokeWidth={1}
        />
      ))}

      <polygon
        points={toSvgPoints(dataPoints)}
        fill="rgba(99, 102, 241, 0.18)"
        stroke="rgb(99, 102, 241)"
        strokeWidth={2}
      />

      {dataPoints.map((point, index) => (
        <circle
          key={`${chartAxes[index].label}-point`}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="rgb(99, 102, 241)"
          stroke="white"
          strokeWidth={2}
        />
      ))}

      {chartAxes.map((axis) => {
        const point = polarToCartesian(chartCenter, chartCenter, chartLabelRadius, axis.angle)

        return (
          <text
            key={axis.label}
            x={point.x}
            y={point.y}
            textAnchor={resolveTextAnchor(point.x, chartCenter)}
            dominantBaseline="middle"
            fill="#4b5563"
            fontSize="12"
            fontWeight="500"
          >
            {axis.label}
          </text>
        )
      })}
    </svg>
  )
}

export function buildRadarPolygon(
  values: readonly number[],
  radius: number,
  center: number,
): Point[] {
  return values.map((value, index) => {
    const normalized = clampRadarValue(value) / chartSteps

    return polarToCartesian(center, center, radius * normalized, chartAxes[index].angle)
  })
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angle: number): Point {
  return {
    x: Number((centerX + Math.cos(angle) * radius).toFixed(2)),
    y: Number((centerY + Math.sin(angle) * radius).toFixed(2)),
  }
}

function toSvgPoints(points: readonly Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ")
}

function resolveTextAnchor(x: number, center: number) {
  if (Math.abs(x - center) < 6) {
    return "middle"
  }

  return x > center ? "start" : "end"
}

function clampRadarValue(value: number) {
  return Math.max(0, Math.min(chartSteps, value))
}
