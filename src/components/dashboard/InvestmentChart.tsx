import React from 'react';
import { Line } from 'react-chartjs-2';
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
  ChartData,
  ChartOptions,
} from 'chart.js';

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

interface InvestmentChartProps {
  data: {
    dates: string[];
    values: number[];
    roi: number[];
  };
  title?: string;
  showLegend?: boolean;
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({
  data,
  title = 'Investment Performance',
  showLegend = true,
}) => {
  const chartData: ChartData<'line'> = {
    labels: data.dates,
    datasets: [
      {
        label: 'Portfolio Value ($)',
        data: data.values,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'ROI (%)',
        data: data.roi,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: false,
        tension: 0.3,
        pointBackgroundColor: '#14b8a6',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        bodyFont: {
          family: 'Inter, sans-serif',
        },
        titleFont: {
          family: 'Inter, sans-serif',
          weight: 'bold',
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.yAxisID === 'y1') {
                label += context.parsed.y.toFixed(2) + '%';
              } else {
                label += '$' + context.parsed.y.toLocaleString();
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        position: 'left',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
      y1: {
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
          },
          callback: function(value) {
            return value + '%';
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        hitRadius: 10,
      },
    },
  };

  return (
    <div className="h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default InvestmentChart;