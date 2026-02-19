const axios = require("axios");

const API_KEY = "d3c132ff743116450217c8cd03aba613";
const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${API_KEY}`;

axios
  .get(url)
  .then((response) => {
    console.log("API Key Valid: true");
    console.log("Status:", response.status);
  })
  .catch((error) => {
    console.log("API Key Valid: false");
    console.log(
      "Error:",
      error.response ? error.response.status : error.message,
    );
  });
