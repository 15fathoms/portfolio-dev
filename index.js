// Smooth Scroll
// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// circle button 

if (document.querySelector(".roundButton")) {
    let text = [...document.querySelector(".roundButton").textContent];
    document.querySelector(".roundButton").textContent = "";
    let container = document.createElement("div");
    text.forEach((elm) => {
        let span = document.createElement("span");
        span.textContent = elm;
        container.appendChild(span);
    });
    container.classList.add("radiusText");
    document.querySelector(".roundButton").appendChild(container);

    let w = document.querySelector(".radiusText").offsetWidth;
    let angleRad = 600 / (2 * 100);
    let angle = (2 * angleRad * 180) / Math.PI / text.length;
    let index = 2;
    document.querySelectorAll("span").forEach((elm) => {
        elm.style.transform = `translate(${0}px,-50%) rotate(${index * angle - (text.length * angle) / 2
            }deg)`;
        index++;
    });
}

