import "./chartSetup";
import { Doughnut } from "react-chartjs-2";

const DEFAULT_COLORS = ["#c98a2e", "#3b82f6", "#22c55e", "#ef4444", "#a855f7", "#64748b"];

const DoughnutChart = ({ points = [] }) => {
  const data = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        data: points.map((p) => p.value),
        backgroundColor: points.map((_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 10, padding: 16, font: { size: 11 } } },
    },
  };

  return (
    <div style={{ height: 260 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
