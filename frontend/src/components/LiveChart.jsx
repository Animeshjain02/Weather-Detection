import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LiveChart({ data, title, colorClass, borderHex, fillHex, theme }) {
  const isDark = theme === 'dark';
  
  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        label: title,
        data: data.map(d => d.value),
        borderColor: borderHex,
        backgroundColor: fillHex,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
      easing: 'linear'
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#cbd5e1' : '#64748b',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? '#334155' : '#e2e8f0', drawBorder: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', maxTicksLimit: 8 },
        border: { display: false }
      },
      y: {
        grid: { color: isDark ? '#334155' : '#e2e8f0', drawBorder: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
        border: { display: false }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-lg h-64 flex flex-col transition-all duration-300">
      <h3 className={`text-sm font-medium tracking-wider uppercase mb-4 ${colorClass}`}>{title}</h3>
      <div className="flex-1 relative w-full h-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
