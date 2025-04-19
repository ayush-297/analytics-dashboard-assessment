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

const MostCommonModelsChart = ({ data, topModelsCount = 10, darkMode = false }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const modelStats = {};

    // Collect count of each model
    data.forEach(vehicle => {
      const model = vehicle.Model;

      if (typeof model === 'string') {
        const trimmedModel = model.trim();
        if (!trimmedModel) return;

        modelStats[trimmedModel] = (modelStats[trimmedModel] || 0) + 1;
      }
    });

    // Get the top `topModelsCount` models
    const topModels = Object.entries(modelStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topModelsCount);

    // Set chart data
    setChartData({
      labels: topModels.map(entry => entry[0]),
      datasets: [
        {
          label: 'Count of EVs',
          data: topModels.map(entry => entry[1]),
          backgroundColor: topModels.map((_, index) => `hsl(${index * 360 / topModelsCount}, 70%, 50%)`), // Gradient color for each bar
          borderColor: '#1E88E5',
          borderWidth: 1,
          hoverBackgroundColor: '#1E88E5',
          hoverBorderColor: '#1E88E5',
          tension: 0.3,
          barPercentage: 0.8, // Make bars thinner
          categoryPercentage: 0.8,
        },
      ],
    });
  }, [data, topModelsCount]);

  const descriptionText = (
    <ul className="list-disc list-inside text-lg space-y-3 leading-relaxed">
      {chartData && chartData.datasets[0].data[0] && (
        <>
          <li>
            The most common model in the dataset is <strong>{chartData.labels[0]}</strong>, which accounts for{' '}
            <strong>{chartData.datasets[0].data[0]}</strong> vehicles, representing {(
              (chartData.datasets[0].data[0] / data.length) *
              100
            ).toFixed(2)}% of the total vehicle count.
          </li>
          <li>
            The second-most common model, <strong>{chartData.labels[1]}</strong>, has only{' '}
            <strong>{chartData.datasets[0].data[1]}</strong> vehicles, which is significantly less than the most common model.
            This indicates a large drop-off in popularity between the two.
          </li>
          <li>
            The 10th most common model, <strong>{chartData.labels[9]}</strong>, has just{' '}
            <strong>{chartData.datasets[0].data[9]}</strong> vehicles, demonstrating that after the top models, the
            market is highly fragmented.
          </li>
          <li>
            Overall, the top {topModelsCount} models represent a significant portion of the market. However, the data also
            shows that the adoption of additional models quickly decreases, suggesting that only a few models have
            substantial market shares.
          </li>
        </>
      )}
    </ul>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        Most Common EV Models
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
                  legend: { display: false },
                  title: { display: false },
                  tooltip: {
                    callbacks: {
                      // Custom tooltip for better readability
                      label: (tooltipItem) => {
                        return `Count: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: darkMode ? '#ffffff' : '#000000',
                      autoSkip: true,
                      maxRotation: 45, // Rotate labels on X-axis for better readability
                      minRotation: 30,
                    },
                    grid: {
                      color: darkMode ? '#444' : '#ccc',
                    },
                    title: {
                      display: true,
                      text: 'Model',
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                  },
                  y: {
                    ticks: {
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    grid: {
                      color: darkMode ? '#444' : '#ccc',
                    },
                    title: {
                      display: true,
                      text: 'Count of EVs',
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    beginAtZero: true,
                  },
                },
                animation: {
                  duration: 1000, // Smooth animation when the chart loads
                  easing: 'easeOutBounce',
                },
              }}
            />
          )}
        </div>

        {/* Description Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          {descriptionText}
        </div>
      </div>
    </div>
  );
};

export default MostCommonModelsChart;
