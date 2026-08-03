import "./chartSetup";
import { Line } from "react-chartjs-2";

/**
 * `points` is an array of { label, value } — kept as a simple shape so
 * callers don't need to know Chart.js's dataset format.
 */
const LineChart = ({ points = [], label = "Visitors", color = "#c98a2e" }) => {
  const data = {
    labels: points.map((p) => p.label),
    datasets: [
      {
        label,
        data: points.map((p) => p.value),
        borderColor: color,
        backgroundColor: `${color}22`,
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.15)" } },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
