/* =====================================================
   WAIT UNTIL API LOADED
===================================================== */
function waitForAPI() {
    if (
        !window.API_DATA ||
        !API_DATA.modules ||
        !API_DATA.modules.length
    ) {
        return setTimeout(waitForAPI, 300);
    }
    buildDynamicTabs();
}

function formatTitleCase(text) {
    if (!text) return "";
    const str = text.toString().toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/* =====================================================
   BUILD TABS FROM MODULES
===================================================== */
function buildDynamicTabs() {
    const tabsContainer = document.getElementById("dynamicTabs");
    const tabContentContainer = document.getElementById("dynamicTabContent");

    tabsContainer.innerHTML = "";
    tabContentContainer.innerHTML = "";

    /* ✅ MODULE → API DATA MAP */
    const moduleMap = {
        Venues: API_DATA.venues,
        Transport: API_DATA.vehicles,
        Photography: API_DATA.photographyPackages,
        Catering: API_DATA.catering,
        Makeup: API_DATA.makeupPackages,
        Ornaments: [],
        Programs: [],
        Events: []
    };

    API_DATA.modules.forEach((module, index) => {
        const moduleName = module.title;   // ✅ Always safe now
        if (!moduleName) return;

        const safeId = "tab-" + moduleName.toLowerCase().replace(/\s+/g, "-");
        const isActive = index === 0 ? "active" : "";

        /* ✅ TAB ICON IMAGE */
        const tabIcon = formatImage(module.icon);

        /* ================= TAB BUTTON ================= */
        tabsContainer.innerHTML += `
            <li class="nav-item" role="presentation">
                <button class="nav-link ${isActive}" 
                    data-bs-toggle="pill" 
                    data-bs-target="#${safeId}"
                    type="button" role="tab">

                    <img 
                        src="${tabIcon}" 
                        onerror="this.onerror=null;this.src='assets/img/fav-icon.png';"
                        style="width:16px;height:16px;margin-right:8px;vertical-align:middle;"
                    >

                    ${moduleName}
                </button>
            </li>
        `;

        /* ================= TAB CONTENT ================= */
        tabContentContainer.innerHTML += `
            <div class="tab-pane fade ${isActive ? "show active" : ""}" id="${safeId}" role="tabpanel">
                <div class="swiper home1-destination-slider mb-40 ${safeId}-swiper">
                    <div class="swiper-wrapper"></div>
                </div>
                <div class="slider-pagi-wrap">
                    <div class="home1-destination-pagi paginations"></div>
                </div>
            </div>
        `;

        renderSwiperCards(
            `.${safeId}-swiper .swiper-wrapper`,
            moduleMap[moduleName] || []
        );
    });

    initAllSwipers();
}

/* =====================================================
   CARD TEMPLATE
===================================================== */
function destinationCardTemplate(v) {

    const imagesiApp = formatImage(v.thumbnail || v.image);

    const imageTag = `
        <img 
            src="${imagesiApp}" 
            onerror="this.onerror=null;this.src='assets/img/fav-icon.png';"
            alt="image"
        >
    `;

    const rawTitle =
        v.name ||
        v.title ||
        v.venueName ||
        v.packageTitle ||
        "Premium Package";

    const formattedTitle = formatTitleCase(rawTitle); // ✅ FIX APPLIED HERE

    return `
    <div class="swiper-slide">
        <div class="destination-card">
            <a href="#" class="destination-img">
                ${imageTag}
            </a>
            <div class="destination-content">
                <a href="#" class="title-area">
                    ${formattedTitle}
                </a>
                <div class="content">
                    <p>${formatTitleCase(v.description || "Professional service available")}</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

/* =====================================================
   RENDER DATA INTO SWIPER
===================================================== */
// function renderSwiperCards(wrapperSelector, data) {
//     const wrapper = document.querySelector(wrapperSelector);
//     if (!wrapper) return;

//     wrapper.innerHTML = "";

//     if (!data || !data.length) {
//         wrapper.innerHTML = `
//             <div class="swiper-slide d-flex justify-content-center align-items-center">
//                 <p style="padding:20px">No data available</p>
//             </div>
//         `;
//         return;
//     }

//     /* ✅ ONLY 4 PER SLIDER ROW VISUALLY (Swiper Handles It) */
//     data.slice(0, 12).forEach(item => {
//         wrapper.innerHTML += destinationCardTemplate(item);
//     });
// }

function renderSwiperCards(wrapperSelector, data) {
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    wrapper.innerHTML = "";

    if (!data || !data.length) {
        wrapper.innerHTML = `
            <div class="swiper-slide d-flex justify-content-center align-items-center">
                <p style="padding:20px">No data available</p>
            </div>
        `;
        return;
    }

    /* ✅ FILTER ONLY TOP PICKS */
    const topPickData = data.filter(item => item.isTopPick === true);

    if (!topPickData.length) {
        wrapper.innerHTML = `
            <div class="swiper-slide d-flex justify-content-center align-items-center">
                <p style="padding:20px">No Top Picks available</p>
            </div>
        `;
        return;
    }

    /* ✅ SHOW ONLY TOP PICKS (MAX 12) */
    topPickData.slice(0, 12).forEach(item => {
        wrapper.innerHTML += destinationCardTemplate(item);
    });
}


/* =====================================================
   INITIALIZE ALL SWIPERS
===================================================== */
function initAllSwipers() {
    document.querySelectorAll(".home1-destination-slider").forEach(swiperEl => {
        new Swiper(swiperEl, {
            slidesPerView: 4,
            spaceBetween: 25,
            loop: true,
            pagination: {
                el: swiperEl.parentElement.querySelector(".paginations"),
                clickable: true,
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                576: { slidesPerView: 2 },
                992: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
            }
        });
    });
}

/* =====================================================
   START AFTER API LOAD
===================================================== */
waitForAPI();
