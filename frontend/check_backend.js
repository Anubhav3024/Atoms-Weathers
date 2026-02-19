const axios = require("axios");

const testBackend = async () => {
  try {
    // London coordinates
    const lat = 51.5074;
    const lon = -0.1278;
    const url = `http://localhost:5000/api/weather/current?lat=${lat}&lon=${lon}`;

    console.log(`Testing Backend URL: ${url}`);

    const response = await axios.get(url);
    console.log("Backend Response Status:", response.status);
    console.log(
      "Backend Response Data:",
      JSON.stringify(response.data, null, 2).substring(0, 200) + "...",
    );
    console.log("✅ Backend is working correctly.");
  } catch (error) {
    console.log("❌ Backend Verification Failed.");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      console.log(
        "No response received (Server might be down or not reachable at localhost:5000)",
      );
      console.log("Error:", error.message);
    } else {
      console.log("Error:", error.message);
    }
  }
};

testBackend();
