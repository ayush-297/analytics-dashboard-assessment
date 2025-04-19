import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // ✅ Changed from Pie to Doughnut
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EVTypeDistributionChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

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
    const marketShare = counts.map((count) => (count / totalVehicles) * 100);

    const colors = labels.map(() =>
      `hsl(${Math.random() * 360}, 70%, 60%)`
    );

    setChartData({
      labels,
      datasets: [
        {
          data: marketShare,
          backgroundColor: colors,
          borderColor: darkMode ? '#6EA8E0' : '#1E88E5',
          borderWidth: 2,
          hoverBackgroundColor: colors.map(color => `${color}80`), // Slightly transparent on hover
        },
      ],
    });

    // Generating Key Insights
    const topEVType = labels[0];
    const topEVTypeShare = marketShare[0] || 0;
    const secondEVType = labels[1] || 'N/A';
    const secondEVTypeShare = marketShare[1] || 0;
    const remainingShare = 100 - (topEVTypeShare + secondEVTypeShare);

    const insights = [
      `The most popular EV type is ${topEVType}, accounting for ${topEVTypeShare.toFixed(2)}% of all electric vehicles.`,
      secondEVType && `The second most popular EV type is ${secondEVType}, making up ${secondEVTypeShare.toFixed(2)}% of the market.`,
      `The remaining EV types together account for ${remainingShare.toFixed(2)}% of the market.`
    ];

    setKeyInsights(insights);
  }, [data, darkMode]);

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        EV Type Distribution
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-1/2 h-[500px] relative">
          {chartData && <Doughnut data={chartData} />}
        </div>

        {/* Description and Key Insights Section */}
        <div className="w-full md:w-1/2 text-gray-700 dark:text-gray-300">
          <p className="mb-6 text-lg leading-relaxed">
            This doughnut chart visualizes the distribution of different electric vehicle (EV) types in the market, 
            highlighting the market share for each EV category.
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

export default EVTypeDistributionChart;
