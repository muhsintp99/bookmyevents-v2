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
            <a href="package-details.html?id=${m._id}">
                <img src="${formatImage(m.icon)}" alt="${m.title}" style="width: 16px; height: 16px; object-fit: contain; margin-right: 8px;"> 
                ${m.title}
            </a>
        </li>
    `).join("");

    // Other Services Menu
    moreMenu.innerHTML = secondary.map(s => `
        <li>
            <a href="package-details.html?id=${s._id}">
                <img src="${formatImage(s.icon)}" alt="${s.title}" style="width: 16px; height: 16px; object-fit: contain; margin-right: 8px;"> 
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
        <a href="package-details.html?id=${m._id}" class="module-item">
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
            <a href="package-details.html?id=${m._id}">
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
            <a href="package-details.html?id=${s._id}">
                ${s.title}
            </a>
        </li>
    `).join("");

    console.log("📌 Footer Secondary Services Loaded");
}

setTimeout(loadFooterSecondaryServices, 500);

// -------------------------------------------------------------- //----------------
// -------------------------  in filtering home page   ------------------------------ //

function loadFilterModules() {
    const filterList = document.getElementById("filterList");
    if (!filterList) return;

    // Wait for modules to load
    if (API_DATA.modules.length === 0) {
        return setTimeout(loadFilterModules, 200);
    }

    // Map API title → Display title
    const filterMap = {
        "Venues": "Venues",
        "Photography": "Photography",
        "Makeup": "Makeup Artists",
        "Catering": "Food & Catering"
    };

    // Create dynamic filter list
    const html = API_DATA.modules
        .filter(m => filterMap[m.title]) // only keep the 4 needed modules
        .map(m => `
            <li class="single-item">
                <img src="${formatImage(m.icon)}" width="24" height="24" alt="${filterMap[m.title]}">
                <span>${filterMap[m.title]}</span>
            </li>
        `)
        .join("");

    filterList.innerHTML = html;

    console.log("📌 Filter Modules Loaded:", API_DATA.modules);
}

setTimeout(loadFilterModules, 500);


