var slideImage = document.querySelectorAll(".slide-image");
var slidesContainer = document.querySelector(".slides-container");
var nextBtn = document.querySelector(".next-btn");
var prevBtn = document.querySelector(".prev-btn");
var navigationDots = document.querySelector(".navigation-dots");

var numberOfImages = slideImage.length;
var slideWidth = slideImage[0].clientWidth;
var currentSlide = 0;

// Set up the slider

function init() {
    slideImage.forEach(function (img, i) {
        img.style.left = i * 100 + "%";
    });
    slideImage[0].classList.add("active");
    createNavigationDots();
}

init();

// For navigation dots

function createNavigationDots() {
    var _loop = function _loop(i) {
        dot = document.createElement("div");
        dot.classList.add("individual-dot");
        navigationDots.appendChild(dot);
        dot.addEventListener("click", function () {
            goToImage(i);
        });
    };

    for (var i = 0; i < numberOfImages; i++) {
        var dot;

        _loop(i);
    }

    navigationDots.children[0].classList.add("active");
}

// Next Button

nextBtn.addEventListener("click", function () {
    if (currentSlide >= numberOfImages - 1) {
        goToImage(0);
        return;
    }

    currentSlide++;
    goToImage(currentSlide);
});
// Previous Button

prevBtn.addEventListener("click", function () {
    if (currentSlide <= 0) {
        goToImage(numberOfImages - 1);
        return;
    }

    currentSlide--;
    goToImage(currentSlide);
});

// Go To exact image

function goToImage(slideNumber) {
    slidesContainer.style.left = -slideWidth * slideNumber + "px";
    currentSlide = slideNumber;
    setActiveClass();
}

// Set Active Class to current image

function setActiveClass() {
    // Set active class for current image
    var currentActive = document.querySelector(".slide-image.active");
    currentActive.classList.remove("active");
    slideImage[currentSlide].classList.add("active");
    //   set active class for current navigation dot
    var currentDot = document.querySelector(".individual-dot.active");
    currentDot.classList.remove("active");
    navigationDots.children[currentSlide].classList.add("active");
}
