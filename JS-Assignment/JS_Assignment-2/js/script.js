function Carousel(name, holdTime, transitionTime) {
    this.name = name;
    // console.log(this.name);
    this.holdTime = holdTime;
    this.transitionTime = transitionTime;

    var carousel = document.getElementById(this.name);
    var carouselContainer = carousel.querySelector(".carousel-container");
    var slideImage = carousel.querySelectorAll(".slide-image");
    var slidesContainer = carousel.querySelector(".slides-container");

    var next = document.createElement("div");
    next.className += "next-btn";
    next.innerHTML = "Nex";
    carouselContainer.appendChild(next);

    var previous = document.createElement("div");
    previous.className += "prev-btn";
    previous.innerHTML = "Pre";
    carouselContainer.appendChild(previous);

    var navigation = document.createElement("div");
    navigation.className += "navigation-dots";
    carouselContainer.appendChild(navigation);

    var nextBtn = carousel.querySelector(".next-btn");
    var prevBtn = carousel.querySelector(".prev-btn");
    var navigationDots = carousel.querySelector(".navigation-dots");

    // to check number of images
    var numberOfImages = slideImage.length;

    // console.log(numberOfImages);
    if (numberOfImages == 0) {
        slidesContainer.style.display = "none";
        previous.style.display = "none";
        next.style.display = "none";
        navigation.style.display = "none";
        var noImage = document.createElement("div");
        noImage.className += "no-image";
        noImage.innerHTML = "Please uncomment image/ add image in index.html";
        carouselContainer.appendChild(noImage);
        console.log("Please uncomment image/ add image in index.html");
        return;
    }
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
            // console.log(i);
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

        // var widthOne = window
        //     .getComputedStyle(slidesContainer)
        //     .getPropertyValue("left");
        // console.log(widthOne);
        // slidesContainer.style.left =
        //     parseInt(widthOne) - 0.2 * slideWidth + "px";
        // console.log(slidesContainer.style.left);
        currentSlide = slideNumber;
        setActiveClass();
    }
    setInterval(function () {
        if (currentSlide >= numberOfImages - 1) {
            goToImage(0);
            return;
        }
        currentSlide++;
        goToImage(currentSlide);
    }, this.holdTime * 1000);

    // Set Active Class to current image
    function setActiveClass() {
        // Set active class for current image
        var currentActive = carousel.querySelector(".slide-image.active");
        currentActive.classList.remove("active");
        slideImage[currentSlide].classList.add("active");
        //   set active class for current navigation dot
        var currentDot = carousel.querySelector(".individual-dot.active");
        currentDot.classList.remove("active");
        navigationDots.children[currentSlide].classList.add("active");
    }
}
// new Carousel("divId", holdTime, transitionTime)
var carousel1 = new Carousel("carousel1", 2, 1);
var carousel2 = new Carousel("carousel2", 3, 1);
var carousel3 = new Carousel("carousel3", 4, 1);
