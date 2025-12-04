/* ============================================================
   ✅ 1. GET ID FROM URL
============================================================ */
function getVenueId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

/* ============================================================
   ✅ 2. FETCH VENUE DETAILS FROM API
============================================================ */
async function loadVenueDetails() {
    const id = getVenueId();
    if (!id) {
        console.error("❌ No venue ID in URL");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/venues/${id}`);
        const json = await res.json();

        if (!json || !json.success || !json.data) {
            throw new Error("Invalid API response");
        }

        renderVenueDetails(json.data);

    } catch (err) {
        console.error("❌ Failed to load venue details:", err);
    }
}

/* ============================================================
   ✅ 3. MAIN RENDER FUNCTION
============================================================ */
function renderVenueDetails(v) {

    /* ✅ TITLE & CATEGORY */
    const titleEl = document.querySelector(".banner-content h1");
    if (titleEl) titleEl.textContent = v?.venueName || "Venue Name";

    // const catEl = document.querySelector(".banner-content .batch span");
    // if (catEl && v?.categories?.length) {
    //     catEl.textContent = v.categories.map(c => c.title).join(", ");
    // }
    const catEl = document.querySelector(".banner-content .batch span");
    if (catEl && v?.categories?.length) {
        const moduleTitles = v.categories
            .map(c => c?.module?.title)
            .filter(Boolean); // remove undefined

        catEl.textContent = moduleTitles.length
            ? moduleTitles.join(", ")
            : v.categories.map(c => c.title).join(", "); // fallback
    }


    /* ✅ SHORT DESCRIPTION */
    setText("#shortDescription", v?.shortDescription);

    /* ✅ CONTACT INFO */
    setText("#contactPhone", v?.contactPhone);
    setText("#contactEmail", v?.contactEmail);
    setHref("#contactWebsite", v?.contactWebsite);

    /* ✅ OWNER INFO */
    setText("#ownerName", v?.ownerManagerName);
    setText("#ownerPhone", v?.ownerManagerPhone);

    /* ✅ FACILITIES */
    setYesNo("#parkingAvailability", v?.parkingAvailability);
    setYesNo("#wheelchairAccessibility", v?.wheelchairAccessibility);
    setYesNo("#wifiAvailability", v?.wifiAvailability);
    setYesNo("#foodCateringAvailability", v?.foodCateringAvailability);
    setYesNo("#acAvailable", v?.acAvailable);

    setText("#language", v?.language);

    /* ✅ CAPACITY */
    setText("#maxGuestsSeated", v?.maxGuestsSeated);
    setText("#maxGuestsStanding", v?.maxGuestsStanding);
    setText("#parkingCapacity", v?.parkingCapacity);

    /* ✅ OPEN / CLOSE TIME */
    setText("#openingHours", v?.openingHours);
    setText("#closingHours", v?.closingHours);

    /* ✅ CATEGORY LABEL */
    if (v?.categories?.length) {
        setText("#venueCategory", v.categories.map(c => c.title).join(", "));
    }

    const moduleId = v?.categories?.[0]?.module?._id;

    setText("#venueModuleTitle", v?.categories?.[0]?.module?.title);
    setText("#venueModuleId", moduleId);

    /* ✅ ✅ NOW LOAD CATEGORIES USING MODULE ID */
    loadCategoriesByModule(moduleId);



    /* ✅ PRICING */
    if (v?.pricingSchedule?.monday?.morning?.perDay) {
        setText("#morningPrice", v.pricingSchedule.monday.morning.perDay + " AED");
    }

    /* ✅ FAQ */
    renderFAQs(v?.faqs || []);

    /* ✅ BREADCRUMB SLIDER */
    // renderBreadcrumbSlider(v?.images || []);
    renderBreadcrumbSlider([], v?.thumbnail);


    /* ✅ EXPLORE IMAGE SLIDER */
    renderExploreImages(v?.images || []);

    /* ✅ GOOGLE MAP */
    if (v?.latitude && v?.longitude) {
        initGoogleMap(Number(v.latitude), Number(v.longitude));
    }

    /* ✅ ✅ DYNAMIC HIGHLIGHTS (FIXED CALL LOCATION) */
    renderDynamicHighlights(v);

    renderBreadcrumbBottom(v);
}

/* ============================================================
   ✅ 4. FAQ RENDER FUNCTION
============================================================ */
function renderFAQs(faqs) {
    const faqWrapper = document.getElementById("accordionFlushExample");
    if (!faqWrapper) return;

    faqWrapper.innerHTML = "";

    if (!faqs || !faqs.length) {
        faqWrapper.innerHTML = `
            <div class="accordion-item">
                <h5 class="accordion-header">
                    <button class="accordion-button collapsed">
                        No FAQs Available
                    </button>
                </h5>
                <div class="accordion-collapse collapse show">
                    <div class="accordion-body">
                        No frequently asked questions found for this venue.
                    </div>
                </div>
            </div>`;
        return;
    }

    faqs.forEach((faq, index) => {
        const headingId = `flush-heading-${index}`;
        const collapseId = `flush-collapse-${index}`;

        faqWrapper.innerHTML += `
            <div class="accordion-item">
                <h5 class="accordion-header" id="${headingId}">
                    <button class="accordion-button ${index !== 0 ? "collapsed" : ""}" 
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#${collapseId}"
                        aria-expanded="${index === 0 ? "true" : "false"}"
                        aria-controls="${collapseId}">
                        ${faq.question}
                    </button>
                </h5>

                <div id="${collapseId}" 
                    class="accordion-collapse collapse ${index === 0 ? "show" : ""}"
                    data-bs-parent="#accordionFlushExample">

                    <div class="accordion-body">
                        ${faq.answer}
                    </div>
                </div>
            </div>
        `;
    });
}


/* ============================================================
   ✅ 5. BREADCRUMB IMAGE SLIDER
============================================================ */
// function renderBreadcrumbSlider(images) {
//     const slider = document.querySelector(".home2-banner-slider .swiper-wrapper");
//     if (!slider) return;

//     slider.innerHTML = "";

//     if (images.length) {
//         images.forEach(img => {
//             slider.innerHTML += `
//                 <div class="swiper-slide">
//                     <div class="banner-bg"
//                         style="background-image:linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)), 
//                         url('${formatImage(img)}');">
//                     </div>
//                 </div>
//             `;
//         });
//     } else {
//         slider.innerHTML = `
//             <div class="swiper-slide">
//                 <div class="banner-bg"
//                     style="background-image:url('assets/img/fav-icon.png');">
//                 </div>
//             </div>
//         `;
//     }

//     setTimeout(initBreadcrumbSwiper, 300);
// }

/* ============================================================
   ✅ 5. BREADCRUMB IMAGE (THUMBNAIL ONLY)
============================================================ */
function renderBreadcrumbSlider(images, thumbnail) {
    const slider = document.getElementById("breadcrumbWrapper");
    if (!slider) return;

    slider.innerHTML = "";

    const bgImage = thumbnail
        ? formatImage(thumbnail)
        : "assets/img/fav-icon.png";

    slider.innerHTML = `
        <div class="swiper-slide">
            <div class="banner-bg"
                style="background-image:
                linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)),
                url('${bgImage}');">
            </div>
        </div>
    `;

    setTimeout(initBreadcrumbSwiper, 200);
}


/* ============================================================
   ✅ 6. BREADCRUMB SWIPER INIT
============================================================ */
function initBreadcrumbSwiper() {
    if (!document.querySelector(".home2-banner-slider")) return;

    new Swiper(".home2-banner-slider", {
        loop: true,
        autoplay: { delay: 3000 },
        navigation: {
            nextEl: ".banner-slider-next",
            prevEl: ".banner-slider-prev",
        }
    });
}

/* ============================================================
   ✅ 7. EXPLORE IMAGE SLIDER
============================================================ */
function renderExploreImages(images) {
    const wrapper = document.querySelector(".package-dt-location-slider .swiper-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    if (!images.length) {
        wrapper.innerHTML = `
            <div class="swiper-slide">
                <div class="location-card">
                    <img src="assets/img/fav-icon.png" alt="No Image">
                </div>
            </div>
        `;
        return;
    }

    images.forEach(img => {
        const imageUrl = formatImage(img);
        wrapper.innerHTML += `
            <div class="swiper-slide">
                <div class="location-card">
                    <a href="${imageUrl}" class="location-img">
                        <img src="${imageUrl}" alt="Venue Image">
                    </a>
                </div>
            </div>
        `;
    });

    setTimeout(initExploreSwiper, 300);
}

/* ============================================================
   ✅ 8. EXPLORE SWIPER INIT
============================================================ */
function initExploreSwiper() {
    if (!document.querySelector(".package-dt-location-slider")) return;

    new Swiper(".package-dt-location-slider", {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".location-slider-next",
            prevEl: ".location-slider-prev",
        },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

/* ============================================================
   ✅ 9. HELPER FUNCTIONS
============================================================ */
function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value ?? "-";
}

function setHref(selector, value) {
    const el = document.querySelector(selector);
    if (el) {
        el.href = value || "#";
        el.textContent = value || "-";
    }
}

function setYesNo(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value ? "Yes" : "No";
}

/* ============================================================
   ✅ 10. AUTO LOAD
============================================================ */
document.addEventListener("DOMContentLoaded", loadVenueDetails);

/* ============================================================
   ✅ 11. GOOGLE MAP INITIALIZATION (SUPPORTS BOTH #map & #destinationMap)
============================================================ */
function initGoogleMap(lat, lng) {
    if (!window.google || !lat || !lng) {
        console.error("❌ Google Maps not ready");
        return;
    }

    const mapContainers = [
        document.getElementById("map"),
        document.getElementById("destinationMap")
    ];

    mapContainers.forEach(container => {
        if (!container) return;

        const map = new google.maps.Map(container, {
            zoom: 15,
            center: { lat, lng },
            mapId: "DEMO_MAP_ID"
        });

        // ✅ ADVANCED MARKER
        new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat, lng },
            title: "Venue Location"
        });
    });

    /* ✅ ✅ ADD VIEW IN GOOGLE MAPS LINK */
    const viewBtn = document.getElementById("viewInGoogleMaps");
    if (viewBtn) {
        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        viewBtn.href = mapUrl;
    }
}


/* ============================================================
   ✅ 12. DYNAMIC HIGHLIGHTS RENDER
============================================================ */
function renderDynamicHighlights(v) {
    const list = document.getElementById("highlightsList");
    if (!list || !v) return;

    list.innerHTML = ""; // ✅ Clear old data first

    const highlights = [];

    if (v.acType) highlights.push(`Air Conditioning Type: ${v.acType}`);
    if (v.washroomsInfo) highlights.push(`Washrooms Available: ${v.washroomsInfo}`);
    if (v.dressingRooms) highlights.push(`Dressing Rooms: ${v.dressingRooms}`);
    if (v.seatingArrangement) highlights.push(`Seating Arrangement: ${v.seatingArrangement}`);
    if (v.maxGuestsSeated) highlights.push(`Seated Guest Capacity: ${v.maxGuestsSeated}`);
    if (v.maxGuestsStanding) highlights.push(`Standing Guest Capacity: ${v.maxGuestsStanding}`);
    if (typeof v.multipleHalls === "boolean") {
        highlights.push(`Multiple Halls Available: ${v.multipleHalls ? "Yes" : "No"}`);
    }
    if (v.nearbyTransport) highlights.push(`Nearby Transport: ${v.nearbyTransport}`);
    if (v.accessibilityInfo) highlights.push(`Accessibility: ${v.accessibilityInfo}`);

    if (!highlights.length) return;

    highlights.forEach(text => {
        list.innerHTML += `
            <li>
                <svg width="16" height="16" viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15V16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16V15C11.866 15 15 11.866 15 8Z" />
                    <path d="M11.6947 6.45795L7.24644 10.9086L4.3038 8.46699L5.66764 7.10083L6.99596 8.42915L10.3309 5.09179L11.6947 6.45795Z" />
                </svg>
                ${text}
            </li>
        `;
    });
}

/* ============================================================
   ✅ 13. BREADCRUMB BOTTOM (RATING + SHARE)
============================================================ */
function renderBreadcrumbBottom(v) {

    /* ✅ RATING */
    const ratingEl = document.getElementById("venueRating");
    const reviewEl = document.getElementById("venueReviews");

    const rating = v?.rating || 0;
    const reviews = v?.reviewCount || 0;

    if (ratingEl) ratingEl.textContent = `(${rating}/5)`;
    if (reviewEl) reviewEl.textContent = `based on ${reviews} reviews`;

    /* ✅ SHARE LINKS */
    const pageUrl = window.location.href;
    const title = encodeURIComponent(v?.venueName || "Venue");

    const fb = document.getElementById("shareFacebook");
    const li = document.getElementById("shareLinkedIn");
    const wa = document.getElementById("shareWhatsApp");

    if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    if (wa) wa.href = `https://wa.me/?text=${title}%20${pageUrl}`;

    /* ✅ COPY LINK */
    const copyBtn = document.getElementById("copyLink");
    if (copyBtn) {
        copyBtn.onclick = function (e) {
            e.preventDefault();
            navigator.clipboard.writeText(pageUrl);
            alert("✅ Venue link copied!");
        };
    }
}


/* ============================================================
   ✅ 14. FETCH CATEGORIES BY MODULE (AXIOS + CONSOLE LOG)
============================================================ */
async function loadCategoriesByModule(moduleId) {
    console.log("✅ moduleId received:", moduleId);

    if (!moduleId) {
        console.warn("⚠️ No moduleId found for category fetch");
        return;
    }

    try {
        const res = await fetch(
            `${API_BASE_URL}/categories/modules/${moduleId}`
        );

        console.log("✅ Fetch response:", res);

        const json = await res.json();

        if (!json || !json.success || !json.data) {
            throw new Error("Invalid category API response");
        }

        const categories = json.data;

        /* ✅ ✅ SHOW ALL CATEGORIES IN CONSOLE */
        console.log("✅✅ Categories Loaded:", categories);

        categories.forEach((cat, index) => {
            console.log(`Category ${index + 1}:`, {
                id: cat._id,
                title: cat.title,
                module: cat.module
            });
        });

    } catch (err) {
        console.error("❌ Failed to load module categories:", err);
    }
}

/* ============================================================
   ✅ 15. Booking Button Handler
============================================================ */

document.getElementById("bookNowBtn").addEventListener("click", function () {
    const id = getVenueId();
    if (!id) {
        alert("Venue ID not found!");
        return;
    }

    // ✅ SEND ID to booking.html
    window.location.href = "booking.html?id=" + id;
});


