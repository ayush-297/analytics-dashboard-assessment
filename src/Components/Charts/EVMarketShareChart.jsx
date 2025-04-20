import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // ✅ Changed from Pie to Doughnut
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EVMarketShareChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const evMakeCounts = {};

    data.forEach(vehicle => {
      const evMake = vehicle["Make"];
      if (!evMake) return;

      if (!evMakeCounts[evMake]) evMakeCounts[evMake] = 0;
      evMakeCounts[evMake]++;
    });

    const totalVehicles = data.length;

    const labels = Object.keys(evMakeCounts);
    const counts = Object.values(evMakeCounts);
    const marketShare = counts.map(count => (count / totalVehicles) * 100);

    // Define a list of distinct colors for chart slices
    const predefinedColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#B2FF59', '#FF6F00', 
      '#9966FF', '#FF33CC', '#FF9933', '#6699FF', '#33CC99', 
      '#FF6699', '#66FF66', '#FF6666', '#FFB366', '#99FFCC'
    ];

    // Cycle through the colors based on the number of slices
    const colors = labels.map((_, index) => predefinedColors[index % predefinedColors.length]);

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
    const topEVMake = labels[0];
    const topEVMakeShare = marketShare[0] || 0;
    const secondEVMake = labels[1] || 'N/A';
    const secondEVMakeShare = marketShare[1] || 0;
    const remainingShare = 100 - (topEVMakeShare + secondEVMakeShare);

    const insights = [
      `The most popular EV make is ${topEVMake}, accounting for ${topEVMakeShare.toFixed(2)}% of all electric vehicles.`,
      secondEVMake && `The second most popular EV make is ${secondEVMake}, making up ${secondEVMakeShare.toFixed(2)}% of the market.`,
      `The remaining EV makes together account for ${remainingShare.toFixed(2)}% of the market.`
    ];

    setKeyInsights(insights);
  }, [data, darkMode]);

  return (
    <div className={`w-full max-w-6xl mx-auto mt-10 ${darkMode ? 'dark' : ''}`}>
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        EV Market Share
      </h2>

      {/* Wrapper flex for layout */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Text and Insights Section */}
        <div className="w-full md:w-1/2 text-gray-700 dark:text-gray-300 mb-8 md:mb-0">
          <p className="mb-6 text-lg leading-relaxed">
            This doughnut chart visualizes the market share distribution across different EV makes, 
            helping stakeholders understand which vehicle makes dominate the electric vehicle market.
          </p>

          <ul className="list-disc list-inside text-lg space-y-3 leading-relaxed">
            {keyInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-1/2 h-[500px]">
          {chartData && <Doughnut data={chartData} />}
        </div>
      </div>
    </div>
  );
};

export default EVMarketShareChart;
