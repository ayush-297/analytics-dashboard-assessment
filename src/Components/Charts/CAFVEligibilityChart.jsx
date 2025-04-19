import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CAFVEligibilityChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    let eligibleCount = 0;
    let nonEligibleCount = 0;

    data.forEach((vehicle) => {
      const eligibility = vehicle['Clean Alternative Fuel Vehicle (CAFV) Eligibility'];
      if (eligibility === 'Clean Alternative Fuel Vehicle Eligible') {
        eligibleCount++;
      } else {
        nonEligibleCount++;
      }
    });

    setChartData({
      labels: ['Eligible', 'Non-Eligible'],
      datasets: [
        {
          data: [eligibleCount, nonEligibleCount],
          backgroundColor: darkMode
            ? ['#1E88E5', '#D32F2F'] // Blue and Red for dark mode
            : ['#42A5F5', '#FF7043'], // Lighter colors for light mode
          borderColor: darkMode
            ? ['#1565C0', '#B71C1C'] // Darker border colors for dark mode
            : ['#1E88E5', '#D32F2F'], // Lighter borders for light mode
          borderWidth: 1,
        },
      ],
    });
  }, [data, darkMode]);

  const descriptionText = chartData && chartData.datasets[0].data[0] && (
    <ul className="list-disc list-inside text-lg space-y-3 leading-relaxed">
      <li>
        Out of the total vehicles in the dataset, <strong>{chartData.datasets[0].data[0]}</strong> vehicles are eligible for Clean Alternative Fuel Vehicle (CAFV) status. This represents <strong>{(
          (chartData.datasets[0].data[0] / data.length) *
          100
        ).toFixed(1)}%</strong> of all vehicles in the dataset.
      </li>
      <li>
        The remaining <strong>{chartData.datasets[0].data[1]}</strong> vehicles, or <strong>{(
          (chartData.datasets[0].data[1] / data.length) *
          100
        ).toFixed(1)}%</strong>, are non-eligible for CAFV status, indicating they do not meet the criteria for clean fuel programs.
      </li>
      <li>
        This breakdown provides a clear view of how many vehicles in the dataset could potentially benefit from incentives or access to clean vehicle zones, while also identifying the proportion of vehicles that fall outside these initiatives.
      </li>
    </ul>
  );

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        CAFV Eligibility Breakdown
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart */}
        <div className="w-full md:w-1/2 h-[400px]">
          {chartData && (
            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                  },
                  title: {
                    display: true,
                    text: 'CAFV Eligibility Breakdown',
                    color: darkMode ? '#ffffff' : '#000000',
                  },
                  tooltip: {
                    bodyColor: darkMode ? '#ffffff' : '#000000',
                    titleColor: darkMode ? '#ffffff' : '#000000',
                    backgroundColor: darkMode ? '#374151' : '#f3f3f3',
                    callbacks: {
                      // Customize tooltip with count and percentage
                      label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        const total = tooltipItem.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${tooltipItem.label}: ${value} (${percentage}%)`;
                      },
                    },
                  },
                },
                animation: {
                  animateScale: true,
                  animateRotate: true,
                },
              }}
            />
          )}
        </div>

        {/* Description */}
        <div className="w-full md:w-1/2 text-gray-700 dark:text-gray-300">
          {descriptionText}
        </div>
      </div>
    </div>
  );
};

export default CAFVEligibilityChart;
