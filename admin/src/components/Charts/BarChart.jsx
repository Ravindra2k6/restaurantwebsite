import "./chartSetup";
import { Bar } from "react-chartjs-2";

const DEFAULT_COLORS = ["#c98a2e", "#dfa348", "#e9bd72", "#87531f", "#a86d23", "#6d431f"];

const BarChart = ({ points = [], label = "Count", horizontal = false }) => {
  const data = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label,
        data: points.map((p) => p.value),
        backgroundColor: points.map((_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: !horizontal } },
      y: { beginAtZero: true, grid: { display: horizontal } },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
