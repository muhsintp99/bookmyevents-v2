/* =====================================================
   ✅ INJECT IMAGE HEIGHT & CENTER STYLE USING JS
===================================================== */
(function injectVenueImageStyle() {
    const style = document.createElement("style");
    style.innerHTML = `
        .package-img-wrap {
            position: relative;
            width: 100%;
            height: 260px;              
            overflow: hidden;
            border-radius: 12px;
            background: #f5f5f5;
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
            transition: transform 0.4s ease;
        }

        .package-card:hover .package-img-wrap img {
            transform: scale(1.08);
        }
    `;
    document.head.appendChild(style);
})();

/* =====================================================
   WAIT UNTIL API LOADED
===================================================== */
function waitForVenueAPI() {
    if (!window.API_DATA || !API_DATA.venues || !API_DATA.venues.length) {
        return setTimeout(waitForVenueAPI, 300);
    }
    renderPopularVenues();
}

/* =====================================================
   HELPER: TRUNCATE TEXT
===================================================== */
function truncateText(text, maxLength = 20) {
    if (!text) return "Event Location";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
}

/* =====================================================
   RENDER 6 POPULAR TOP PICK VENUES — THUMBNAIL ONLY
===================================================== */
function renderPopularVenues() {
    const container = document.getElementById("popularVenuesContainer");
    container.innerHTML = "";

    const venues = API_DATA.venues
        .filter(v => v.isTopPick === true)
        .slice(0, 6);

    if (!venues.length) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <p>No Top Pick Venues Available</p>
            </div>
        `;
        return;
    }

    venues.forEach((v, index) => {

        const thumbnailImage = formatImage(v.thumbnail);

        const venueHTML = `
        <div class="col-lg-4 col-md-6 col-6 wow animate fadeInDown"
            data-wow-delay="${200 + index * 100}ms"
            data-wow-duration="1500ms">

            <div class="package-card">

                <!-- ✅ THUMBNAIL ONLY -->
                <div class="package-img-wrap">
                    <a href="package-details.html?id=${v._id}" class="package-img">
                        <img 
                            src="${thumbnailImage}" 
                            onerror="this.onerror=null;this.src='assets/img/fav-icon.png';"
                            alt="venue"
                        >
                    </a>

                    <div class="batch">
                        <span>Popular</span>
                    </div>
                </div>

                <div class="package-content">

                    <h5>
                    <a href="package-details.html?id=${v._id}">
                    ${v.venueName ? v.venueName.charAt(0).toUpperCase() + v.venueName.slice(1).toLowerCase(): ""}
                    </a></h5>


                    <div class="location-and-time">
                        <div class="location">
                            <svg width="14" height="14" viewBox="0 0 14 14"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.83615 0C3.77766 0 1.28891 2.48879 1.28891 5.54892C1.28891 7.93837 4.6241 11.8351 6.05811 13.3994C6.25669 13.6175 6.54154 13.7411 6.83615 13.7411C7.13076 13.7411 7.41561 13.6175 7.6142 13.3994C9.04821 11.8351 12.3834 7.93833 12.3834 5.54892C12.3834 2.48879 9.89464 0 6.83615 0Z" />
                            </svg>

                            <a href="package-details.html?id=${v._id}">
                                ${truncateText(v.venueAddress, 30)}
                            </a>
                        </div>
                    </div>

                    <div class="btn-and-price-area d-flex justify-content-end align-items-center">
                        <a href="package-details.html?id=${v._id}" class="primary-btn1">
                            <span>Book Now</span>
                            <span>Book Now</span>
                        </a>
                    </div>

                </div>
            </div>
        </div>
        `;

        container.innerHTML += venueHTML;
    });
}

/* =====================================================
   START AFTER API LOAD
===================================================== */
waitForVenueAPI();
