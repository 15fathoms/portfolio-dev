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

// projects

class Project {
    constructor(name, description, image, video, stack, openSource, asContributor, year, links) {
        this.name = name ? name : null;
        this.description = description ? description : null;
        this.image = image ? image : null;
        this.video = video ? video : null;
        this.stack = stack?.split(',').map((item) => item.trim());
        this.openSource = openSource;
        this.asContributor = asContributor;
        this.year = year ? year : null;
        this.links = links?.split(',').map((item) => item.trim()) || links;
        this.github = this.links.find((link) => link.includes('github.com'));
        this.npm = this.links.find((link) => link.includes('npmjs.com'));
    }
}

const projects = [
    new Project(
        'Tonal CLI',
        'Smart color palette generator – CSS, SCSS, LESS, Stylus, JS, OKLCH-ready',
        null,
        null,
        'Node.js, Javascript',
        true,
        false,
        2025,
        'https://github.com/15fathoms/Tonal, https://www.npmjs.com/package/tonal-kit'
    ),
    new Project(
        'Tailwind Colors',
        'A collection of Tailwind CSS color tokens exported in HEX, RGBA, and OKLCH — ready to use with CSS, SCSS, LESS, and Stylus. 🎨 Perfect for designers & developers who want access to Tailwind’s palette in different workflows.',
        null,
        'video2.mp4',
        'Node.js, Javascript',
        true,
        false,
        2025,
        'https://github.com/15fathoms/tailwind-colors, https://15fathoms.github.io/tailwind-colors/'
    ),
    new Project(
        'express-list-routes',
        'List all routes used in Express[3,4,5]',
        null,
        null,
        'Javascript, Typescript',
        true,
        true,
        2024,
        'https://github.com/labithiotis/express-list-routes, https://github.com/labithiotis/express-list-routes/pull/24'
    ),
    new Project(
        'Completor',
        "Completor is a VS Code extension that bridges your development workflow with locally installed AI models. It enables you to interact with your AI directly from the editor, offering a seamless and efficient way to integrate AI-powered assistance into your coding process.",
        'https://github.com/15fathoms/completor/raw/main/images/code-in-input.png',
        null,
        'Ollama, TypeScript, Node.js',
        true,
        false,
        2025,
        'https://github.com/15fathoms/completor'
    ),
    new Project(
        'TraducThor',
        'TraducThor is an Express server that provides real-time translation services for streamers. It listens to the microphone and translates the spoken words into text, wich are translated into English with Google Translate API. The translated text is then sent to OBS via WebSocket.',
        null,
        null,
        'Node.js, Javascript',
        true,
        false,
        2025,
        'https://github.com/15fathoms/TraducThor'
    ),
    new Project(
        'Obrist',
        'Wine reseller and distributor in Switzerland. I created a custom e-commerce website for them using Shopify and by creating a custom theme with Liquid.',
        'imgs/obrist.png',
        null,
        'Shopify, Liquid, Javascript, SCSS',
        false,
        false,
        2024,
        'https://thewinefamily.ch/',
    ),
    new Project(
        'Baobab Collection',
        'Baobab Collection is a luxury home fragrance brand. I created a custom e-commerce website for them using Shopify and by creating a custom theme with Liquid.',
        'imgs/baobab.png',
        null,
        'Shopify, Liquid, Javascript, SCSS',
        false,
        false,
        2024,
        'https://baobabcollection.com/',
    ),
]

console.log(projects);

const projectsContent = document.querySelector('.projects-content');
let col1 = document.querySelector('.col-1');
let col2 = document.querySelector('.col-2');

let previousCol = col2;
function createProjectCard(project) {
    let template = document.querySelector('template');
    let clone = document.importNode(template.content, true);
    let card = clone.querySelector('.project');
    let img = clone.querySelector('.project-image');
    let title = clone.querySelector('.project-title');
    let description = clone.querySelector('.project-description');

    if(project.image) {
        console.log(project.image);
        img.src = project.image;
        img.alt = project.name;
    }
    else {
        img.remove();
    }

    title.innerText = project.name;
    description.innerText = project.description;

    if(previousCol === col1) {
        col2.appendChild(card);
        previousCol = col2;
    }
    else {
        col1.appendChild(card);
        previousCol = col1;
    }

}

function createProjectCards(projects) {
    projects.forEach((project) => {
        createProjectCard(project);
    });
}

createProjectCards(projects);