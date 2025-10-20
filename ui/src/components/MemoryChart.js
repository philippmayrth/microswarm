import { PieChart, Pie, Label, Legend } from "recharts";


const MyPie = ({ data }) => (
  <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="60%" isAnimationActive={false} />
);

export default function MemoryChart({ label, free, total}) {
  const used = total - free
  const data = [
    { name: "Used", value: used, fill: "#2196f3" },
    { name: "Free", value: free, fill: "#9e9e9e" },
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


