// ---------------------------------------------------------
// GET VENUE ID FROM URL
// ---------------------------------------------------------
const urlParams = new URLSearchParams(window.location.search);
const venueId = urlParams.get("id");

if (!venueId) {
    alert("No venue found");
}

// Convert backend image path → public URL
function formatImage(path) {
    if (!path) return "../logo/book.png";

    if (path.startsWith("/var/www/backend/")) {
        return IMAGE + path.replace("/var/www/backend/", "");
    }

    return IMAGE + path.replace(/^\//, "");
}

// ---------------------------------------------------------
// LOAD VENUE DETAILS
// ---------------------------------------------------------
async function loadVenue() {
    try {
        const res = await API.get(`/venues/${venueId}`);
        const v = res.data.data;

        // -----------------------------------------
        // BASIC INFORMATION
        // -----------------------------------------
        document.getElementById("venueTitle").textContent = v.venueName;
        document.getElementById("venueLocation").textContent = v.venueAddress;
        document.getElementById("venueCategory").textContent =
            v.categories?.length ? v.categories[0].title : "Venue";

        document.getElementById("ratingText").textContent =
            v.rating > 0 ? v.rating : "No rating";

        document.getElementById("venueDescription").textContent =
            v.shortDescription || v.description || "No description";

        // -----------------------------------------
        // CONTACT DETAILS
        // -----------------------------------------
        document.getElementById("contactPhone").textContent = v.contactPhone;
        document.getElementById("contactEmail").textContent = v.contactEmail;
        document.getElementById("contactWebsite").textContent = v.contactWebsite;
        document.getElementById("contactWebsite").href =
            v.contactWebsite?.startsWith("http")
                ? v.contactWebsite
                : `https://${v.contactWebsite}`;

        document.getElementById("ownerName").textContent = v.ownerManagerName;
        document.getElementById("openHours").textContent =
            `${v.openingHours} - ${v.closingHours}`;

        // -----------------------------------------
        // CAPACITIES
        // -----------------------------------------
        document.getElementById("seatingCap").textContent = v.maxGuestsSeated;
        document.getElementById("standingCap").textContent = v.maxGuestsStanding;

        // -----------------------------------------
        // MAIN IMAGE
        // -----------------------------------------
        document.getElementById("mainImage").src =
            v.thumbnail
                ? formatImage(v.thumbnail)
                : formatImage(v.images?.[0]);

        // -----------------------------------------
        // FACILITIES SECTION
        // -----------------------------------------
        const facilities = {
            "Parking": v.parkingAvailability,
            "Wifi": v.wifiAvailability,
            "Catering Available": v.foodCateringAvailability,
            "Stage & Audio": v.stageLightingAudio,
            "Wheelchair Access": v.wheelchairAccessibility,
            "AC Available": v.acAvailable,
            "Non AC Available": v.nonAcAvailable,
            "Security Available": v.securityArrangements,
        };

        let facListHTML = "";
        let facChipHTML = "";

        Object.entries(facilities).forEach(([name, value]) => {
            facListHTML += `
                <div class="${value ? 'facility-true' : 'facility-false'}">
                    ${name}: ${value ? "Available" : "Not Available"}
                </div>
            `;

            if (value) {
                facChipHTML += `<span class="facility-true">${name}</span>`;
            }
        });

        document.getElementById("facilitiesList").innerHTML = facListHTML;
        document.getElementById("facilitiesChips").innerHTML = facChipHTML;

        // -----------------------------------------
        // PRICING SCHEDULE (Mon–Sun)
        // -----------------------------------------
        const simpleBody = document.getElementById("pricingSimpleBody");
        const expandedBody = document.getElementById("pricingExpandedBody");

        simpleBody.innerHTML = "";
        expandedBody.innerHTML = "";

        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];

        const dayNames = {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday"
        };

        days.forEach(day => {
            const row = v.pricingSchedule[day];
            if (!row) return;

            // Simple Table
            simpleBody.innerHTML += `
                <tr>
                    <td>${dayNames[day]}</td>
                    <td>${row.morning.perDay}</td>
                    <td>${row.evening.perDay}</td>
                </tr>
            `;

            // Expanded View
            expandedBody.innerHTML += `
                <div class="card p-3 mb-2">
                    <h6>${dayNames[day]}</h6>
                    <div><b>Morning:</b> ${row.morning.startTime} ${row.morning.startAmpm} - ${row.morning.endTime} ${row.morning.endAmpm}</div>
                    <div><b>Evening:</b> ${row.evening.startTime} ${row.evening.startAmpm} - ${row.evening.endTime} ${row.evening.endAmpm}</div>
                    <div class="mt-2"><b>Morning Price:</b> ${row.morning.perDay}</div>
                    <div><b>Evening Price:</b> ${row.evening.perDay}</div>
                </div>
            `;
        });

        // -----------------------------------------
        // MAP
        // -----------------------------------------
        if (v.latitude && v.longitude) {
            const mapUrl = `https://www.google.com/maps?q=${v.latitude},${v.longitude}&output=embed`;
            document.getElementById("mapFrame").src = mapUrl;

            document.getElementById("googleMapsLink").href =
                `https://www.google.com/maps?q=${v.latitude},${v.longitude}`;
        }

        // -----------------------------------------
        // PHOTOS: SLIDER + GRID
        // -----------------------------------------
        const swiperWrap = document.getElementById("swiperSlides");
        const grid = document.getElementById("galleryGrid");

        swiperWrap.innerHTML = "";
        grid.innerHTML = "";

        const images = v.images?.length ? v.images : [v.thumbnail];

        images.forEach(img => {
            const imgUrl = formatImage(img);

            // Slider
            swiperWrap.innerHTML += `
                <div class="swiper-slide">
                    <img src="${imgUrl}" style="height:200px; width:100%; object-fit:cover; border-radius:8px;">
                </div>
            `;

            // Grid
            grid.innerHTML += `
                <div class="col-6 col-md-4 mb-3">
                    <img src="${imgUrl}" class="thumb" data-full="${imgUrl}" style="width:100%; height:120px; object-fit:cover; border-radius:6px;">
                </div>
            `;
        });

        // Thumbnail → Modal Preview
        document.querySelectorAll(".thumb").forEach(el => {
            el.onclick = () => {
                document.getElementById("modalImg").src = el.dataset.full;
                new bootstrap.Modal(document.getElementById("imgModal")).show();
            };
        });

        // Init Swiper Slider
        setTimeout(() => {
            new Swiper("#imagesSwiper", {
                slidesPerView: 3,
                spaceBetween: 12,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                breakpoints: {
                    0: { slidesPerView: 1 },
                    576: { slidesPerView: 2 },
                    992: { slidesPerView: 3 }
                }
            });
        }, 200);

    } catch (err) {
        console.error("Error loading venue:", err);
        alert("Failed to load venue details");
    }
}

// Load Venue
loadVenue();
