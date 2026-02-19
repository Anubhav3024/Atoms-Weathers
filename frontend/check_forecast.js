const axios = require("axios");

const testForecast = async () => {
  try {
    const lat = 51.5074;
    const lon = -0.1278;
    const url = `http://localhost:5000/api/forecast?lat=${lat}&lon=${lon}`;

    console.log(`Testing Forecast URL: ${url}`);

    const response = await axios.get(url);
    console.log("Forecast Response Status:", response.status);
    console.log(
      "Forecast Response Items:",
      response.data.list ? response.data.list.length : 0,
    );
    console.log("✅ Forecast endpoint is working correctly.");
  } catch (error) {
    console.log("❌ Forecast Verification Failed.");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else {
      console.log("Error:", error.message);
    }
  }
};

testForecast();
