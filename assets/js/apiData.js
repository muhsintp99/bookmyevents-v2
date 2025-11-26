// // ------------------------------
// // GLOBAL VARIABLES
// // ------------------------------
// window.API = {
//   user: null,     // logged user
//   token: null,    // JWT token
//   data: {         // all fetched data
//     venues: [],
//     packages: [],
//     categories: [],
//     banners: [],
//     vehicles: [],
//     catering: [],
//   }
// };

// const API_BASE_URL = "https://api.bookmyevent.ae/api";

// // ---------------------------------------------------
// // LOAD TOKEN FROM LOCAL STORAGE (AUTO LOGIN SUPPORT)
// // ---------------------------------------------------
// (function initAuth() {
//   const savedToken = localStorage.getItem("bme_token");
//   const savedUser = localStorage.getItem("bme_user");

//   if (savedToken) window.API.token = savedToken;
//   if (savedUser) window.API.user = JSON.parse(savedUser);
// })();

// // ---------------------------------------------------
// // UNIVERSAL REQUEST HANDLER WITH AUTH SUPPORT
// // ---------------------------------------------------
// async function apiRequest(endpoint, method = "GET", body = null) {
//   const headers = { "Content-Type": "application/json" };

//   if (window.API.token) {
//     headers["Authorization"] = `Bearer ${window.API.token}`;
//   }

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//   });

//   if (!res.ok) {
//     throw new Error(`API Error: ${res.status} ${res.statusText}`);
//   }

//   return res.json();
// }

// // ---------------------------------------------------
// // LOGIN FUNCTION
// // ---------------------------------------------------
// window.API.login = async function (email, password) {
//   try {
//     const data = await apiRequest("/auth/login", "POST", { email, password });

//     // Store token & user
//     window.API.token = data.token;
//     window.API.user = data.user;

//     localStorage.setItem("bme_token", data.token);
//     localStorage.setItem("bme_user", JSON.stringify(data.user));

//     console.log("✅ Logged in:", data.user);
//     return data.user;

//   } catch (error) {
//     console.error("❌ Login Failed:", error);
//     throw error;
//   }
// };

// // ---------------------------------------------------
// // LOGOUT FUNCTION
// // ---------------------------------------------------
// window.API.logout = function () {
//   window.API.token = null;
//   window.API.user = null;
//   localStorage.removeItem("bme_token");
//   localStorage.removeItem("bme_user");
//   console.log("🚪 Logged out");
// };

// // ---------------------------------------------------
// // LOAD ALL PUBLIC DATA
// // ---------------------------------------------------
// window.API.loadAllData = async function () {
//   try {
//     console.log("📡 Fetching all public API data...");

//     const [
//       venues,
//       packages,
//       categories,
//       banners,
//       vehicles,
//       catering,
//     ] = await Promise.all([
//       apiRequest("/venues"),
//       apiRequest("/packages"),
//       apiRequest("/categories"),
//       apiRequest("/banners"),
//       apiRequest("/vehicles"),
//       apiRequest("/catering"),
//     ]);

//     window.API.data.venues = venues;
//     window.API.data.packages = packages;
//     window.API.data.categories = categories;
//     window.API.data.banners = banners;
//     window.API.data.vehicles = vehicles;
//     window.API.data.catering = catering;

//     console.log("✅ All data loaded");
//   } catch (error) {
//     console.error("❌ Error loading data:", error);
//   }
// };

// // Auto-load public data on page load
// window.API.loadAllData();


// -------------------------  with out athu  ------------------------------ //
/* =====================================================
   GLOBAL DATA OBJECT (Accessible Everywhere)
===================================================== */
window.API_DATA = {
    zone: [],
    modules: [],
    secondarymodules: [],
    venues: [],
    packages: [],
    categories: [],
    banners: [],
    vehicles: [],
    catering: [],
};

/* =====================================================
   BASE URLS
===================================================== */
const API_BASE_URL = "https://api.bookmyevent.ae/api";
const API_BASE_IMG = "https://api.bookmyevent.ae";

/* =====================================================
   FORMAT IMAGE (Always Returns Correct Image URL)
===================================================== */
function formatImage(path) {

    if (!path) return "assets/img/default.png"; // fallback icon/image

    if (path.startsWith("http")) return path;

    if (path.startsWith("/var/www/backend/")) {
        path = path.replace("/var/www/backend/", "");
    }

    path = path.replace(/^\//, "");

    return `${API_BASE_IMG}/${path}`;
}

/* =====================================================
   UNIVERSAL FETCH
===================================================== */
async function fetchJSON(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`API Error: ${endpoint}`);

    return res.json();
}

/* =====================================================
   LOAD ALL DATA (Modules, Venues, Packages, etc)
===================================================== */
async function loadAllData() {
    try {
        const [
            zoneJson,
            modulesJson,
            secondaryJson,
            venuesJson,
            packagesJson,
            categoriesJson,
            bannersJson,
            vehiclesJson,
            cateringJson,
        ] = await Promise.all([
            fetchJSON("/zones"),
            fetchJSON("/modules"),
            fetchJSON("/secondary-modules"),
            fetchJSON("/venues"),
            fetchJSON("/packages"),
            fetchJSON("/categories"),
            fetchJSON("/banners"),
            fetchJSON("/vehicles"),
            fetchJSON("/catering"),
        ]);

        // Store clean data (your API's structure)
        window.API_DATA.zone = zoneJson.data || zoneJson || [];
        window.API_DATA.modules = modulesJson || [];
        window.API_DATA.secondarymodules = secondaryJson || [];

        window.API_DATA.venues = venuesJson.data || [];
        window.API_DATA.packages = packagesJson.data || [];
        window.API_DATA.categories = categoriesJson.data || [];

        window.API_DATA.banners = bannersJson?.data?.banners || [];

        window.API_DATA.vehicles = vehiclesJson.data || [];
        window.API_DATA.catering = cateringJson.data || [];

        console.log("✅ API Loaded Successfully", window.API_DATA);

    } catch (error) {
        console.error("❌ Error loading API:", error);
    }
}

loadAllData();

