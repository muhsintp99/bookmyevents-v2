// /* ======================================================
//    GLOBAL VARIABLES
// ====================================================== */
// let venueData = null;
// let selectedMenuPrice = 0;
// let selectedPackageId = null;
// let selectedSession = "";
// let selectedPreference = "AC";
// let discountApplied = 0;

// /* ======================================================
//    GET ID FROM URL
// ====================================================== */
// function getVenueId() {
//     const params = new URLSearchParams(window.location.search);
//     return params.get("id");
// }

// /* ======================================================
//    IMAGE FORMATTER
// ====================================================== */
// function formatImage(path) {
//     if (!path) return "assets/img/fav-icon.png";
//     if (path.startsWith("http")) return path;
//     if (path.startsWith("/var/www/backend/")) {
//         path = path.replace("/var/www/backend/", "");
//     }
//     return `${API_BASE_IMG}/${path.replace(/^\/+/, "")}`;
// }

// /* ======================================================
//    LOAD VENUE DETAILS
// ====================================================== */
// async function loadVenueDetails() {
//     const id = getVenueId();
//     if (!id) return;

//     try {
//         const res = await fetch(`${API_BASE_URL}/venues/${id}`);
//         const json = await res.json();
//         if (!json.success) return;

//         venueData = json.data;
//         renderVenue(venueData);
//     } catch (err) {
//         console.error("❌ API Error:", err);
//     }
// }

// /* ======================================================
//    FILL USER FORM FROM LOCALSTORAGE
// ====================================================== */
// function fillUserForm() {
//     const userData = localStorage.getItem("user");
//     if (!userData) return;

//     const user = JSON.parse(userData);

//     const fullName = document.getElementById("fullName");
//     const phone = document.getElementById("phoneNumber");
//     const email = document.getElementById("email");

//     if (fullName) fullName.value = `${user.firstName || ""} ${user.lastName || ""}`;
//     if (phone) phone.value = user.phone || "";
//     if (email) email.value = user.email || "";
// }

// /* ======================================================
//    FLATPICKR CALENDAR (ISO DATE FIX)
// ====================================================== */
// function setupFlatpickrCalendar(pricingSchedule) {
//     if (!pricingSchedule) return;

//     const allowedDays = [];

//     Object.keys(pricingSchedule).forEach(day => {
//         if (pricingSchedule[day]?.morning || pricingSchedule[day]?.evening) {
//             allowedDays.push(day.toLowerCase());
//         }
//     });

//     document.getElementById("dateHint").innerText =
//         "Available Days: " + allowedDays.join(", ");

//     flatpickr("#eventDate", {
//         dateFormat: "d-M-Y",
//         minDate: "today",
//         disable: [
//             date => !allowedDays.includes(
//                 date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
//             )
//         ],
//         defaultDate: "today",
//         onChange: (dates) => {
//             if (dates.length > 0) {
//                 const iso = dates[0].toISOString().split("T")[0];
//                 document.getElementById("eventDate").dataset.isoDate = iso;
//             }
//             calculateTotal();
//         }
//     });
// }

// /* ======================================================
//    RENDER VENUE
// ====================================================== */
// function renderVenue(venue) {
//     const venueItem = document.getElementById("venueSummaryItem");

//     if (!venueItem) return;

//     const categoryTitle = venue.categories?.[0]?.title || "Venue";

//     venueItem.innerHTML = `
//         <div class="item-area">
//             <div class="main-item">
//                 <div class="item-img">
//                     <img src="${formatImage(venue.thumbnail)}">
//                 </div>
//                 <div class="content-and-quantity">
//                     <div class="content">
//                         <span>${categoryTitle}</span>
//                         <h6>${venue.venueName}</h6>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;

//     handlePreferenceVisibility(venue);
//     handleMenuVisibility(venue.packages || []);
//     setupFlatpickrCalendar(venue.pricingSchedule);
// }

// /* ======================================================
//    AC/NON AC SELECTION
// ====================================================== */
// function handlePreferenceVisibility(venue) {
//     const ac = document.querySelector(".acAvailable");
//     const fan = document.querySelector(".fanAvailable");

//     if (ac) ac.style.display = venue.acAvailable ? "flex" : "none";
//     if (fan) fan.style.display = venue.nonAcAvailable ? "flex" : "none";

//     document.querySelectorAll(".Preference-option li").forEach(item => {
//         item.addEventListener("click", function () {
//             document.querySelectorAll(".Preference-option li").forEach(li => li.classList.remove("active"));
//             this.classList.add("active");

//             selectedPreference = this.classList.contains("acAvailable") ? "AC" : "NON-AC";
//             calculateTotal();
//         });
//     });
// }

// /* ======================================================
//    SHOW PACKAGES
// ====================================================== */
// function handleMenuVisibility(packages) {
//     const menuList = document.getElementById("menuList");

//     if (!packages.length) {
//         document.querySelector(".choose-menu-method").style.display = "none";
//         return;
//     }

//     menuList.innerHTML = "";

//     packages.forEach(pkg => {
//         const li = document.createElement("li");
//         li.className = "menu-card";
//         li.dataset.price = pkg.price;
//         li.dataset.id = pkg._id;

//         li.innerHTML = `
//             <div class="menu-content">
//                 <div class="item-img">
//                     <img src="${formatImage(pkg.thumbnail)}">
//                 </div>
//                 <div class="menu-details">
//                     <span class="menu-service">${pkg.packageType}</span>
//                     <h6 class="menu-title">${pkg.title}</h6>
//                     <p class="menu-type">${pkg.subtitle}</p>
//                     <p class="menu-type">₹${pkg.price}</p>
//                 </div>
//             </div>
//             <div class="checked"><i class="bi bi-check"></i></div>
//         `;

//         menuList.appendChild(li);
//     });

//     activateMenuSelection();
// }

// /* ======================================================
//    MENU SELECTION
// ====================================================== */
// function activateMenuSelection() {
//     const cards = document.querySelectorAll(".menu-card");

//     cards.forEach(card => {
//         card.addEventListener("click", function () {
//             cards.forEach(c => c.classList.remove("active"));
//             this.classList.add("active");

//             selectedMenuPrice = parseFloat(this.dataset.price);
//             selectedPackageId = this.dataset.id;

//             document.getElementById("menuError").style.display = "none";

//             calculateTotal();
//         });
//     });
// }

// /* ======================================================
//    SESSION SELECTION
// ====================================================== */
// document.querySelectorAll(".session-check").forEach((check, index) => {
//     check.addEventListener("change", function () {
//         document.querySelectorAll(".session-check").forEach(c => (c.checked = false));
//         this.checked = true;

//         selectedSession = index === 0 ? "morning" : "evening";
//         calculateTotal();
//     });
// });

// /* ======================================================
//    CALCULATE TOTAL
// ====================================================== */
// function calculateTotal() {
//     if (!venueData) return;

//     const guest = parseInt(document.getElementById("guestCount").value || 1);
//     const dateInput = document.getElementById("eventDate");

//     const isoDate = dateInput.dataset.isoDate;
//     if (!isoDate || !selectedSession) return;

//     const day = new Date(isoDate).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
//     const pricing = venueData.pricingSchedule?.[day]?.[selectedSession];

//     if (!pricing) return;

//     let venueCost = pricing.perDay || 10000;
//     let menuCost = selectedMenuPrice * guest;

//     let total = venueCost + menuCost;

//     document.getElementById("totalAmount").innerText = total.toFixed(2);
// }

// /* ======================================================
//    APPLY COUPON
// ====================================================== */
// document.querySelector(".apply-btn")?.addEventListener("click", function () {
//     const code = document.getElementById("couponInput").value.trim();

//     if (code === "SAVE10") {
//         discountApplied = 10;
//         alert("✅ 10% Discount Applied");
//     } else {
//         discountApplied = 0;
//         alert("❌ Invalid Coupon");
//     }

//     calculateTotal();
// });

// /* ======================================================
//    PLACE ORDER
// ====================================================== */
// document.getElementById("placeOrderBtn")?.addEventListener("click", async function (e) {
//     e.preventDefault();

//     const userData = localStorage.getItem("user");
//     if (!userData) {
//         new bootstrap.Modal(document.getElementById("loginRequiredModal")).show();
//         return;
//     }

//     const user = JSON.parse(userData);
//     const dateInput = document.getElementById("eventDate");
//     const isoDate = dateInput.dataset.isoDate;

//     if (!isoDate) return alert("❌ Select a valid date");
//     if (!selectedPackageId) return alert("❌ Select a package");
//     if (!selectedSession) return alert("❌ Select Morning or Evening");

//     const day = new Date(isoDate).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
//     const pricing = venueData.pricingSchedule?.[day]?.[selectedSession];

//     const guests = parseInt(document.getElementById("guestCount").value);
//     const venueAmount = pricing?.perDay || 0;
//     const menuAmount = guests * selectedMenuPrice;
//     const totalAmount = venueAmount + menuAmount;

//     const orderData = {
//         moduleType: "Venues",
//         moduleId: venueData.module ?? venueData.moduleId,
//         venueId: venueData._id,
//         packageId: selectedPackageId,
//         providerId: venueData.provider ?? venueData.vendorId,
//         userId: user._id,

//         fullName: `${user.firstName} ${user.lastName}`,
//         contactNumber: user.phone,
//         emailAddress: user.email,
//         address: "N/A",

//         numberOfGuests: guests,
//         bookingDate: isoDate,
//         timeSlot: selectedSession === "morning" ? "Morning" : "Evening",

//         perDayPrice: venueAmount,
//         perPersonCharge: selectedMenuPrice,
//         packagePrice: selectedMenuPrice,

//         totalBeforeDiscount: menuAmount,
//         couponDiscountValue: discountApplied,
//         finalPrice: totalAmount,

//         bookingType: "Indirect",
//         paymentType: "Cash",
//         status: "Pending",
//         paymentStatus: "Pending"
//     };

//     console.log("📤 SENDING BOOKING:", orderData);

//     try {
//         const res = await fetch(`${API_BASE_URL}/bookings`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(orderData)
//         });

//         const json = await res.json();
//         console.log("📥 RESPONSE:", json);

//         if (!json.success) {
//             alert("❌ Booking failed: " + json.message);
//             return;
//         }

//         alert("✅ Booking successful!");

//         window.location.href = `payment.html?bookingId=${json.data._id}`;
//     } catch (err) {
//         console.error(err);
//         alert("❌ Something went wrong!");
//     }
// });

// /* ======================================================
//    START
// ====================================================== */
// document.addEventListener("DOMContentLoaded", () => {
//     loadVenueDetails();
//     fillUserForm(); // AUTO FILL FROM LOCALSTORAGE
// });



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

        // ✅ Debug: Log venue structure
        console.log("🏢 VENUE DATA LOADED:");
        console.log("  - Full venue:", venueData);
        console.log("  - module field:", venueData.module);
        console.log("  - moduleId field:", venueData.moduleId);
        console.log("  - categories:", venueData.categories);
        console.log("  - provider:", venueData.provider);

        renderVenue(venueData);
    } catch (err) {
        console.error("❌ API Error:", err);
    }
}

/* ======================================================
   FLATPICKR CALENDAR - FIXED VERSION
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

    // ✅ FIXED: Store date in ISO format
    flatpickr("#eventDate", {
        dateFormat: "d-M-Y",  // Display format
        minDate: "today",
        disable: [
            date => !allowedDays.includes(
                date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
            )
        ],
        defaultDate: "today",
        // ✅ Store the ISO date in a hidden field
        onChange: (selectedDates) => {
            if (selectedDates.length > 0) {
                // Convert to ISO format YYYY-MM-DD
                const isoDate = selectedDates[0].toISOString().split('T')[0];
                document.getElementById("eventDate").dataset.isoDate = isoDate;
            }
            calculateTotal();
        }
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
        li.dataset.id = pkg._id;

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
    const dateInput = document.getElementById("eventDate");
    const date = dateInput.value;

    if (!date || !selectedSession) return;

    // ✅ Get the ISO date from dataset
    const isoDate = dateInput.dataset.isoDate || date;

    // Parse the date correctly
    let day;
    if (isoDate) {
        day = new Date(isoDate).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    } else {
        day = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    }

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
   PLACE ORDER (CREATE BOOKING) - FIXED VERSION
====================================================== */
document.getElementById("placeOrderBtn")?.addEventListener("click", async function (e) {
    e.preventDefault();

    // ⛔ Must be logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
        const modal = new bootstrap.Modal(document.getElementById("loginRequiredModal"));
        modal.show();
        return;
    }

    const user = JSON.parse(userData);

    // ⛔ Validate session
    if (!selectedSession) {
        alert("❌ Select Morning or Evening");
        return;
    }

    // ⛔ Validate menu selection
    if (!selectedPackageId) {
        document.getElementById("menuError").style.display = "block";
        return;
    }

    // ⛔ Validate date
    const dateInput = document.getElementById("eventDate");
    const displayDate = dateInput.value;

    if (!displayDate) {
        alert("❌ Please select a booking date");
        return;
    }

    // ✅ FIXED: Use the ISO date stored in dataset
    const isoDate = dateInput.dataset.isoDate;

    if (!isoDate) {
        alert("❌ Invalid date format. Please select a valid date.");
        return;
    }

    console.log("📅 Display Date:", displayDate);
    console.log("📅 ISO Date:", isoDate);

    // Get day for pricing calculation
    const day = new Date(isoDate).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
    const pricing = venueData.pricingSchedule?.[day]?.[selectedSession];

    // Calculate final amounts
    const guests = parseInt(document.getElementById("guestCount").value);
    const menuAmount = guests * selectedMenuPrice;
    const venueAmount = pricing?.perDay || 0;
    const totalAmount = venueAmount + menuAmount;

    // ✅ Get the correct moduleId
    // First check if venue has categories array with module info
    let moduleId = null;

    if (venueData.categories && Array.isArray(venueData.categories) && venueData.categories.length > 0) {
        // If categories is array of objects with moduleId
        if (typeof venueData.categories[0] === 'object' && venueData.categories[0].moduleId) {
            moduleId = venueData.categories[0].moduleId;
        }
    }

    // Fallback to direct module field
    if (!moduleId) {
        moduleId = venueData.module || venueData.moduleId;
    }

    // If still not found, we need to fetch it from the venue's category
    if (!moduleId && venueData.categories && venueData.categories[0]) {
        // Use the hardcoded Venues module ID as last resort
        moduleId = "68e5ea9f27ca1c19b2d3924a"; // Venues module ID
    }

    console.log("🔍 Debug Info:");
    console.log("  - venueData.module:", venueData.module);
    console.log("  - venueData.moduleId:", venueData.moduleId);
    console.log("  - venueData.categories:", venueData.categories);
    console.log("  - Final moduleId:", moduleId);

    if (!moduleId) {
        alert("❌ Module ID not found. Please contact support.");
        return;
    }

    // ✅ FIXED: Create booking object with proper date format
    const orderData = {
        moduleType: "Venues",
        moduleId: moduleId,
        venueId: venueData._id,
        packageId: selectedPackageId,
        providerId: venueData.provider || venueData.vendorId,
        userId: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
        contactNumber: user.phone || "N/A",
        emailAddress: user.email,
        address: "N/A",
        numberOfGuests: guests,

        // ✅ FIXED: Send ISO formatted date (YYYY-MM-DD)
        bookingDate: isoDate,

        timeSlot: selectedSession === "morning" ? "Morning" : "Evening",
        perDayPrice: pricing?.perDay || 0,
        perPersonCharge: selectedMenuPrice,
        perHourCharge: 0,
        packagePrice: selectedMenuPrice,
        totalBeforeDiscount: guests * selectedMenuPrice,
        discountValue: 0,
        discountType: "none",
        couponDiscountValue: discountApplied,
        finalPrice: totalAmount,
        bookingType: "Indirect",
        paymentType: "Cash",
        status: "Pending",
        paymentStatus: "Pending"
    };

    console.log("📤 FINAL BOOKING SENT:", orderData);

    try {
        const res = await fetch(`${API_BASE_URL}/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });

        const json = await res.json();
        console.log("📥 RESPONSE:", json);

        if (!json.success) {
            alert("❌ Booking failed: " + json.message);
            return;
        }

        // SUCCESSFUL BOOKING
        alert("✅ Booking Successful!");

        const bookingId = json.data._id;

        // 1️⃣ CREATE PAYMENT SESSION
        const paymentResponse = await fetch(`${API_BASE_URL}/payment/create-payment-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookingId })
        });

        const paymentJson = await paymentResponse.json();
        console.log("💳 PAYMENT SESSION RESPONSE:", paymentJson);

        if (!paymentJson.success) {
            alert("❌ Unable to create payment session");
            return;
        }

        // 2️⃣ OPEN THE PAYMENT PAGE (HDFC SmartGateway)
        const paymentUrl = paymentJson.payment_links.web;

        if (!paymentUrl) {
            alert("❌ Payment URL missing from backend response");
            return;
        }

        window.location.href = paymentUrl;


    } catch (err) {
        console.error("❌ Booking Error:", err);
        alert("❌ Unable to complete booking. Please try again.");
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