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
        minHeight: "200px",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PieChart width={250} height={250}>
        <MyPie data={data} />
        <Label position="center" fill="#666">
          {label}
        </Label>
        <Legend />
      </PieChart>

    </div>
  );
}


