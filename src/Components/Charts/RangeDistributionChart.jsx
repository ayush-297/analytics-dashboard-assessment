import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RangeDistributionChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const buckets = {
      '0-50': 0,
      '51-100': 0,
      '101-150': 0,
      '151-200': 0,
      '201-250': 0,
      '251-300': 0,
      '301-350': 0,
      '351+': 0,
    };

    data.forEach(vehicle => {
      const range = vehicle['Electric Range'];
      if (typeof range !== 'number') return;

      if (range <= 50) buckets['0-50']++;
      else if (range <= 100) buckets['51-100']++;
      else if (range <= 150) buckets['101-150']++;
      else if (range <= 200) buckets['151-200']++;
      else if (range <= 250) buckets['201-250']++;
      else if (range <= 300) buckets['251-300']++;
      else if (range <= 350) buckets['301-350']++;
      else buckets['351+']++;
    });

    // Set up the gradient within the chart data function
    setChartData({
      labels: Object.keys(buckets),
      datasets: [
        {
          label: 'Number of Vehicles',
          data: Object.values(buckets),
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx } = chart;
            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, '#ff7e5f');  // Start color
            gradient.addColorStop(1, '#feb47b');  // End color
            return gradient;
          },
          borderColor: '#f76c6c',
          borderWidth: 1,
        },
      ],
    });

    // Key insights logic
    const totalVehicles = Object.values(buckets).reduce((acc, count) => acc + count, 0);
    const highestBucket = Object.entries(buckets).reduce((acc, [range, count]) => {
      if (count > acc.count) {
        acc = { range, count };
      }
      return acc;
    }, { range: '', count: 0 });

    const insights = [
      `There are a total of ${totalVehicles} vehicles categorized based on their electric range.`,
      `The most common range bucket is ${highestBucket.range}, which includes ${highestBucket.count} vehicles.`,
      `This distribution highlights the concentration of EVs in mid-range categories, with fewer vehicles in the extreme low and high ends of the spectrum.`,
      `As battery technology progresses, we can expect a shift towards higher ranges, with more vehicles moving into the 250+ miles category.`,
    ];

    setKeyInsights(insights);
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#eee' : '#333',
        },
      },
      title: { display: false },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Electric Range (miles)',
          color: darkMode ? '#eee' : '#333',
        },
        ticks: {
          color: darkMode ? '#eee' : '#333',
        },
        grid: {
          color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Vehicles',
          color: darkMode ? '#eee' : '#333',
        },
        ticks: {
          color: darkMode ? '#eee' : '#333',
        },
        grid: {
          color: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        Electric Range Distribution
      </h2>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-2/3">
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>

        {/* Description and Key Insights Section */}
        <div className="w-full md:w-2/3 text-gray-700 dark:text-gray-300">
          <p className="mb-6 text-lg leading-relaxed">
            This chart categorizes electric vehicles based on their range in miles, showing how many fall within each defined bucket for clearer comparative analysis.
          </p>

          <ul className="list-disc list-inside text-lg space-y-3 leading-relaxed">
            {keyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RangeDistributionChart;
