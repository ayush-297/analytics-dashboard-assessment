import React, { useEffect, useState } from 'react';
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
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BaseMsrpOverYearsChart = ({ data, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [keyInsights, setKeyInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const yearStats = {};

    data.forEach(vehicle => {
      const year = vehicle['Model Year'];
      const price = vehicle['Base MSRP'];

      if (typeof year !== 'number' || typeof price !== 'number' || price === 0) return;

      if (!yearStats[year]) yearStats[year] = { total: 0, count: 0 };
      yearStats[year].total += price;
      yearStats[year].count++;
    });

    const sortedYears = Object.keys(yearStats)
      .map(Number)
      .sort((a, b) => a - b);

    const labels = sortedYears;
    const avgPrices = sortedYears.map(year => {
      const { total, count } = yearStats[year];
      return total / count;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Avg Base MSRP ($)',
          data: avgPrices,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.4)',
          fill: true,
          tension: 0.2,
        },
      ],
    });

    // Generating Key Insights
    const firstYear = sortedYears[0] || 'N/A';
    const firstYearPrice = avgPrices[0] || 0;
    const lastYear = sortedYears[sortedYears.length - 1] || 'N/A';
    const lastYearPrice = avgPrices[avgPrices.length - 1] || 0;
    const priceIncrease = lastYearPrice - firstYearPrice;
    const priceIncreasePercentage = (priceIncrease / firstYearPrice) * 100;

    const insights = [
      `In ${firstYear}, the average base MSRP was $${firstYearPrice.toFixed(2)}.`,
      `By ${lastYear}, the average base MSRP increased to $${lastYearPrice.toFixed(2)}, reflecting a price increase of $${priceIncrease.toFixed(2)} (${priceIncreasePercentage.toFixed(2)}%).`,
      `The trend suggests a general increase in EV prices, driven by advancements in technology, regulatory requirements, and market demand.`,
      `This data can help manufacturers, policymakers, and consumers better understand pricing trends and adjust strategies accordingly.`,
    ];

    setKeyInsights(insights);
  }, [data]);

  const gridColor = darkMode ? '#444' : '#ccc';
  const tickColor = darkMode ? '#ddd' : '#333';

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        Average Base MSRP Over Model Years
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Chart Section */}
        <div className="w-full md:w-2/3">
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: true, labels: { color: tickColor } },
                  title: { display: false },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Model Year', color: tickColor },
                    grid: {
                      color: gridColor,
                    },
                    ticks: {
                      color: tickColor,
                    },
                  },
                  y: {
                    title: { display: true, text: 'Base MSRP ($)', color: tickColor },
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
            This chart illustrates how the average MSRP of electric vehicles has changed over time, revealing price trends aligned with new technologies and evolving consumer demands.
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

export default BaseMsrpOverYearsChart;
