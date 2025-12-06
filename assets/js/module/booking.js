/* ======================================================
   GLOBAL VARIABLES
====================================================== */
let venueData = null;
let selectedMenuPrice = 0;
let selectedPackageId = null;
let selectedSession = "";
let selectedPreference = "AC";
let discountApplied = 0;

/* ======================================================
   GET ID FROM URL
====================================================== */
function getVenueId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* ======================================================
   IMAGE FORMATTER
====================================================== */
function formatImage(path) {
    if (!path) return "assets/img/fav-icon.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("/var/www/backend/")) {
        path = path.replace("/var/www/backend/", "");
    }
    return `${API_BASE_IMG}/${path.replace(/^\/+/, "")}`;
}

/* ======================================================
   LOAD VENUE DETAILS
====================================================== */
async function loadVenueDetails() {
    const id = getVenueId();
    if (!id) return;

    try {
        const res = await fetch(`${API_BASE_URL}/venues/${id}`);
        const json = await res.json();
        if (!json.success) return;

        venueData = json.data;
        renderVenue(venueData);
    } catch (err) {
        console.error("❌ API Error:", err);
    }
}

/* ======================================================
   FLATPICKR CALENDAR
====================================================== */
function setupFlatpickrCalendar(pricingSchedule) {
    if (!pricingSchedule) return;

    const allowedDays = [];

    Object.keys(pricingSchedule).forEach(day => {
        if (pricingSchedule[day]?.morning || pricingSchedule[day]?.evening) {
            allowedDays.push(day.toLowerCase());
        }
    });

    document.getElementById("dateHint").innerText =
        "Available Days: " + allowedDays.join(", ");

    flatpickr("#eventDate", {
        dateFormat: "d-M-Y",
        minDate: "today",
        disable: [
            date => !allowedDays.includes(
                date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
            )
        ],
        defaultDate: "today",
        onChange: () => calculateTotal()
    });
}

/* ======================================================
   RENDER VENUE INFO
====================================================== */
function renderVenue(venue) {
    const venueItem = document.getElementById("venueSummaryItem");
    if (!venueItem) return;

    const categoryTitle = venue.categories?.[0]?.title || "Venue";

    venueItem.innerHTML = `
        <div class="item-area">
            <div class="main-item">
                <div class="item-img">
                    <img src="${formatImage(venue.thumbnail)}">
                </div>
                <div class="content-and-quantity">
                    <div class="content">
                        <span>${categoryTitle}</span>
                        <h6>${venue.venueName}</h6>
                    </div>
                </div>
            </div>
        </div>
    `;

    handlePreferenceVisibility(venue);
    handleMenuVisibility(venue.packages || []);
    setupFlatpickrCalendar(venue.pricingSchedule);
}

/* ======================================================
   AC / NON-AC OPTION
====================================================== */
function handlePreferenceVisibility(venue) {
    const ac = document.querySelector(".acAvailable");
    const fan = document.querySelector(".fanAvailable");

    if (ac) ac.style.display = venue.acAvailable ? "flex" : "none";
    if (fan) fan.style.display = venue.nonAcAvailable ? "flex" : "none";

    document.querySelectorAll(".Preference-option li").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".Preference-option li").forEach(li => li.classList.remove("active"));
            this.classList.add("active");

            selectedPreference = this.classList.contains("acAvailable") ? "AC" : "NON-AC";
            calculateTotal();
        });
    });
}

/* ======================================================
   LOAD PACKAGES (MENU)
====================================================== */
function handleMenuVisibility(packages) {
    const menuSection = document.querySelector(".choose-menu-method");
    const menuList = document.getElementById("menuList");

    if (!packages.length) {
        menuSection.style.display = "none";
        return;
    }

    menuList.innerHTML = "";

    packages.forEach(pkg => {
        const li = document.createElement("li");
        li.className = "menu-card";
        li.dataset.price = pkg.price;
        li.dataset.id = pkg._id; // IMPORTANT

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

    activateMenuSelection();
}

/* ======================================================
   WHEN USER SELECTS MENU
====================================================== */
function activateMenuSelection() {
    const menuCards = document.querySelectorAll(".menu-card");

    menuCards.forEach(card => {
        card.addEventListener("click", function () {
            menuCards.forEach(c => c.classList.remove("active"));
            this.classList.add("active");

            selectedMenuPrice = parseFloat(this.dataset.price || 0);
            selectedPackageId = this.dataset.id;

            // Safe summary update
            const imgEl = document.getElementById("summaryImg");
            const serviceEl = document.getElementById("summaryService");
            const titleEl = document.getElementById("summaryTitle");

            if (imgEl) imgEl.src = this.querySelector("img").src;
            if (serviceEl) serviceEl.innerText = this.querySelector(".menu-service").innerText;
            if (titleEl) titleEl.innerText = this.querySelector(".menu-title").innerText;

            document.getElementById("menuError").style.display = "none";

            calculateTotal();
        });
    });
}

/* ======================================================
   SESSION SELECTION
====================================================== */
document.querySelectorAll(".session-check").forEach((check, index) => {
    check.addEventListener("change", function () {
        document.querySelectorAll(".session-check").forEach(c => (c.checked = false));
        this.checked = true;

        selectedSession = index === 0 ? "morning" : "evening";
        calculateTotal();
    });
});

/* ======================================================
   TOTAL PRICE CALCULATION
====================================================== */
function calculateTotal() {
    if (!venueData) return;

    const guest = parseInt(document.getElementById("guestCount").value || 1);
    const date = document.getElementById("eventDate").value;
    if (!date || !selectedSession) return;

    const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const pricing = venueData.pricingSchedule?.[day]?.[selectedSession];

    if (!pricing) {
        document.getElementById("totalAmount").innerText = "0.00";
        return;
    }

    let venueCost = pricing.perDay || 10000;
    let menuCost = selectedMenuPrice * guest;
    let total = venueCost + menuCost;

    if (venueData.discount?.packageDiscount) {
        total -= (total * venueData.discount.packageDiscount / 100);
    }

    if (discountApplied > 0) {
        total -= (total * discountApplied / 100);
    }

    document.getElementById("totalAmount").innerText = total.toFixed(2);
}

/* ======================================================
   COUPON APPLY
====================================================== */
document.querySelector(".apply-btn")?.addEventListener("click", function () {
    const code = document.getElementById("couponInput").value.trim();

    if (code === "SAVE10") {
        discountApplied = 10;
        alert("✅ 10% Discount Applied");
    } else {
        discountApplied = 0;
        alert("❌ Invalid Coupon");
    }

    calculateTotal();
});

/* ======================================================
   PLACE ORDER (CREATE BOOKING)
====================================================== */
document.getElementById("placeOrderBtn")?.addEventListener("click", async function (e) {
    e.preventDefault();

    const userData = localStorage.getItem("user");
    if (!userData) {
        const modal = new bootstrap.Modal(document.getElementById("loginRequiredModal"));
        modal.show();
        return;
    }

    const form = document.getElementById("checkoutForm");
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        scrollToFirstError();
        return;
    }

    if (!selectedSession) return alert("❌ Select Morning or Evening");
    if (!selectedPackageId) {
        document.getElementById("menuError").style.display = "block";
        return;
    }

    const user = JSON.parse(userData);

    const date = document.getElementById("eventDate").value;
    const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const pricing = venueData.pricingSchedule?.[day]?.[selectedSession];

    const orderData = {
        moduleType: "Venues",
        moduleId: venueData.moduleId,
        venueId: venueData._id,
        packageId: selectedPackageId,
        providerId: venueData.vendorId,
        userId: user._id,

        fullName: document.getElementById("fullName").value,
        contactNumber: document.getElementById("phoneNumber").value,
        emailAddress: document.getElementById("email").value,

        numberOfGuests: parseInt(document.getElementById("guestCount").value),
        bookingDate: date,
        timeSlot: selectedSession === "morning" ? "Morning" : "Evening",

        perDayPrice: pricing?.perDay || 0,
        perPersonCharge: selectedMenuPrice,
        packagePrice: selectedMenuPrice,

        totalBeforeDiscount:
            parseInt(document.getElementById("guestCount").value) * selectedMenuPrice,

        couponDiscountValue: discountApplied,
        finalPrice: parseFloat(document.getElementById("totalAmount").innerText),
    };

    console.log("📦 FINAL BOOKING SENT:", orderData);

    try {
        const res = await fetch(`${API_BASE_URL}/bookings/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const json = await res.json();

        if (!json.success) return alert("❌ Booking failed!");

        const bookingId = json.data._id;

        window.location.href = `${API_BASE_URL}/payment/hdfc/start/${bookingId}`;

    } catch (error) {
        console.error(error);
        alert("❌ Something went wrong!");
    }
});

/* ======================================================
   SCROLL TO FIRST ERROR FIELD
====================================================== */
function scrollToFirstError() {
    const firstInvalid = document.querySelector(".was-validated .form-control:invalid");
    if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
    }
}

/* ======================================================
   START
====================================================== */
document.addEventListener("DOMContentLoaded", loadVenueDetails);
