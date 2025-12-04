/* =====================================================
   ✅ INJECT CHECKOUT CSS FROM JS
===================================================== */
(function injectCheckoutCSS() {
    const css = `
    :root {
        --main-color: #eb2b2b;
    }

    .primary-btn1 {
        background: var(--main-color);
        color: #fff;
        border-radius: 8px;
        border: none;
    }

    /* ===============================
       PREFERENCE ICONS
    ================================= */
    .choose-Preference-method ul {
        display: flex;
        gap: 15px;
    }

    .choose-Preference-method li {
        width: 80px;
        height: 80px;
        border: 2px solid #eee;
        border-radius: 12px;
        cursor: pointer;
        position: relative;
        transition: 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .choose-Preference-method li.active {
        border-color: var(--main-color);
    }

    .choose-Preference-method .checked {
        position: absolute;
        top: 6px;
        right: 6px;
        background: var(--main-color);
        color: #fff;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 12px;
    }

    /* ===============================
       MENU CARDS
    ================================= */
    .menu-card {
        border: 2px solid #eee;
        border-radius: 12px;
        cursor: pointer;
        transition: 0.25s;
        position: relative;
        padding: 5px;
    }

    .menu-card.active {
        border-color: var(--main-color);
    }

    .menu-card .checked {
        position: absolute;
        top: 6px;
        right: 6px;
        background: var(--main-color);
        color: #fff;
        border-radius: 50%;
        padding: 2px 6px;
    }

    /* ===============================
       ORDER SUMMARY
    ================================= */
    .order-sum-area ul {
        padding: 0;
        list-style: none;
    }

    .order-sum-area li {
        margin-bottom: 14px;
    }

    .d-none {
        display: none !important;
    }
    `;

    const styleTag = document.createElement("style");
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
})();


/* =====================================================
   FORMAT IMAGE
===================================================== */
function formatImage(path) {
    if (!path) return "assets/img/fav-icon.png";
    if (path.startsWith("http")) return path;
    path = path.replace(/^\//, "");
    return `${API_BASE_IMG}/${path}`;
}

/* =====================================================
   GET VENUE ID FROM URL
===================================================== */
function getVenueId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* =====================================================
   FETCH VENUE DETAILS
===================================================== */
async function loadVenueDetails() {
    const id = getVenueId();
    if (!id) return;

    try {
        const res = await fetch(`${API_BASE_URL}/venues/${id}`);
        const json = await res.json();
        if (!json.success) return;

        renderVenueDetails(json.data);

    } catch (err) {
        console.error("Venue Load Error:", err);
    }
}

/* =====================================================
   RENDER VENUE DETAILS
===================================================== */
function renderVenueDetails(venue) {

    /* ✅ ORDER SUMMARY - VENUE */
    const venueItem = document.getElementById("venueSummaryItem");

    let moduleId = venue.categories?.[0]?.module?._id || null;
    let moduleTitle = venue.categories?.[0]?.module?.title || "Venues";

    venueItem.innerHTML = `
        <div class="item-area">
            <div class="main-item">
                <div class="item-img">
                    <img src="${formatImage(venue.thumbnail)}" alt="${venue.venueName}">
                </div>
                <div class="content-and-quantity">
                    <div class="content">
                        <span>${moduleTitle}</span>
                        <h6>${venue.venueName}</h6>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (moduleId) loadCategoriesByModule(moduleId);

    handlePreferenceVisibility(venue);
    handleMenuVisibility(venue.packages || []);
}

/* =====================================================
   LOAD CATEGORIES BY MODULE
===================================================== */
async function loadCategoriesByModule(moduleId) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/modules/${moduleId}`);
        const json = await res.json();
        if (!json.success) return;

        const select = document.getElementById("categorySelect");
        select.innerHTML = `<option value="">Select Category</option>`;

        json.data.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat._id;
            opt.textContent = cat.title;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error("Category Load Error:", err);
    }
}

/* =====================================================
   AC / FAN VISIBILITY
===================================================== */
function handlePreferenceVisibility(venue) {
    const ac = document.querySelector(".acAvailable");
    const fan = document.querySelector(".fanAvailable");

    if (ac) ac.style.display = venue.acAvailable ? "flex" : "none";
    if (fan) fan.style.display = venue.nonAcAvailable ? "flex" : "none";

    // Toggle Selection
    document.querySelectorAll(".Preference-option li").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".Preference-option li").forEach(li => li.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

/* =====================================================
   SHOW / HIDE & LOAD MENUS
===================================================== */
function handleMenuVisibility(packages) {
    const menuSection = document.querySelector(".choose-menu-method");
    const menuList = document.getElementById("menuList");

    if (!packages.length) {
        menuSection.style.display = "none";
        return;
    }

    menuSection.style.display = "block";
    menuList.innerHTML = "";

    packages.forEach(pkg => {
        const li = document.createElement("li");
        li.className = "menu-card";
        li.setAttribute("data-menu-id", pkg._id);

        li.innerHTML = `
            <div class="menu-content">
                <div class="item-img">
                    <img src="${formatImage(pkg.thumbnail)}">
                </div>
                <div class="menu-details">
                    <span class="menu-service">${pkg.packageType}</span>
                    <h6 class="menu-title">${pkg.title}</h6>
                    <p class="menu-type">${pkg.subtitle}</p>
                    <p class="menu-type">₹${pkg.price}</p>
                </div>
            </div>
            <div class="checked"><i class="bi bi-check"></i></div>
        `;

        menuList.appendChild(li);
    });

    initializeMenuSelection();
}

/* =====================================================
   MENU SELECTION
===================================================== */
function initializeMenuSelection() {
    const menuItems = document.querySelectorAll(".menu-card");

    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            menuItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");

            updateOrderSummaryWithMenu({
                id: this.dataset.menuId,
                title: this.querySelector(".menu-title").textContent,
                service: this.querySelector(".menu-service").textContent,
                type: this.querySelector(".menu-type").textContent,
                image: this.querySelector("img").src
            });
        });
    });
}

/* =====================================================
   UPDATE ORDER SUMMARY - MENU ONLY
===================================================== */
function updateOrderSummaryWithMenu(menuData) {
    const menuItem = document.getElementById("menuSummaryItem");
    menuItem.classList.remove("d-none");

    menuItem.innerHTML = `
        <div class="item-area">
            <div class="main-item">
                <div class="item-img">
                    <img src="${menuData.image}">
                </div>
                <div class="content-and-quantity">
                    <div class="content">
                        <span>${menuData.service}</span>
                        <h6>${menuData.title}</h6>
                        <p style="font-size:12px">${menuData.type}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener("DOMContentLoaded", loadVenueDetails);
