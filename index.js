// Smooth Scroll
// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);




let slider = document.querySelector('.track');
let bullet = document.querySelector('.bullet');

function setupDrag(slider) {
    let startX = 0;
    let isDragging = false;
    const threshold = slider.children[0].clientWidth * 0.25; // 25% de la largeur de l'élément
    const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
    let hasSlid = false;

    const handleStart = (e) => {
        e.stopPropagation();
        startX = getX(e);
        isDragging = true;
        hasSlid = false;
        slider.style.transition = 'none'; // Disable transition during drag
    };

    const handleMove = (e) => {
        e.stopPropagation();
        if (!isDragging) return;
        let currentIndex = parseInt(slider.dataset.currentIndex || 0, 10);
        const currentX = getX(e);
        const deltaX = currentX - startX;
        // Limite à gauche (index 0)
        if (currentIndex === 0 && deltaX > 0) return;

        // Limite à droite (dernier slide)
        if (currentIndex === slider.children.length - 1 && deltaX < 0) return;

        // Autoriser le déplacement dans la plage
        slider.style.transform = `translateX(calc(-${100 * currentIndex}% - ${16 * currentIndex}px + ${deltaX}px))`;

        if (!hasSlid && deltaX > threshold) {
            slidePrev(slider);
            isDragging = false;
            hasSlid = true;
        } else if (!hasSlid && deltaX < -threshold) {
            slideNext(slider);
            isDragging = false;
            hasSlid = true;
        }
    };

    const handleEnd = (e) => {
        e.stopPropagation();
        const currentIndex = parseInt(slider.dataset.currentIndex || 0, 10);

        if (!hasSlid) {
            animateSlider(slider, null, currentIndex);
        }
        isDragging = false;
    };

    // Souris
    slider.addEventListener('mousedown', handleStart);
    slider.addEventListener('mousemove', handleMove);
    slider.addEventListener('mouseup', handleEnd);
    slider.addEventListener('mouseleave', handleEnd);

    // Mobile
    slider.addEventListener('touchstart', handleStart);
    slider.addEventListener('touchmove', handleMove);
    slider.addEventListener('touchend', handleEnd);
    slider.addEventListener('touchcancel', handleEnd);
}

function slideNext(slider) {
    const slides = [...slider.children];
    const current = slider.querySelector('.active');
    const currentIndex = parseInt(slider.dataset.currentIndex || 0, 10);

    if (currentIndex < slides.length - 1) {
        current.classList.remove('active');
        const newIndex = currentIndex + 1;
        slides[newIndex].classList.add('active');
        slider.dataset.currentIndex = newIndex;
        applyAnimation(animateSlider, slider, 'next', newIndex);
    }
}


function slidePrev(slider) {
    const slides = [...slider.children];
    const current = slider.querySelector('.active');
    const currentIndex = parseInt(slider.dataset.currentIndex || 0, 10);

    if (currentIndex > 0) {
        current.classList.remove('active');
        const newIndex = currentIndex - 1;
        slides[newIndex].classList.add('active');
        slider.dataset.currentIndex = newIndex;
        applyAnimation(animateSlider, slider, 'prev', newIndex);
    }
}


const initFirstSlide = (slider) => {
    slider.dataset.currentIndex = 0;
    const firstSlide = slider?.children[0];
    firstSlide.classList.add('active');
}

const applyAnimation = (func, slider, direction, currentIndex) => {
    func(slider, direction, currentIndex);
}

function animateSlider(slider, direction, currentIndex) {
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    let MAX = 100; // 32 is the gap between slides
    if (direction === 'next') {
        slider.style.transform = `translateX(calc(-${100 * currentIndex}% - ${gap * currentIndex}px))`;
        slider.style.transition = 'transform 0.5s ease-in';
        bullet.style.transform = `translateX(calc(100% * ${currentIndex}))`;
    }
    if (direction === 'prev') {
        slider.style.transform = `translateX(calc(-${MAX * (currentIndex)}% - ${gap * currentIndex}px))`;
        slider.style.transition = 'transform 0.5s ease-in';
        bullet.style.transform = `translateX(calc(100% * ${currentIndex}))`;
    }
    if (direction === null) {
        slider.style.transform = `translateX(calc(-${MAX * (currentIndex)}% - ${gap * currentIndex}px))`;
        slider.style.transition = 'transform 0.5s ease-in';
        bullet.style.transform = `translateX(calc(100% * ${currentIndex}))`;
    }
}

function initSlider(slider) {
    initFirstSlide(slider);
    setupDrag(slider);
}

initSlider(slider);