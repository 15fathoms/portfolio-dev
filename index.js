// Smooth Scroll
// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// function splitText(selector) {
//     const element = document.querySelector(selector);
//     const text = element.innerText;
//     const chars = [...text].map((char, index) => {
//         const span = document.createElement("span");
//         span.classList.add("char");
//         span.style.setProperty("--order", index);
//         if (char === " ") {
//             char = "&nbsp;"; // Use non-breaking space for spaces
//         }
//         span.innerHTML = char;
//         element.appendChild(span);
//         return span;
//     });
//     element.innerText = ""; // Clear the original text
//     for(let i = 0; i < chars.length; i++) {
//         element.appendChild(chars[i]);
//     }
// }

// const { chars } = splitText("h1");



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
        'https://eu.baobabcollection.com/',
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
    let links = clone.querySelector('.project-links');
    let githubLinks = project.links.filter(link => link.includes('github'));

    let npmLinks = project.links.find(link => link.includes('npm'));
    let githubPageLinks = githubLinks.find(link => link.startsWith('https://15fathoms.github.io/'));
    let websiteLinks = project.links.find(link => link.includes('https://') && !link.includes('github') && !link.includes('npm'));
    let prLink = githubLinks.find(link => link.includes('pull'));
    let repo = githubLinks.find(link => link.startsWith('https://github.com/15fathoms/'));

    if (githubPageLinks) {
        let githubPageLink = document.createElement('a');
        let span = document.createElement('span');
        githubPageLink.href = githubPageLinks;
        githubPageLink.target = '_blank';
        span.innerText = 'Website';
        githubPageLink.classList.add('website-link');
        let logo = document.createElement('i');
        logo.classList.add('fa', 'fa-brands', 'fa-github');
        logo.classList.add('github-logo');
        githubPageLink.prepend(logo);
        githubPageLink.appendChild(span);
        links.appendChild(githubPageLink);
    }

    if (repo) {
        let repoLink = document.createElement('a');
        let span = document.createElement('span');
        span.innerText = 'Repository';
        repoLink.href = repo;
        repoLink.target = '_blank';
        repoLink.classList.add('repo-link');
        let logo = document.createElement('i');
        logo.classList.add('fa', 'fa-brands', 'fa-github');
        logo.classList.add('github-logo');
        repoLink.prepend(logo);
        repoLink.appendChild(span);
        links.appendChild(repoLink);
    }

    if (prLink) {
        let prLinkElement = document.createElement('a');
        let span = document.createElement('span');
        span.innerText = 'Pull Request';
        prLinkElement.href = prLink;
        prLinkElement.target = '_blank';
        prLinkElement.classList.add('pr-link');
        let logo = document.createElement('i');
        logo.classList.add('fa', 'fa-brands', 'fa-github');
        logo.classList.add('github-logo');
        prLinkElement.prepend(logo);
        prLinkElement.appendChild(span);
        links.appendChild(prLinkElement);
    }

    if (npmLinks) {
        let npmLink = document.createElement('a');
        let span = document.createElement('span');
        npmLink.href = npmLinks;
        npmLink.target = '_blank';
        span.innerText = 'NPM';
        npmLink.classList.add('npm-link');
        let logo = document.createElement('img');
        logo.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/330px-Npm-logo.svg.png';
        logo.alt = 'NPM Logo';
        logo.classList.add('npm-logo');
        npmLink.prepend(logo);
        npmLink.appendChild(span);
        links.appendChild(npmLink);
    }

    if (websiteLinks) {
        let websiteLink = document.createElement('a');
        let span = document.createElement('span');
        websiteLink.href = websiteLinks;
        websiteLink.target = '_blank';
        span.innerText = 'Website';
        websiteLink.classList.add('website-link');
        let logo = document.createElement('i');
        logo.classList.add('fa', 'fa-solid', 'fa-globe');
        logo.classList.add('website-logo');
        websiteLink.prepend(logo);
        websiteLink.appendChild(span);
        links.appendChild(websiteLink);
    }



    if(project.image) {
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