const axios = require("axios");

const API_URL = "http://localhost:5000/api";
const TEST_USER = `testuser_${Date.now()}`;
const TEST_PASS = "password123";

async function testPersistence() {
  console.log(`Starting Persistence Test for user: ${TEST_USER}`);

  try {
    // 1. Register
    console.log("1. Registering...");
    const regRes = await axios.post(`${API_URL}/register`, {
      username: TEST_USER,
      password: TEST_PASS,
    });
    const token = regRes.data.token;
    console.log("   ✅ Registered. Token received.");

    // 2. Add Alert
    console.log("2. Adding Alert...");
    const alertData = {
      city: "London",
      targetTime: Date.now() + 3600000,
      message: "Test Alert",
    };
    await axios.post(`${API_URL}/alerts`, { token, alert: alertData });
    console.log("   ✅ Alert added.");

    // 3. Add History
    console.log("3. Adding Search History...");
    await axios.post(`${API_URL}/history`, { token, city: "Pari" }); // Typo intentional
    await axios.post(`${API_URL}/history`, { token, city: "Paris" });
    console.log("   ✅ History added.");

    // 4. Login (Simulate new session)
    console.log("4. Logging in (New Session)...");
    const loginRes = await axios.post(`${API_URL}/login`, {
      username: TEST_USER,
      password: TEST_PASS,
    });
    const userData = loginRes.data.user;

    // 5. Verify Data
    console.log("5. Verifying Data...");

    if (userData.alerts.length > 0 && userData.alerts[0].city === "London") {
      console.log("   ✅ Alert persisted correctly.");
    } else {
      console.error("   ❌ Alert NOT found:", userData.alerts);
    }

    if (
      userData.searchHistory.length === 2 &&
      userData.searchHistory[0].city === "Paris"
    ) {
      console.log("   ✅ Search History persisted correctly.");
    } else {
      console.error("   ❌ History mismatch:", userData.searchHistory);
    }
  } catch (err) {
    console.error(
      "❌ Test Failed:",
      err.response ? err.response.data : err.message,
    );
  }
}

testPersistence();
