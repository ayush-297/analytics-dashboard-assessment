import Papa from 'papaparse';

const fetchParseData = async () => {
    try {
      const response = await fetch('/data-to-visualize/Electric_Vehicle_Population_Data.csv');
      const text = await response.text();
      
      // Promisify Papa.parse
      const result = await new Promise((resolve, reject) => {
        Papa.parse(text, {
          complete: (result) => resolve(result), // Resolve the promise with the result
          error: (error) => reject(error), // Reject the promise if there's an error
          header: true, // Treat the first row as headers
          skipEmptyLines: true, // Skip empty lines
          dynamicTyping: true, // Automatically type numbers, booleans, etc.
          quoteChar: '"',
          delimiter: ',', // Default delimiter
        });
      });

      // console.log('Parsed CSV data:', result.data);
      return result.data; // Return the parsed data
    } catch (error) {
      console.error('Error fetching or parsing CSV data:', error);
      throw error;
    }
  };
  

export default fetchParseData;