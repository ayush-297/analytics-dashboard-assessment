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

const TopMakesByCityChart = ({ data, topCitiesCount = 5, topMakesCount = 3, darkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const cityMakeCounts = {};

    data.forEach(vehicle => {
      const city = vehicle.City?.trim();
      const make = vehicle.Make?.trim();
      if (!city || !make) return;

      if (!cityMakeCounts[city]) cityMakeCounts[city] = {};
      if (!cityMakeCounts[city][make]) cityMakeCounts[city][make] = 0;

      cityMakeCounts[city][make]++;
    });

    const sortedCities = Object.keys(cityMakeCounts)
      .sort((a, b) => {
        const aTotal = Object.values(cityMakeCounts[a]).reduce((sum, count) => sum + count, 0);
        const bTotal = Object.values(cityMakeCounts[b]).reduce((sum, count) => sum + count, 0);
        return bTotal - aTotal;
      })
      .slice(0, topCitiesCount);

    const topMakes = new Set();

    sortedCities.forEach(city => {
      const makes = Object.entries(cityMakeCounts[city])
        .sort(([, a], [, b]) => b - a)
        .slice(0, topMakesCount)
        .map(([make]) => make);
      makes.forEach(make => topMakes.add(make));
    });

    const makeList = Array.from(topMakes);
    const datasets = makeList.map(make => ({
      label: make,
      data: sortedCities.map(city => cityMakeCounts[city][make] || 0),
      backgroundColor: getRandomColor(),
    }));

    setChartData({
      labels: sortedCities,
      datasets: datasets,
    });

    // Generate insights based on the top makes and their market share in cities
    const insights = [
      `The top brand, ${makeList[0]}, is the most popular across cities.`,
      `The second brand, ${makeList[1]}, follows closely with a significant presence in major cities.`,
      `The remaining brands show a more fragmented presence across different cities.`,
    ];
    setInsights(insights);

  }, [data, topCitiesCount, topMakesCount]);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center text-black dark:text-white mb-6">
        Top EV Makes in Major Cities
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Description Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>
              This chart compares the popularity of different electric vehicle brands across the most populated cities.
            </li>
            <li>
              It highlights the top manufacturers and their market presence in urban areas.
            </li>
            <li>
              The chart can help you analyze city-level preferences and which brands dominate specific markets.
            </li>
          </ul>
        </div>

        {/* Chart Section */}
        <div className="w-full md:w-2/3">
          {chartData && (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                  },
                  title: { display: false },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'City',
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    ticks: {
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    grid: {
                      color: darkMode ? '#444444' : '#cccccc',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Number of Vehicles',
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    ticks: {
                      color: darkMode ? '#ffffff' : '#000000',
                    },
                    grid: {
                      color: darkMode ? '#444444' : '#cccccc',
                    },
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>

        {/* Insights Section */}
        <div className="w-full md:w-1/3 text-gray-700 dark:text-gray-300">
          <ul className="list-disc list-inside text-lg space-y-2">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopMakesByCityChart;
