// // js/module/getmodules.js

// API.get("/modules")
//     .then(res => {
//         console.log("FULL API RESPONSE:", res.data); // 👈 check structure

//         const modules = res.data; // API returns { success, data: [] }

//         console.log("module data:", modules);

//         const wrapper = document.querySelector(".swiper-wrapper");
//         wrapper.innerHTML = ""; // clear existing slides

//         modules.forEach(item => {
//             const slide = document.createElement("a");
//             slide.classList.add("nav-link", "category-item", "swiper-slide");

//             slide.innerHTML = `
//                     <div class="text-center">
//                         <img src="${IMAGE}${item.icon}" 
//                              alt="${item.title}" 
//                              style="width:70px; height:70px; object-fit:contain;" />

//                         <h3 class="category-title mt-2">${item.title}</h3>
//                     </div>
//                     `;

//             slide.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 console.log("Module ID:", item.moduleId);
//             });

//             wrapper.appendChild(slide);
//         });

//         // Initialize Swiper
//         new Swiper(".category-carousel", {
//             slidesPerView: 4,
//             spaceBetween: 20,
//             navigation: {
//                 nextEl: ".category-carousel-next",
//                 prevEl: ".category-carousel-prev",
//             },
//             breakpoints: {
//                 0: { slidesPerView: 2 },
//                 768: { slidesPerView: 3 },
//                 1024: { slidesPerView: 6 }
//             }
//         });
//     })
//     .catch(err => console.error("Error loading modules:", err));



// js/module/getmodules.js

const MODULE_PAGE_MAP = {
    "Venues": "modules/packagevenuse.html",
    "Transport": "modules/packagerenter.html",
    "Programs": "modules/packageevents.html",
    "Events": "modules/packagecakes.html",
    "Photography": "modules/packagephotography.html",
    "Makeup": "modules/packagemakeup.html",
    "Catering": "modules/packagecatering.html",
    "Ornaments": "modules/packageornaments.html",
};

API.get("/modules")
    .then(res => {
        const modules = res.data;

        const wrapper = document.querySelector("#modules-wrapper");
        wrapper.innerHTML = "";

        modules.forEach(item => {
            const slide = document.createElement("a");
            slide.classList.add("nav-link", "category-item", "swiper-slide");

            slide.innerHTML = `
                <div class="text-center">
                    <img src="${IMAGE}${item.icon}" 
                         alt="${item.title}" 
                         style="width:50px; height:50px; object-fit:contain;" />

                    <h3 class="category-title mt-2">${item.title}</h3>
                </div>
            `;

            slide.addEventListener("click", (e) => {
                e.preventDefault();

                const page = MODULE_PAGE_MAP[item.title];

                if (!page) {
                    alert("Page not found for: " + item.title);
                    return;
                }

                window.location.href = `${page}?moduleId=${item.moduleId}`;
            });

            wrapper.appendChild(slide);
        });

        new Swiper(".category-carousel", {
            slidesPerView: 4,
            spaceBetween: 20,
            navigation: {
                nextEl: ".category-carousel-next",
                prevEl: ".category-carousel-prev",
            },
            breakpoints: {
                0: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 6 }
            }
        });
    })
    .catch(err => console.error("Error loading modules:", err));
