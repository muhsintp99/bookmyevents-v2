// js/commonApi.js

// 🔗 Your API Base URL
const API = axios.create({
  baseURL: "https://api.bookmyevent.ae/api",
  timeout: 10000,
});

const IMAGE = "https://api.bookmyevent.ae/";

// ⭐ Optional: Default Headers
API.defaults.headers.common["Content-Type"] = "application/json";

// ⭐ If you need login token in future
// API.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

console.log("Common API initialized.");
console.log("Common API :",API );
console.log("Image Base URL :",IMAGE );