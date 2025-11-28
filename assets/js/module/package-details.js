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

        if (!json.success) throw new Error("Invalid API response");

        renderVenueDetails(json.data);

    } catch (err) {
        console.error("❌ Failed to load venue details:", err);
    }
}

/* ============================================================
   ✅ 3. MAIN RENDER FUNCTION
============================================================ */
function renderVenueDetails(v) {

    /* ===============================
       ✅ TITLE & CATEGORY (BREADCRUMB)
    =============================== */
    const titleEl = document.querySelector(".banner-content h1");
    if (titleEl) titleEl.textContent = v.venueName || "Venue Name";

    const catEl = document.querySelector(".banner-content .batch span");
    if (catEl && v.categories?.length) {
        catEl.textContent = v.categories.map(c => c.title).join(", ");
    }

    /* ===============================
       ✅ SHORT DESCRIPTION
    =============================== */
    setText("#shortDescription", v.shortDescription);

    /* ===============================
       ✅ CONTACT INFO
    =============================== */
    setText("#contactPhone", v.contactPhone);
    setText("#contactEmail", v.contactEmail);
    setHref("#contactWebsite", v.contactWebsite);

    /* ===============================
       ✅ OWNER INFO
    =============================== */
    setText("#ownerName", v.ownerManagerName);
    setText("#ownerPhone", v.ownerManagerPhone);

    /* ===============================
       ✅ FACILITIES (YES / NO)
    =============================== */
    setYesNo("#parkingAvailability", v.parkingAvailability);
    setYesNo("#wheelchairAccessibility", v.wheelchairAccessibility);
    setYesNo("#wifiAvailability", v.wifiAvailability);
    setYesNo("#foodCateringAvailability", v.foodCateringAvailability);
    setYesNo("#acAvailable", v.acAvailable);

    /* ===============================
       ✅ GUEST CAPACITY
    =============================== */
    setText("#maxGuestsSeated", v.maxGuestsSeated);
    setText("#maxGuestsStanding", v.maxGuestsStanding);

    /* ===============================
       ✅ PRICING (MONDAY MORNING SAMPLE)
    =============================== */
    if (v.pricingSchedule?.monday?.morning) {
        setText("#morningPrice", v.pricingSchedule.monday.morning.perDay + " AED");
    }

    /* ===============================
       ✅ FAQ RENDER (YOUR EXACT ACCORDION)
    =============================== */
    renderFAQs(v.faqs);

    /* ===============================
       ✅ BREADCRUMB IMAGE SLIDER
    =============================== */
    renderBreadcrumbSlider(v.images || []);
}

/* ============================================================
   ✅ 4. FAQ RENDER FUNCTION (EXACT MATCH TO YOUR HTML)
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
                     aria-labelledby="${headingId}" 
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
function renderBreadcrumbSlider(images) {
    const slider = document.querySelector(".home2-banner-slider .swiper-wrapper");
    if (!slider) return;

    slider.innerHTML = "";

    if (images.length) {
        images.forEach(img => {
            slider.innerHTML += `
                <div class="swiper-slide">
                    <div class="banner-bg"
                        style="background-image:linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)), url('${formatImage(img)}');">
                    </div>
                </div>
            `;
        });
    } else {
        slider.innerHTML = `
            <div class="swiper-slide">
                <div class="banner-bg"
                    style="background-image:linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)), url('assets/img/fav-icon.png');">
                </div>
            </div>
        `;
    }

    // ✅ Re-init swiper after DOM update
    setTimeout(initBreadcrumbSwiper, 300);
}

/* ============================================================
   ✅ 6. SWIPER INITIALIZATION
============================================================ */
function initBreadcrumbSwiper() {
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
   ✅ 7. HELPER FUNCTIONS
============================================================ */
function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value || "-";
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
   ✅ 8. AUTO LOAD ON PAGE READY
============================================================ */
document.addEventListener("DOMContentLoaded", loadVenueDetails);
