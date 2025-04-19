import React, { useState, useEffect, Suspense } from "react";
import img_dark from "./assets/img_light.png";
import img_light from "./assets/img_dark.png";
import Nabar from "./Components/Nabar";

import fetchParseData from "./utility/parser";

// Lazy-load charts
const TopMakesByCityChart = React.lazy(() => import("./Components/Charts/TopMakesByCityChart"));
const AvgElectricRangeByMakeChart = React.lazy(() => import("./Components/Charts/AvgElectricRangeByMakeChart"));
const BaseMsrpOverYearsChart = React.lazy(() => import("./Components/Charts/BaseMsrpOverYearsChart"));
const RangeDistributionChart = React.lazy(() => import("./Components/Charts/RangeDistributionChart"));
const EvAdoptionChart = React.lazy(() => import("./Components/Charts/EvAdoptionChart"));
const MostCommonModelsChart = React.lazy(() => import("./Components/Charts/MostCommonModelsChart"));
const CAFVEligibilityChart = React.lazy(() => import("./Components/Charts/CAFVEligibilityChart"));
const EVTypeDistributionChart = React.lazy(() => import("./Components/Charts/EVTypeDistributionChart"));
const EVMarketShareChart = React.lazy(() => import("./Components/Charts/EVMarketShareChart"));

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [csvData, setCsvData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("TopMakesByCity");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchParseData();
        // console.log(data);
        setCsvData(data);
      } catch (error) {
        console.error("Error fetching or parsing data:", error);
      }
    };

    fetchData();
  }, []);

  const darkModeClass = darkMode ? "dark" : "";
  return (
    <div className={`${darkModeClass}`}>
      <Nabar setSelectedChart={setSelectedChart} selectedChart={selectedChart} />
      <button
        onClick={toggleDarkMode}
        className="absolute bg-gray-200 dark:bg-gray-600 px-2 py-2 rounded-full h-8 w-8 flex top-4 right-4"
      >
        {darkMode ? (
          <img src={img_light} alt="Light mode icon" />
        ) : (
          <img src={img_dark} alt="Dark mode icon" />
        )}
      </button>
      <div className="bg-rose-100 w-screen min-h-screen flex justify-center content-center dark:bg-gray-900 pt-10">
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full text-2xl font-semibold text-gray-900 dark:text-white">
              Loading...
            </div>
          }
        >
          {selectedChart === "TopMakesByCity" && (
            <TopMakesByCityChart
              data={csvData}
              topCitiesCount={5}
              topMakesCount={3}
              darkMode={darkMode}
            />
          )}
          {selectedChart === "EVTypeDistribution" && (
            <EVTypeDistributionChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "AvgRangeByMake" && (
            <AvgElectricRangeByMakeChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "BaseMsrpOverYears" && (
            <BaseMsrpOverYearsChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "RangeDistribution" && (
            <RangeDistributionChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "EvAdoption" && (
            <EvAdoptionChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "MostCommonModels" && (
            <MostCommonModelsChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "CAFVEligibility" && (
            <CAFVEligibilityChart data={csvData} darkMode={darkMode} />
          )}
          {selectedChart === "EVMarketShare" && (
            <EVMarketShareChart data={csvData} darkMode={darkMode} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default App;
