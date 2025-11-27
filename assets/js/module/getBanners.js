
/* ==========================================
   ✅ 1. AUTO INJECT CSS (SAME HEIGHT & WIDTH)
========================================== */
(function injectBannerCSS() {
    const style = document.createElement("style");
    style.innerHTML = `
        .home1-offer-slider .swiper-slide {
            height: 220px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border-radius: 12px;
        }

        .home1-offer-slider .swiper-slide a {
            width: 100%;
            height: 100%;
            display: block;
        }

        .home1-offer-slider .swiper-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
        }

        @media (max-width: 768px) {
            .home1-offer-slider .swiper-slide {
                height: 160px;
            }
        }
    `;
    document.head.appendChild(style);
})();


/* ==========================================
   ✅ 2. LOAD BANNERS FROM API
========================================== */
function loadBannerSlider() {
    const sliderWrapper = document.getElementById("bannerSliderWrapper");

    // ✅ Wait until API loads
    if (!window.API_DATA || !window.API_DATA.banners.length) {
        return setTimeout(loadBannerSlider, 300);
    }

    const banners = window.API_DATA.banners;
    sliderWrapper.innerHTML = ""; 

    banners.forEach(banner => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";

        slide.innerHTML = `
            <a href="#">
                <img src="${formatImage(banner.image)}" alt="${banner.title || 'Offer Banner'}">
            </a>
        `;

        sliderWrapper.appendChild(slide);
    });

    setTimeout(initHomeOfferSwiper, 200);
}


/* ==========================================
   ✅ 3. SWIPER INITIALIZATION
========================================== */
function initHomeOfferSwiper() {
    new Swiper(".home1-offer-slider", {
        slidesPerView: 4,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        pagination: {
            el: ".swiper-pagination1",
            clickable: true
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
        }
    });
}


/* ==========================================
   ✅ 4. AUTO RUN AFTER PAGE LOAD
========================================== */
document.addEventListener("DOMContentLoaded", function () {
    loadBannerSlider();
});