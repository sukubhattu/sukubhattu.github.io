const slideImage = document.querySelectorAll(".slide-image");
const slidesContainer = document.querySelector(".slides-container");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const navigationDots = document.querySelector(".navigation-dots");

let numberOfImages = slideImage.length;
let slideWidth = slideImage[0].clientWidth;
let currentSlide = 0;

// Set up the slider

function init() {
    slideImage.forEach((img, i) => {
        img.style.left = i * 100 + "%";
    });

    slideImage[0].classList.add("active");

    createNavigationDots();
}

init();

// For navigation dots

function createNavigationDots() {
    for (let i = 0; i < numberOfImages; i++) {
        const dot = document.createElement("div");
        dot.classList.add("individual-dot");
        navigationDots.appendChild(dot);

        dot.addEventListener("click", () => {
            goToImage(i);
        });
    }

    navigationDots.children[0].classList.add("active");
}

// Next Button

nextBtn.addEventListener("click", () => {
    if (currentSlide >= numberOfImages - 1) {
        goToImage(0);
        return;
    }

    currentSlide++;
    goToImage(currentSlide);
});

// Previous Button

prevBtn.addEventListener("click", () => {
    if (currentSlide <= 0) {
        goToImage(numberOfImages - 1);
        return;
    }

    currentSlide--;
    goToImage(currentSlide);
});

// Go To exact image

function goToImage(slideNumber) {
    slidesContainer.style.transform =
        "translateX(-" + slideWidth * slideNumber + "px)";
    currentSlide = slideNumber;
    setActiveClass();
}

// Set Active Class to current image

function setActiveClass() {
    // Set active class for current image
    let currentActive = document.querySelector(".slide-image.active");
    currentActive.classList.remove("active");
    slideImage[currentSlide].classList.add("active");
    //   set active class for current navigation dot
    let currentDot = document.querySelector(".individual-dot.active");
    currentDot.classList.remove("active");
    navigationDots.children[currentSlide].classList.add("active");
}
