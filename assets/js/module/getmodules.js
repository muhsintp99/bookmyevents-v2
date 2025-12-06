/* =====================================================
   LOAD MENU (Main Services + Other Services)
===================================================== */
function loadMenu() {
    const mainMenu = document.getElementById("mainServicesMenu");
    const moreMenu = document.getElementById("moreSolutionsMenu");

    if (!mainMenu || !moreMenu) return;

    if (window.API_DATA.modules.length === 0 || window.API_DATA.secondarymodules.length === 0) {
        return setTimeout(loadMenu, 200);
    }

    const modules = window.API_DATA.modules;
    const secondary = window.API_DATA.secondarymodules;

    // Main Services Menu
    mainMenu.innerHTML = modules.map(m => `
        <li>
            <a href="packages.html?id=${m._id}">
                <img src="${formatImage(m.icon)}" alt="${m.title}" style="width: 16px; height: 16px; object-fit: cover; margin-right: 8px; border-radius: 50%;"> 
                ${m.title}
            </a>
        </li>
    `).join("");

    // Other Services Menu
    moreMenu.innerHTML = secondary.map(s => `
        <li>
            <a href="packages.html?id=${s._id}">
                <img src="${formatImage(s.icon)}" alt="${s.title}" style="width: 16px; height: 16px; object-fit: cover; margin-right: 8px; border-radius: 50%;"> 
                ${s.title}
            </a>
        </li>
        
    `).join("");

    console.log("📌 Menu Loaded Successfully");
}

setTimeout(loadMenu, 500); // Give data time to load

/* =====================================================
   DEBUG LOGS
===================================================== */
console.log("📡 API:", API_BASE_URL);
console.log("📡 Image Base:", API_BASE_IMG);


// -------------------------  in home   ------------------------------ //
// -------------------------  in marquee   ------------------------------ //

function loadModulesMarquee() {
    const marquee = document.getElementById("mainServicesMarquee");
    const marqueeClone = document.getElementById("mainServicesMarqueeClone");

    if (!marquee || !marqueeClone) return;

    // Wait for modules to be loaded
    if (API_DATA.modules.length === 0) {
        return setTimeout(loadModulesMarquee, 200);
    }

    const modules = API_DATA.modules;

    const html = modules.map(m => `
        <a href="packages.html?id=${m._id}" class="module-item">
            <img src="${formatImage(m.icon)}" alt="${m.title}" >
            <span>${m.title}</span>
        </a>
    `).join("");

    marquee.innerHTML = html;
    marqueeClone.innerHTML = html; // Duplicate for smooth scrolling

    console.log("🎉 Modules Marquee Loaded", modules);
}

setTimeout(loadModulesMarquee, 600);


// -------------------------  in footer   ------------------------------ //

function loadSecondaryModulesMarquee() {
    const smarquee = document.getElementById("secondaryServicesMarquee");
    const smarqueeClone = document.getElementById("secondaryServicesMarqueeClone");

    if (!smarquee || !smarqueeClone) return;

    // Wait for modules to be loaded
    if (API_DATA.secondarymodules.length === 0) {
        return setTimeout(loadSecondaryModulesMarquee, 200);
    }

    const modules = API_DATA.secondarymodules;

    const html = modules.map(s => `
        <a href="packages.html?id=${s._id}" class="module-item">
            <img src="${formatImage(s.icon)}" alt="${s.title}" >
            <span>${s.title}</span>
        </a>
    `).join("");

    smarquee.innerHTML = html;
    smarqueeClone.innerHTML = html;

    console.log("🎉 Secondary Modules Marquee Loaded", modules);
}

setTimeout(loadSecondaryModulesMarquee, 600);


// -------------------------  in footer   ------------------------------ //

function loadFooterMainServices() {
    const footerList = document.getElementById("footerMainServices");
    if (!footerList) return;

    // Wait until modules data is loaded
    if (API_DATA.modules.length === 0) {
        return setTimeout(loadFooterMainServices, 200);
    }

    const modules = API_DATA.modules;

    footerList.innerHTML = modules.map(m => `
        <li>
            <a href="packages.html?id=${m._id}">
                ${m.title}
            </a>
        </li>
    `).join("");

    console.log("📌 Footer Main Services Loaded");
}

setTimeout(loadFooterMainServices, 500);

// -------------------------  in footer  secondary services   ------------------------------ //

function loadFooterSecondaryServices() {
    const footerList = document.getElementById("footerMoreSolutions");
    if (!footerList) return;

    // Wait until secondary modules are loaded
    if (API_DATA.secondarymodules.length === 0) {
        return setTimeout(loadFooterSecondaryServices, 200);
    }

    const secondary = API_DATA.secondarymodules;

    footerList.innerHTML = secondary.map(s => `
        <li>
            <a href="packages.html?id=${s._id}">
                ${s.title}
            </a>
        </li>
    `).join("");

    console.log("📌 Footer Secondary Services Loaded");
}

setTimeout(loadFooterSecondaryServices, 500);

// -------------------------------------------------------------- //----------------
// -------------------------  in filtering home page   ------------------------------ //

// function loadFilterModules() {
//     const filterList = document.getElementById("filterList");
//     if (!filterList) return;

//     // Wait for modules to load
//     if (API_DATA.modules.length === 0) {
//         return setTimeout(loadFilterModules, 200);
//     }

//     // Map API title → Display title
//     const filterMap = {
//         "Venues": "Venues",
//         "Photography": "Photography",
//         "Makeup": "Makeup",
//         "Catering": "Catering"
//     };

//     // Create dynamic filter list
//     const html = API_DATA.modules
//         .filter(m => filterMap[m.title]) // only keep the 4 needed modules
//         .map(m => `
//             <li class="single-item">
//                 <img src="${formatImage(m.icon)}" width="24" height="24" alt="${filterMap[m.title]}">
//                 <span>${filterMap[m.title]}</span>
//             </li>
//         `)
//         .join("");

//     filterList.innerHTML = html;

//     console.log("📌 Filter Modules Loaded:", API_DATA.modules);
// }

// setTimeout(loadFilterModules, 500);

/* ================= GLOBAL CATEGORY STATE ================= */
let SELECTED_CATEGORY = { id: null, title: null };

/* ================= LOAD FILTER MODULES ================= */
function loadFilterModules() {
    const filterList = document.getElementById("filterList");
    if (!filterList) return;

    if (!window.API_DATA || !API_DATA.modules || API_DATA.modules.length === 0) {
        return setTimeout(loadFilterModules, 200);
    }

    const filterMap = {
        "Venues": "Venues",
        "Photography": "Photography",
        "Makeup Artist": "Makeup",
        "Catering": "Catering"
    };

    const html = API_DATA.modules
        .filter(m => filterMap[m.title])
        .map((m, index) => `
            <li class="single-item ${index === 0 ? 'active' : ''}" 
                data-id="${m._id}" 
                data-title="${m.title}">
                <img src="${formatImage(m.icon)}">
                <span>${filterMap[m.title]}</span>
            </li>
        `)
        .join("");

    filterList.innerHTML = html;

    const firstModule = filterList.querySelector(".single-item");
    if (firstModule) {
        loadCategoriesByModule(firstModule.dataset.id);
    }
}
setTimeout(loadFilterModules, 500);

/* ================= MODULE CLICK ================= */
document.addEventListener("click", function (e) {
    const item = e.target.closest("#filterList .single-item");
    if (!item) return;

    document.querySelectorAll("#filterList .single-item")
        .forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    loadCategoriesByModule(item.dataset.id);
});

/* ================= CATEGORY API ================= */
async function loadCategoriesByModule(moduleId) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/modules/${moduleId}`);

        

        console.log("📡 Category API Response:", res);
        console.log(res);
        const data = await res.json();

        const list = document.querySelector(".option-list");
        list.innerHTML = "";

        data.forEach(cat => {
            list.innerHTML += `
                <li class="single-item" data-id="${cat._id}">
                    <h6>${cat.title}</h6>
                </li>
            `;
        });

    } catch (err) {
        console.error("❌ Category Load Failed:", err);
    }
}

/* ================= ZONES LOAD ================= */
function loadZones() {
    const zoneList = document.querySelector(".option-list-destination");
    if (!zoneList || !API_DATA.zone) return;

    let html = `
        <li class="btn" id="getLocationBtn">
            <div class="destination"><h6>Get Location</h6></div>
        </li>
    `;

    API_DATA.zone.forEach(z => {
        html += `
            <li class="zone-item" data-zone="${z.name}">
                <div class="destination"><h6>${z.name}</h6></div>
            </li>
        `;
    });

    zoneList.innerHTML = html;
}
loadZones();

/* ================= GOOGLE LOCATION ================= */
document.addEventListener("click", function (e) {
    if (!e.target.closest("#getLocationBtn")) return;

    navigator.geolocation.getCurrentPosition(position => {
        document.querySelector(".destination-dropdown input").value =
            `Lat:${position.coords.latitude.toFixed(4)}, Lng:${position.coords.longitude.toFixed(4)}`;
    });
});

/* ================= ZONE SELECT ================= */
document.addEventListener("click", function (e) {
    const zone = e.target.closest(".zone-item");
    if (!zone) return;
    document.querySelector(".destination-dropdown input").value = zone.dataset.zone;
});

/* ================= CATEGORY SELECT ================= */
document.addEventListener("click", function (e) {
    const cat = e.target.closest(".option-list .single-item");
    if (!cat) return;

    SELECTED_CATEGORY.id = cat.dataset.id;
    SELECTED_CATEGORY.title = cat.querySelector("h6").innerText;

    document.querySelector(".custom-select-dropdown span").innerText =
        SELECTED_CATEGORY.title;
});

/* ================= FINAL SEARCH ================= */
// document.querySelector(".filter-input").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const destination = document.querySelector(".destination-dropdown input").value;
//     const date = document.querySelector("[name='inOut']").value;
//     const activeModule = document.querySelector("#filterList .active");

//     console.clear();
//     console.log("✅ FINAL SEARCH DATA");
//     console.log("📍 Destination:", destination);
//     console.log("📅 Date:", date);
//     console.log("📂 Category:", SELECTED_CATEGORY.title);
//     console.log("🆔 Category ID:", SELECTED_CATEGORY.id);
//     console.log("🧩 Module:", activeModule.dataset.title);
//     console.log("🆔 Module ID:", activeModule.dataset.id);
// });


const filterForm = document.querySelector(".filter-input");
if (filterForm) {
    filterForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const destination = document.querySelector(".destination-dropdown input").value;
        const date = document.querySelector("[name='inOut']").value;
        const activeModule = document.querySelector("#filterList .active");

        console.log("FINAL SEARCH:");
        console.log(destination, date, activeModule?.dataset?.title);
    });
}
