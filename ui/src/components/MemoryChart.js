import { PieChart, Pie, Label, Legend } from "recharts";


const MyPie = ({ data }) => (
  <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="60%" isAnimationActive={false} />
);

export default function MemoryChart({ label, free, used }) {
const data = [
  { name: "Free", value: free, fill: "#0088FE" },
  { name: "Used", value: used, fill: "#00C49F" },
]

  return (
    <div
      style={{
        width: "100%",
        minHeight: "300px",
        padding: "10px",
        justifyContent: "space-around",
        alignItems: "stretch",
      }}
    >
      <PieChart responsive style={{ height: "calc(100% - 20px)", width: "33%", maxWidth: "300px", aspectRatio: 1 }}>
        <MyPie data={data} />
        <Label position="center" fill="#666">
          {label}
        </Label>
        <Legend />
      </PieChart>

    </div>
  );
}


