import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // ✅ Changed from Pie to Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend);

const EVTypeDistributionChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const evTypeCounts = {};

    data.forEach(vehicle => {
      const evType = vehicle["Electric Vehicle Type"];
      if (!evType) return;

      if (!evTypeCounts[evType]) evTypeCounts[evType] = 0;
      evTypeCounts[evType]++;
    });

    const totalVehicles = data.length;

    const labels = Object.keys(evTypeCounts);
    const counts = Object.values(evTypeCounts);
    const percentages = counts.map(count => (count / totalVehicles) * 100);

    setChartData({
      labels: labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#B2FF59', '#FF6F00'],
          borderColor: '#fff',
          borderWidth: 1,
        },
      ],
    });

    // Key Insights based on the chart
    const topEVType = labels[0];
    const topEVTypePercentage = percentages[0].toFixed(2);
    const secondEVType = labels[1] || '';
    const secondEVTypePercentage = percentages[1] ? percentages[1].toFixed(2) : '0.00';

    const insights = [
      `The most popular EV type is ${topEVType}, making up ${topEVTypePercentage}% of all electric vehicles.`,
      secondEVType && `The second most popular EV type is ${secondEVType}, accounting for ${secondEVTypePercentage}% of the total market.`,
    ];

    setInsights(insights);

  }, [data]);

  const darkModeClass = darkMode ? 'dark' : '';

  return (
    <div className={`w-full max-w-6xl mx-auto mt-10 ${darkModeClass}`}>
      <h2 className="text-xl text-center text-black dark:text-white mb-4">EV Type Distribution</h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-2/3 h-[500px]">
          {chartData && <Doughnut data={chartData} />}
        </div>

        {/* Description Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          <ul className="list-disc list-inside text-lg space-y-3">
            <li>
              This doughnut chart highlights the share of each EV type, offering insight into the variety and popularity of vehicle categories.
            </li>
            <li>
              By analyzing this chart, stakeholders can understand consumer preferences and which EV types dominate adoption across different markets and demographics.
            </li>
            <li>
              Manufacturers and policy makers can use this data to tailor production and infrastructure planning to support growing EV types more effectively.
            </li>
          </ul>
        </div>
      </div>

      {/* Key Insights Section */}
      <div className="w-full mt-6 text-gray-700 dark:text-gray-300">
        <ul className="list-disc list-inside text-lg space-y-2">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EVTypeDistributionChart;
