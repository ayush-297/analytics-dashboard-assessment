import React, { useState, useEffect, useRef } from "react";

const Nabar = ({ setSelectedChart, selectedChart }) => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const sliderRef = useRef(null); // Reference for outside click

  const toggleSlider = () => {
    setIsSliderOpen(!isSliderOpen);
  };

  // Close slider on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        setIsSliderOpen(false);
      }
    };

    if (isSliderOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSliderOpen]);

  return (
    <div className="flex items-center justify-between bg-base-100 shadow-lg px-4 h-16 relative">
      {/* Left: Slider Button */}
      <div className="flex items-center w-1/3">
        <button
          onClick={toggleSlider}
          className="btn btn-ghost btn-circle p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white dark:text-[#4fd1c5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>

      {/* Center: Dashboard Title */}
      <div className="w-1/3 flex justify-center">
        <p className="text-xl font-semibold text-white dark:text-[#4fd1c5]">
          Dashboard
        </p>
      </div>

      {/* Right: Placeholder */}
      <div className="w-1/3 flex justify-end">
        <div className="invisible btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
      </div>

      {/* Slider Panel */}
      <div
        ref={sliderRef}
        className={`absolute top-0 left-0 w-64 min-h-screen shadow-lg transform transition-all duration-300 ease-in-out
          ${isSliderOpen ? "translate-x-0" : "-translate-x-full"} 
          bg-[#dca0a4] dark:bg-[#3a4459]`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Charts
          </h3>
          <button
            onClick={toggleSlider}
            className="text-xl text-gray-900 dark:text-white"
          >
            X
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-1 min-h-screen justify-evenly">
          {[
            "TopMakesByCity",
            "EVTypeDistribution",
            "AvgRangeByMake",
            "BaseMsrpOverYears",
            "RangeDistribution",
            "EvAdoption",
            "MostCommonModels",
            "CAFVEligibility",
            "EVMarketShare",
          ].map((chartKey) => (
            <button
              key={chartKey}
              onClick={() => {
                setSelectedChart(chartKey);
                toggleSlider();
              }}
              className={`border border-gray-900 dark:border-slate-500 py-2 px-4 text-left hover:bg-blue-100 dark:hover:bg-blue-600 text-gray-900 dark:text-white rounded-md transition duration-200 ${
                selectedChart === chartKey ? "bg-blue-200 dark:bg-blue-600" : ""
              }`}
            >
              {chartKey
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
                .trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nabar;
