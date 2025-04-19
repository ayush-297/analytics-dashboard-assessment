import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const EvAdoptionChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearCounts = {};

    data.forEach(vehicle => {
      const year = vehicle['Model Year'];
      if (typeof year !== 'number') return;

      if (!yearCounts[year]) yearCounts[year] = 0;
      yearCounts[year]++;
    });

    const sortedYears = Object.keys(yearCounts).sort((a, b) => a - b);
    const counts = sortedYears.map(year => yearCounts[year]);

    setChartData({
      labels: sortedYears,
      datasets: [
        {
          label: 'Number of EVs',
          data: counts,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.3,
        },
      ],
    });

    // Key insights logic
    const totalEvCount = counts.reduce((acc, count) => acc + count, 0);
    const highestYear = sortedYears[counts.indexOf(Math.max(...counts))];

    const insights = [
      `There are a total of ${totalEvCount} EVs registered across the years in the dataset.`,
      `The year with the highest adoption was ${highestYear}, with the most registrations recorded.`,
      `The chart highlights the exponential growth of EV adoption in recent years, driven by technological advancements and policy support.`,
      `Looking ahead, the upward trend suggests that EV adoption will continue to rise as infrastructure and incentives evolve.`,
    ];

    setKeyInsights(insights);
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#eee' : '#333',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Model Year',
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
        EV Adoption Over Time
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-2/3 h-[500px]">
          {chartData && <Line data={chartData} options={options} />}
        </div>

        {/* Description and Key Insights Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          <p className="mb-6 text-lg leading-relaxed">
            This chart visualizes the growth of electric vehicle adoption over the years, highlighting the shift toward cleaner transportation technologies.
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

export default EvAdoptionChart;
