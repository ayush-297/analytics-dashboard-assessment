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

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AvgElectricRangeByMakeChart = ({ data, topMakesCount = 10, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const makeStats = {};

    // Calculate average range by make
    data.forEach(vehicle => {
      const make = vehicle.Make?.trim();
      const range = vehicle['Electric Range'];

      if (!make || typeof range !== 'number') return;

      if (!makeStats[make]) makeStats[make] = { total: 0, count: 0 };
      makeStats[make].total += range;
      makeStats[make].count++;
    });

    const averages = Object.entries(makeStats).map(([make, stats]) => ({
      make,
      averageRange: stats.total / stats.count,
    }));

    const topMakes = averages
      .sort((a, b) => b.averageRange - a.averageRange)
      .slice(0, topMakesCount);

    // Generate random colors for each bar
    const randomColors = topMakes.map(() =>
      `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    );

    setChartData({
      labels: topMakes.map(entry => entry.make),
      datasets: [
        {
          label: 'Avg Electric Range (miles)',
          data: topMakes.map(entry => entry.averageRange),
          backgroundColor: randomColors, // Apply random colors to each bar
          borderColor: '#1E88E5',
          borderWidth: 1,
        },
      ],
    });

    // Generating Key Insights
    const topMake = topMakes[0] ? topMakes[0].make : 'N/A';
    const topMakeRange = topMakes[0] ? topMakes[0].averageRange : 0;
    const secondMake = topMakes[1] ? topMakes[1].make : 'N/A';
    const secondMakeRange = topMakes[1] ? topMakes[1].averageRange : 0;
    const remainingRange = topMakes.reduce((acc, { averageRange }) => acc + averageRange, 0);

    const insights = [
      `The top EV brand, ${topMake}, has an average electric range of ${topMakeRange.toFixed(2)} miles.`,
      `The second best performing brand is ${secondMake}, with an average range of ${secondMakeRange.toFixed(2)} miles.`,
      `The top two brands together contribute to an average electric range of ${(topMakeRange + secondMakeRange).toFixed(2)} miles.`,
      `The remaining brands have a combined average range of ${(remainingRange - (topMakeRange + secondMakeRange)).toFixed(2)} miles.`
    ];

    setKeyInsights(insights);
  }, [data, topMakesCount]);

  // 🌙 Dynamic grid and tick color based on darkMode
  const gridColor = darkMode ? '#444' : '#ccc';
  const tickColor = darkMode ? '#ddd' : '#333';

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        Average Electric Range by Make
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-2/3">
          {chartData && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    labels: { color: tickColor },
                  },
                  title: { display: false },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Make', color: tickColor },
                    grid: {
                      color: gridColor,
                    },
                    ticks: {
                      color: tickColor,
                    },
                  },
                  y: {
                    title: { display: true, text: 'Average Range (miles)', color: tickColor },
                    grid: {
                      color: gridColor,
                    },
                    ticks: {
                      color: tickColor,
                    },
                  },
                },
              }}
            />
          )}
        </div>

        {/* Description and Key Insights Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          <p className="mb-6 text-lg leading-relaxed">
            This chart visualizes the average electric range by make, offering a comparison of how top manufacturers perform in terms of electric range (in miles).
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

export default AvgElectricRangeByMakeChart;
