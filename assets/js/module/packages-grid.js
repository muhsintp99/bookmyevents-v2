/* =====================================================
   ✅ IMAGE STYLE INJECTION (SAME HEIGHT + CENTER)
===================================================== */
(function injectPackageImageStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
        .package-img-wrap {
            width: 100%;
            height: 260px;
            overflow: hidden;
            background: #f5f5f5;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .package-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
        }
    `;
    document.head.appendChild(style);
})();

/* =====================================================
   ✅ MODULE MAP (YOUR STRUCTURE)
===================================================== */
function getModuleMap() {
    return {
        Venues: API_DATA.venues || [],
        Transport: API_DATA.vehicles || [],
        Photography: API_DATA.photographyPackages || [],
        Catering: API_DATA.catering || [],
        Makeup: API_DATA.makeupPackages || [],
        Ornaments: [],
        Programs: [],
        Events: []
    };
}

/* =====================================================
   ✅ HELPERS
===================================================== */
function truncateText(text, max = 20) {
    if (!text) return "Event Location";
    return text.length > max ? text.slice(0, max) + "..." : text;
}

function capitalizeTitle(text) {
    if (!text) return "Premium Package";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/* =====================================================
   ✅ WAIT UNTIL API LOADED
===================================================== */
function waitForPackageAPI() {
    if (!window.API_DATA || !API_DATA.modules?.length) {
        return setTimeout(waitForPackageAPI, 300);
    }
    initPackageGrid();
}
waitForPackageAPI();

/* =====================================================
   ✅ GLOBAL GRID STATE
===================================================== */
let FULL_PACKAGE_LIST = [];
let CURRENT_PAGE = 1;
const PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 6;

/* =====================================================
   ✅ INIT GRID
===================================================== */
function initPackageGrid() {
    const moduleMap = getModuleMap();
    FULL_PACKAGE_LIST = [];

    Object.values(moduleMap).forEach(list => {
        if (Array.isArray(list)) {
            FULL_PACKAGE_LIST.push(...list);
        }
    });

    renderPagination();
    renderGridPage(1);
    initDynamicFilters();
}

/* =====================================================
   ✅ GRID RENDER
===================================================== */
function renderGridPage(page) {
    const grid = document.getElementById("packageGrid");
    grid.innerHTML = "";

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageItems = FULL_PACKAGE_LIST.slice(start, end);

    if (!pageItems.length) {
        grid.innerHTML = `<div class="col-12 text-center"><p>No Packages Found</p></div>`;
        return;
    }

    pageItems.forEach(v => {
        const imageURL = formatImage(v.thumbnail || v.image);

        grid.innerHTML += `
        <div class="col-md-6 item">
            <div class="package-card">
                <div class="package-img-wrap">
                    <a href="package-details.html?id=${v._id}">
                        <img src="${imageURL}" onerror="this.onerror=null;this.src='assets/img/fav-icon.png';">
                    </a>
                </div>

                <div class="package-content">
                    <h5>
                        <a href="package-details.html?id=${v._id}">
                            ${capitalizeTitle(v.venueName || v.title || v.name)}
                        </a>
                    </h5>

                    <div class="location-and-time">
                        <div class="location">
                            <a href="#">
                                ${truncateText(v.venueAddress, 20)}
                            </a>
                        </div>
                    </div>

                    <div class="btn-and-price-area d-flex justify-content-between align-items-center">
                        <a href="package-details.html?id=${v._id}" class="primary-btn1">
                            <span>Book Now</span>
                            <span>Book Now</span>
                        </a>
                        
                    </div>
                </div>
            </div>
        </div>`;
    });
}

/* =====================================================
   ✅ SLIDING PAGINATION (123456 → 234567 → 345678)
===================================================== */
function renderPagination() {
    const totalPages = Math.ceil(FULL_PACKAGE_LIST.length / PER_PAGE);
    const pagination = document.querySelector(".paginations");
    pagination.innerHTML = "";

    let startPage = Math.max(1, CURRENT_PAGE - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = startPage + MAX_VISIBLE_PAGES - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === CURRENT_PAGE ? "active" : ""}">
                <a href="#" onclick="goToPage(${i})">${String(i).padStart(2, "0")}</a>
            </li>
        `;
    }

    document.querySelector(".paginations-button:first-child a")?.addEventListener("click", e => {
        e.preventDefault();
        if (CURRENT_PAGE > 1) goToPage(CURRENT_PAGE - 1);
    });

    document.querySelector(".paginations-button:last-child a")?.addEventListener("click", e => {
        e.preventDefault();
        if (CURRENT_PAGE < totalPages) goToPage(CURRENT_PAGE + 1);
    });
}

function goToPage(page) {
    const totalPages = Math.ceil(FULL_PACKAGE_LIST.length / PER_PAGE);
    if (page < 1 || page > totalPages) return;

    CURRENT_PAGE = page;
    renderGridPage(page);
    renderPagination();
}

/* =====================================================
   ✅ FIXED FILTER SYSTEM (MODULE + CATEGORY WITH TOGGLE)
===================================================== */
function initDynamicFilters() {
    const filters = document.getElementById("dynamicFilters");
    filters.innerHTML = "";

    if (!API_DATA.modules.length || !API_DATA.categories.length) {
        filters.innerHTML = `<li>No Filters Available</li>`;
        return;
    }

    API_DATA.modules.forEach(module => {

        // ✅ MATCH CATEGORIES USING module._id
        const relatedCats = API_DATA.categories.filter(
            cat => String(cat.moduleId) === String(module._id)
        );

        filters.innerHTML += `
        <li class="sidebar-category-dropdown">

            <!-- ✅ MODULE CHECKBOX -->
            <label class="containerss module-label">
                <input type="checkbox" class="module-filter" value="${module.title}">
                <span class="checkmark"></span>
                <strong>${module.title}</strong>
            </label>

            <!-- ✅ SUB CATEGORIES (HIDDEN BY DEFAULT) -->
            <ul class="sub-category" style="display:none;">
                ${
                    relatedCats.length
                        ? relatedCats.map(cat => `
                            <li>
                                <label class="containerss">
                                    <input type="checkbox" 
                                           class="category-filter" 
                                           value="${cat._id}">
                                    <span class="checkmark"></span>
                                    <strong>${cat.title}</strong>
                                </label>
                            </li>
                        `).join("")
                        : `<li><small style="opacity:.6">No Categories</small></li>`
                }
            </ul>

            <!-- ✅ TOGGLE ICON -->
            <i class="bi bi-caret-right-fill sidebar-category-icon"></i>
        </li>`;
    });

    /* =====================================================
       ✅ TOGGLE SHOW / HIDE CATEGORY ON CLICK
    ===================================================== */
    document.querySelectorAll(".sidebar-category-icon").forEach(icon => {
        icon.addEventListener("click", function () {

            const parent = this.closest(".sidebar-category-dropdown");
            const sub = parent.querySelector(".sub-category");

            // ✅ TOGGLE
            document.querySelectorAll(".sub-category").forEach(el => {
                if (el !== sub) el.style.display = "none"; // close others
            });

            sub.style.display = sub.style.display === "block" ? "none" : "block";
        });
    });

    initFilterLogic();
}


/* =====================================================
   ✅ APPLY FILTER LOGIC
===================================================== */
function initFilterLogic() {

    document.querySelectorAll(".module-filter, .category-filter").forEach(cb => {
        cb.addEventListener("change", applyFilters);
    });

    document.getElementById("clear-filters")?.addEventListener("click", () => {
        document.querySelectorAll("#dynamicFilters input").forEach(i => i.checked = false);
        initPackageGrid();
    });
}

function applyFilters() {
    const selectedModules = [...document.querySelectorAll(".module-filter:checked")].map(i => i.value);
    const selectedCategories = [...document.querySelectorAll(".category-filter:checked")].map(i => i.value);

    const moduleMap = getModuleMap();
    let filtered = [];

    if (selectedModules.length) {
        selectedModules.forEach(mod => {
            if (moduleMap[mod]) filtered.push(...moduleMap[mod]);
        });
    } else {
        Object.values(moduleMap).forEach(list => filtered.push(...list));
    }

    if (selectedCategories.length) {
        filtered = filtered.filter(item =>
            selectedCategories.includes(String(item.categoryId))
        );
    }

    FULL_PACKAGE_LIST = filtered;
    CURRENT_PAGE = 1;
    renderPagination();
    renderGridPage(1);
}
/* ===================================================== 
    ✅ IMAGE STYLE INJECTION (SAME HEIGHT + CENTER)
===================================================== */    