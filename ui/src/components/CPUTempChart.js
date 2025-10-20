// Needle chart taken from the official recharts documentation at https://recharts.github.io/en-US/examples/PieChartWithNeedle with few modifications
import { Pie, PieChart } from "recharts"

const RADIAN = Math.PI / 180

const chartData = [
  { name: "safe", value: 45, fill: "#00ff00" },
  { name: "warning", value: 15, fill: "#ffaa00" },
  { name: "critical", value: 5, fill: "#ff0000" },
]

const needle = ({ value, data, cx, cy, iR, oR, color }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0)
  const ang = 180.0 * (1 - value / total)
  const length = (iR + 2 * oR) / 3
  const sin = Math.sin(-RADIAN * ang)
  const cos = Math.cos(-RADIAN * ang)
  const r = 5
  const x0 = cx + 5
  const y0 = cy + 5
  const xba = x0 + r * sin
  const yba = y0 - r * cos
  const xbb = x0 - r * sin
  const ybb = y0 + r * cos
  const xp = x0 + length * cos
  const yp = y0 + length * sin

  return [
    <circle key="needle-circle" cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path
      key="needle-path"
      d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`}
      stroke="#none"
      fill={color}
    />,
  ]
}

export default function CPUTempChart({ temperature = 30, isAnimationActive = true } ) {
  const cx = 100
  const cy = 100
  const iR = 50
  const oR = 100
  
  const minTemp = 25
  const maxTemp = 90
  const clampedTemp = Math.max(minTemp, Math.min(maxTemp, temperature))
  const value = ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 65

  return (
    <div style={{ textAlign: "center" }}>
      <PieChart width={210} height={120} style={{ margin: "0 auto" }}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={chartData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          fill="#8884d8"
          stroke="none"
          isAnimationActive={isAnimationActive}
        />
        {needle({ value, data: chartData, cx, cy, iR, oR, color: "black" })}
      </PieChart>
      <div style={{ marginTop: "-10px", fontWeight: "bold", fontSize: "18px" }}>
        {temperature}°C
      </div>
      <div style={{ fontSize: "12px", color: "#666" }}>
        CPU Temperature
      </div>
    </div>
  )
}
