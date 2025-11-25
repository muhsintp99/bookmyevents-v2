/* =========================================================
    GLOBAL VARIABLES
========================================================= */
let allVenues = [];
let currentPage = 1;
const pageSize = 12;

/* =========================================================
    FETCH ALL VENUES
========================================================= */
API.get("/venues")
    .then(res => {
        allVenues = res.data.data;

        // Load Top Rated Section (Homepage)
        if (document.getElementById("top-rated-wrapper")) {
            loadTopRatedVenues(allVenues);
        }

        // Load Paginated Venue List
        if (document.getElementById("venue-list")) {
            loadPage(currentPage);
            renderPaginationNumbers();
        }
    })
    .catch(err => console.error("Error loading venues:", err));


/* =========================================================
    RENDER TOP RATED VENUES (SLIDER)
========================================================= */
function loadTopRatedVenues(list) {
    const wrapper = document.getElementById("top-rated-wrapper");
    if (!wrapper) return;

    wrapper.innerHTML = "";
    const wishlist = getWishlist();

    list.slice(0, 10).forEach(v => {
        const imageUrl = v.thumbnail
            ? IMAGE + v.thumbnail.replace("/var/www/backend/", "")
            : "../logo/book.png";

        const isLiked = wishlist.includes(v._id);

        const slide = `
        <div class="swiper-slide">
            <div class="product-item position-relative">

                <!-- ❤️ Wishlist -->
                <a class="btn-wishlist ${isLiked ? "heart-active" : ""}" 
                    data-id="${v._id}"
                    style="position:absolute; top:10px; right:10px; z-index:10;">
                    <svg width="24" height="24">
                        <use xlink:href="#heart"></use>
                    </svg>
                </a>

                <figure>
                    <a href="./demmy.html?id=${v._id}">
                        <img src="${imageUrl}" class="rounded"
                        style="width:100%; height:180px; object-fit:cover;">
                    </a>
                </figure>

                <h3 class="text-capitalize mt-2">${v.venueName}</h3>
                <span>${v.shortDescription}</span>
                <span class="rating d-block my-1">
                    <svg width="20" height="20" class="text-primary">
                        <use xlink:href="#star-solid"></use>
                    </svg>
                    ${v.rating > 0 ? v.rating : "No rating"}
                </span>
                <span class="price fs-6">${v.venueAddress}</span>
            </div>
        </div>
        `;

        wrapper.insertAdjacentHTML("beforeend", slide);
    });

    // Bind wishlist
    setTimeout(bindWishlistClicks, 300);

    // Swiper Init
    setTimeout(() => {
        new Swiper(".products-carousel", {
            slidesPerView: 5,
            spaceBetween: 30,
            speed: 500,
            navigation: {
                nextEl: ".products-carousel-next",
                prevEl: ".products-carousel-prev",
            },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
                991: { slidesPerView: 4 },
                1500: { slidesPerView: 5 }
            }
        });
    }, 200);
}



/* =========================================================
    PAGINATION VENUES LISTING
========================================================= */
function loadPage(page) {
    const wrapper = document.getElementById("venue-list");
    if (!wrapper) return;

    wrapper.innerHTML = "";

    const start = (page - 1) * pageSize;
    const venues = allVenues.slice(start, start + pageSize);

    venues.forEach(v => {
        const imageUrl = v.thumbnail
            ? IMAGE + v.thumbnail.replace("/var/www/backend/", "")
            : "../logo/book.png";

        const rating = v.rating > 0 ? v.rating : "No rating";

        wrapper.innerHTML += `
        <div class="product-item col-md-6 col-lg-3">

            <!-- ❤️ Wishlist -->
            <a class="btn-wishlist" data-id="${v._id}">
                <svg width="24" height="24">
                    <use xlink:href="#heart"></use>
                </svg>
            </a>

            <!-- Image -->
            <figure>
                <a href="./demmy.html?id=${v._id}">
                    <img src="${imageUrl}" class="rounded"
                    style="width:100%; height:180px; object-fit:cover;">
                </a>
            </figure>

            <!-- Title -->
            <h3 class="text-capitalize">${v.venueName}</h3>

            <!-- Short Description -->
            <span class="qty">${v.shortDescription}</span>

            <!-- Rating -->
            <span class="rating">
                <svg width="20" height="20" class="text-primary">
                    <use xlink:href="#star-solid"></use>
                </svg> 
                ${rating}
            </span>

            <!-- Address -->
            <span class="price fs-6 fw-normal">${v.venueAddress}</span>

            <!-- View Details -->
            <div class="mt-2">
                <a href="./demmy.html?id=${v._id}" class="nav-link">View Details</a>
            </div>

        </div>
        `;
    });

    bindWishlistClicks();
    highlightActivePage();
    updatePrevNextButtons();
}



/* =========================================================
    PAGINATION BUTTONS
========================================================= */
function renderPaginationNumbers() {
    const totalPages = Math.ceil(allVenues.length / pageSize);
    const container = document.getElementById("paginationNumbers");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-light");
        btn.innerText = i;

        btn.addEventListener("click", () => {
            currentPage = i;
            loadPage(currentPage);
        });

        container.appendChild(btn);
    }
}

function highlightActivePage() {
    const buttons = document.querySelectorAll("#paginationNumbers button");

    buttons.forEach((btn, index) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-light");

        if (index + 1 === currentPage) {
            btn.classList.remove("btn-light");
            btn.classList.add("btn-primary");
        }
    });
}

function updatePrevNextButtons() {
    const totalPages = Math.ceil(allVenues.length / pageSize);

    if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").disabled = currentPage === 1;

    if (document.getElementById("nextBtn"))
        document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

if (document.getElementById("prevBtn")) {
    document.getElementById("prevBtn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadPage(currentPage);
        }
    });
}

if (document.getElementById("nextBtn")) {
    document.getElementById("nextBtn").addEventListener("click", () => {
        const totalPages = Math.ceil(allVenues.length / pageSize);

        if (currentPage < totalPages) {
            currentPage++;
            loadPage(currentPage);
        }
    });
}



/* =========================================================
    WISHLIST FUNCTIONS
========================================================= */
function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(list) {
    localStorage.setItem("wishlist", JSON.stringify(list));
}

function toggleWishlist(id) {
    let list = getWishlist();

    if (list.includes(id)) {
        list = list.filter(item => item !== id);
    } else {
        list.push(id);
    }

    saveWishlist(list);
}

function bindWishlistClicks() {
    document.querySelectorAll(".btn-wishlist").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const venueId = btn.getAttribute("data-id");

            toggleWishlist(venueId);

            btn.classList.toggle("heart-active");
        });
    });
}


// // --------------------------------------------------------------------------------------

// /* =========================================================
//     GLOBAL VARIABLES
// ========================================================= */
// let allVenues = [];
// let currentPage = 1;
// const pageSize = 12;


// /* =========================================================
//     FETCH VENUES (MAIN ENTRY POINT)
// ========================================================= */
// API.get("/venues")
//     .then(res => {
//         allVenues = res.data.data;

//         // If homepage Top Rated Section exists
//         if (document.getElementById("top-rated-wrapper")) {
//             loadTopRatedVenues(allVenues);
//         }

//         // If venue listing (pagination page) exists
//         if (document.getElementById("venue-list")) {
//             loadPage(currentPage);
//             renderPaginationNumbers();
//         }
//     })
//     .catch(err => console.error("Error loading venues:", err));



// /* =========================================================
//     PAGE 1 — HOME: TOP RATED VENUES SLIDER
// ========================================================= */
// function loadTopRatedVenues(list) {
//     const wrapper = document.getElementById("top-rated-wrapper");
//     if (!wrapper) return;

//     wrapper.innerHTML = "";

//     const wishlist = getWishlist();

//     list.slice(0, 10).forEach(v => {
//         const imageUrl =
//             v.thumbnail
//                 ? IMAGE + v.thumbnail.replace("/var/www/backend/", "")
//                 : "../logo/book.png";

//         const isLiked = wishlist.includes(v._id);

//         const slide = `
//         <div class="swiper-slide">
//             <div class="product-item position-relative">

//                 <!-- ❤️ WISHLIST BUTTON -->
//                 <a class="btn-wishlist ${isLiked ? "heart-active" : ""}" 
//                     data-id="${v._id}"
//                     style="position:absolute; top:10px; right:10px; z-index:10;">
//                     <svg width="24" height="24">
//                         <use xlink:href="#heart"></use>
//                     </svg>
//                 </a>

//                 <figure>
//                     <a href="./modules/venue-details.html?id=${v._id}">
//                         <img src="${imageUrl}" class="rounded"
//                         style="width:100%; height:180px; object-fit:cover;">
//                     </a>
//                 </figure>

//                 <h3 class="text-capitalize mt-2">${v.venueName}</h3>
//                 <span>${v.shortDescription}</span>
//                 <span class="rating d-block my-1">
//                     <svg width="20" height="20" class="text-primary">
//                         <use xlink:href="#star-solid"></use>
//                     </svg>
//                     ${v.rating > 0 ? v.rating : "4.2"}
//                 </span>
//                 <span class="price fs-6 ">${v.venueAddress}</span>
//             </div>
//         </div>
//         `;
//         wrapper.insertAdjacentHTML("beforeend", slide);
//     });

//     // Rebind heart after DOM is updated
//     setTimeout(bindWishlistClicks, 300);

//     // Reinitialize Swiper
//     setTimeout(() => {
//         new Swiper(".products-carousel", {
//             slidesPerView: 5,
//             spaceBetween: 30,
//             speed: 500,
//             navigation: {
//                 nextEl: ".products-carousel-next",
//                 prevEl: ".products-carousel-prev",
//             },
//             breakpoints: {
//                 0: { slidesPerView: 1 },
//                 768: { slidesPerView: 3 },
//                 991: { slidesPerView: 4 },
//                 1500: { slidesPerView: 5 },
//             }
//         });
//     }, 200);
// }




// /* =========================================================
//     PAGE 2 — VENUE LISTING WITH PAGINATION
// ========================================================= */
// function loadPage(page) {
//     const wrapper = document.getElementById("venue-list");
//     if (!wrapper) return;

//     wrapper.innerHTML = "";

//     const start = (page - 1) * pageSize;
//     const venues = allVenues.slice(start, start + pageSize);

//     venues.forEach(v => {
//         const imageUrl =
//             v.thumbnail
//                 ? IMAGE + v.thumbnail.replace("/var/www/backend/", "")
//                 : "../logo/book.png";

//         const rating = v.rating > 0 ? v.rating : "No rating";

//         wrapper.innerHTML += `
//         <div class="product-item col-md-6 col-lg-3">

//             <a class="btn-wishlist" data-id="${v._id}">
//                 <svg width="24" height="24">
//                     <use xlink:href="#heart"></use>
//                 </svg>
//             </a>

//             <figure>
//                 <a href="venue-details.html?id=${v._id}">
//                     <img src="${imageUrl}" class="rounded"
//                     style="width:100%; height:180px; object-fit:cover;">
//                 </a>
//             </figure>

//             <h3 class="text-capitalize">${v.venueName}</h3>
//             <span>${v.shortDescription}</span>

//             <span class="rating">
//                 <svg width="20" height="20" class="text-primary">
//                     <use xlink:href="#star-solid"></use>
//                 </svg>
//                 ${rating}
//             </span>

//             <span class="price">${v.venueAddress}</span>

//             <a href="venue-details.html?id=${v._id}" class="nav-link mt-2">
//                 View Details
//             </a>
//         </div>
//         `;
//     });

//     bindWishlistClicks();
//     highlightActivePage();
//     updatePrevNextButtons();
// }



// /* =========================================================
//     WISHLIST FUNCTIONS
// ========================================================= */
// function getWishlist() {
//     return JSON.parse(localStorage.getItem("wishlist")) || [];
// }

// function saveWishlist(list) {
//     localStorage.setItem("wishlist", JSON.stringify(list));
// }

// function toggleWishlist(id) {
//     let list = getWishlist();

//     if (list.includes(id)) {
//         list = list.filter(item => item !== id);
//     } else {
//         list.push(id);
//     }

//     saveWishlist(list);
// }

// function bindWishlistClicks() {
//     document.querySelectorAll(".btn-wishlist").forEach(btn => {
//         btn.addEventListener("click", e => {
//             e.preventDefault();
//             e.stopPropagation();

//             toggleWishlist(btn.dataset.id);
//             btn.classList.toggle("heart-active");
//         });
//     });
// }


// /* =========================================================
//     PAGINATION FUNCTIONS
// ========================================================= */
// function renderPaginationNumbers() {
//     const totalPages = Math.ceil(allVenues.length / pageSize);
//     const container = document.getElementById("paginationNumbers");
//     if (!container) return;

//     container.innerHTML = "";

//     for (let i = 1; i <= totalPages; i++) {
//         container.innerHTML += `
//             <button class="btn btn-light" onclick="goToPage(${i})">${i}</button>
//         `;
//     }
// }

// function goToPage(num) {
//     currentPage = num;
//     loadPage(currentPage);
// }

// function highlightActivePage() {
//     const buttons = document.querySelectorAll("#paginationNumbers button");
    
//     buttons.forEach((btn, index) => {
//         btn.classList.remove("btn-primary");
//         btn.classList.add("btn-light");

//         if (index + 1 === currentPage) {
//             btn.classList.add("btn-primary");
//         }
//     });
// }

// function updatePrevNextButtons() {
//     const totalPages = Math.ceil(allVenues.length / pageSize);

//     if (document.getElementById("prevBtn"))
//         document.getElementById("prevBtn").disabled = currentPage === 1;

//     if (document.getElementById("nextBtn"))
//         document.getElementById("nextBtn").disabled = currentPage === totalPages;
// }