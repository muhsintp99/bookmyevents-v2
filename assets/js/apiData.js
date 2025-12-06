// -------------------------  with out athu  ------------------------------ //
/* =====================================================
   GLOBAL DATA OBJECT (Accessible Everywhere)
===================================================== */
window.API_DATA = {
    zone: [],
    modules: [],
    secondarymodules: [],
    venues: [],
    categories: [],
    banners: [],
    vehicles: [],
    catering: [],
    makeupPackages: [],
    photographyPackages: [],
};

/* =====================================================
   BASE URLS
===================================================== */
const API_BASE_URL = "https://api.bookmyevent.ae/api";
const API_BASE_IMG = "https://api.bookmyevent.ae";
const API_GOOGLE_API = "https://api.bookmyevent.ae";

/* =====================================================
   FORMAT IMAGE (Always Returns Correct Image URL)
===================================================== */
function formatImage(path) {
    if (!path) return "assets/img/fav-icon.png";

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
            categoriesJson,
            bannersJson,
            vehiclesJson,
            cateringJson,
            makeupJson,
            photographyJson,
        ] = await Promise.all([
            fetchJSON("/zones"),
            fetchJSON("/modules"),
            fetchJSON("/secondary-modules"),
            fetchJSON("/venues"),
            fetchJSON("/categories"),
            fetchJSON("/banners"),
            fetchJSON("/vehicles"),
            fetchJSON("/catering"),
            fetchJSON("/makeup-packages"),
            fetchJSON("/photography-packages"),
        ]);

        /* ===============================
           STORE CLEAN DATA SAFELY
        =============================== */
        window.API_DATA.zone = zoneJson.data || zoneJson || [];
        window.API_DATA.modules = modulesJson.data || modulesJson || [];
        window.API_DATA.secondarymodules = secondaryJson.data || secondaryJson || [];

        window.API_DATA.venues = venuesJson.data || [];

        window.API_DATA.categories = categoriesJson.data || [];
        window.API_DATA.banners = bannersJson?.data?.banners || [];

        window.API_DATA.vehicles = vehiclesJson.data || [];
        window.API_DATA.catering = cateringJson.data || [];

        window.API_DATA.makeupPackages = makeupJson.data || [];
        window.API_DATA.photographyPackages = photographyJson.data || [];

        console.log("✅ API Loaded Successfully:", window.API_DATA);

    } catch (error) {
        console.error("❌ Error loading API:", error);
    }
}

/* =====================================================
   AUTO LOAD WHEN FILE IS INCLUDED
===================================================== */
loadAllData();
