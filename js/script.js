// --- Kinetic Hero Paths ---
function initHeroPaths() {
    const container1 = document.getElementById('hero-paths-1');
    const container2 = document.getElementById('hero-paths-2');
    if (!container1 || !container2) return;

    function createPaths(container, position) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 696 316");
        svg.setAttribute("fill", "none");
        svg.className = "w-full h-full";

        for (let i = 0; i < 36; i++) {
            const pathValue = document.createElementNS("http://www.w3.org/2000/svg", "path");
            const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;

            pathValue.setAttribute("d", d);
            pathValue.setAttribute("stroke", "currentColor");
            pathValue.setAttribute("stroke-width", (0.5 + i * 0.03).toString());
            pathValue.setAttribute("stroke-opacity", (0.1 + i * 0.03).toString());
            pathValue.classList.add("hero-path");
            pathValue.style.color = "rgba(241, 245, 249, 0.2)";

            svg.appendChild(pathValue);

            // GSAP Animation
            gsap.set(pathValue, { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 0.6 });

            gsap.to(pathValue, {
                strokeDashoffset: 0,
                opacity: 0.3,
                duration: 20 + Math.random() * 10,
                repeat: -1,
                yoyo: true,
                ease: "linear",
                delay: i * 0.1
            });

            gsap.to(pathValue, {
                opacity: [0.3, 0.6, 0.3],
                duration: 5 + Math.random() * 5,
                repeat: -1,
                ease: "sine.inOut"
            });
        }
        container.appendChild(svg);
    }

    createPaths(container1, 1);
    createPaths(container2, -1);
}

// Register Plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initHeroPaths();
});

// Initialize Lenis for Smooth "Butterfly" Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- 1. CINEMATIC INTRO ---
const introCanvas = document.getElementById('intro-canvas');
const introCtx = introCanvas.getContext('2d');
let introWidth = window.innerWidth;
let introHeight = window.innerHeight;
introCanvas.width = introWidth;
introCanvas.height = introHeight;

const introParticles = [];
const introColors = ['#E11D2E', '#FFFFFF'];

class IntroParticle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * introWidth;
        this.y = Math.random() * introHeight;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.color = introColors[Math.floor(Math.random() * introColors.length)];
        this.alpha = Math.random() * 0.5 + 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > introWidth || this.y < 0 || this.y > introHeight) {
            this.reset();
        }
    }
    draw() {
        introCtx.globalAlpha = this.alpha;
        introCtx.fillStyle = this.color;
        introCtx.beginPath();
        introCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        introCtx.fill();
    }
}

// Create Intro Particles
for (let i = 0; i < 120; i++) {
    introParticles.push(new IntroParticle());
}

function animateIntro() {
    introCtx.clearRect(0, 0, introWidth, introHeight);
    introParticles.forEach(p => {
        p.update();
        p.draw();
    });
    if (document.getElementById('intro-overlay').style.display !== 'none') {
        requestAnimationFrame(animateIntro);
    }
}
animateIntro();

// Intro Timeline
const introTl = gsap.timeline();
introTl.to(".intro-logo", {
    scale: 1,
    opacity: 1,
    duration: 1.5,
    ease: "power3.out",
    delay: 0.5
})
    .to("#intro-overlay", {
        yPercent: -100,
        duration: 1.5,
        ease: "power4.inOut",
        onComplete: () => {
            // Stop intro canvas loop after transition
            document.getElementById('intro-overlay').style.display = 'none';
        }
    }, "+=0.5")
    .from(".hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    }, "-=0.8");


// --- 2. HERO INTERACTIVE CANVAS (Connect Dots) ---
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
let heroWidth = window.innerWidth;
let heroHeight = window.innerHeight;
heroCanvas.width = heroWidth;
heroCanvas.height = heroHeight;

let mouse = { x: undefined, y: undefined };
const nodes = [];

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Node {
    constructor() {
        this.x = Math.random() * heroWidth;
        this.y = Math.random() * heroHeight;
        this.size = Math.random() * 1.5 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.color = '#F1F5F9'; // White for Dark Mode
    }
    draw() {
        heroCtx.fillStyle = this.color;
        heroCtx.globalAlpha = 0.4; // Slightly increased alpha
        heroCtx.beginPath();
        heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        heroCtx.fill();
    }
    update() {
        // Autonomous drift
        this.x += this.vx;
        this.y += this.vy;

        // Boundary check
        if (this.x < 0 || this.x > heroWidth) this.vx *= -1;
        if (this.y < 0 || this.y > heroHeight) this.vy *= -1;

        // Mouse proximity pull
        if (mouse.x) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
                const force = (200 - distance) / 200;
                this.x += dx * force * 0.05;
                this.y += dy * force * 0.05;
            } else {
                // Return to base position (subtle)
                const dxBase = this.baseX - this.x;
                const dyBase = this.baseY - this.y;
                // this.x += dxBase * 0.01;
                // this.y += dyBase * 0.01;
            }
        }
    }
}

for (let i = 0; i < 100; i++) {
    nodes.push(new Node());
}

function animateHero() {
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    // Dynamic Mesh
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();

        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                heroCtx.beginPath();
                heroCtx.strokeStyle = `rgba(241, 245, 249, ${0.1 * (1 - distance / 150)})`;
                heroCtx.lineWidth = 0.5;
                heroCtx.moveTo(nodes[i].x, nodes[i].y);
                heroCtx.lineTo(nodes[j].x, nodes[j].y);
                heroCtx.stroke();
            }
        }
    }

    // Red Interaction Point (Glow)
    if (mouse.x && window.innerWidth > 768) {
        heroCtx.globalAlpha = 0.4;
        heroCtx.fillStyle = '#E11D2E';
        heroCtx.beginPath();
        heroCtx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        heroCtx.fill();

        // Brand Glow around cursor
        const gradient = heroCtx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        gradient.addColorStop(0, 'rgba(225, 29, 46, 0.15)');
        gradient.addColorStop(1, 'transparent');
        heroCtx.fillStyle = gradient;
        heroCtx.beginPath();
        heroCtx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        heroCtx.fill();
    }

    heroCtx.globalAlpha = 1.0;
    requestAnimationFrame(animateHero);
}
animateHero();


// --- 3. NAVIGATION & MOBILE MENU (SimpleHeader Sheet) ---
const menuToggle = document.getElementById('menu-toggle');
const sheetDrawer = document.getElementById('sheet-drawer');
const sheetOverlay = document.getElementById('sheet-overlay');
const closeBtn = document.getElementById('close-btn');
const sheetLinks = document.querySelectorAll('.sheet-link, .sheet-btn-primary');

function openMenu() {
    sheetDrawer.classList.remove('-translate-x-full');
    sheetOverlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeMenu() {
    sheetDrawer.classList.add('-translate-x-full');
    sheetOverlay.classList.add('opacity-0', 'pointer-events-none');
}

if (menuToggle) menuToggle.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (sheetOverlay) sheetOverlay.addEventListener('click', closeMenu);

sheetLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        closeMenu();
        if (href && href !== '#') {
            e.preventDefault();
            setTimeout(() => {
                const target = document.querySelector(href);
                if (target) lenis.scrollTo(target, { offset: -80 });
            }, 300);
        }
    });
});

// Desktop Links Smooth Scroll
document.querySelectorAll('.nav-ghost-link, a[href^="#"].group').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            lenis.scrollTo(target, { offset: -80 });
        }
    });
});


// --- 4. SCROLL ANIMATIONS (Grid & Elements) ---
gsap.utils.toArray('.glass-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: i * 0.1
    });
});

// Update Header on Scroll
ScrollTrigger.create({
    start: 'top -50',
    end: 99999,
    toggleClass: { className: 'scrolled', targets: '#navbar' }
});

// Window Resize
window.addEventListener('resize', () => {
    heroWidth = heroCanvas.width = window.innerWidth;
    heroHeight = heroCanvas.height = window.innerHeight;
    introWidth = introCanvas.width = window.innerWidth;
    introHeight = introCanvas.height = window.innerHeight;
});

// --- 5. SIGNATURE FOOTER & ADVANCED INTERACTIONS ---



// 3D Tilt for Cards (AmazingCard Experience)
const tiltCards = document.querySelectorAll('.tilt-card, .pillar-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out"
        });
    });
});

// Staggered Pop-from-Down Reveal for Pillar Cards
gsap.utils.toArray('.pillar-card').forEach((card) => {
    const content = card.querySelectorAll('.relative.z-20 > *');

    gsap.from(content, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        clearProps: "all"
    });
});

// Refresh ScrollTrigger for new layout
ScrollTrigger.refresh();

// Magnetic Hub (Proximity SNAP)
const magnets = document.querySelectorAll('.magnetic-icon');

magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Relative mouse position
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // Snap towards cursor
        gsap.to(magnet, {
            x: dx * 0.45,
            y: dy * 0.45,
            duration: 0.3,
            ease: "power2.out"
        });

        // Icon Glow & Rotation
        const icon = magnet.querySelector('i');
        gsap.to(icon, {
            color: '#E11D2E',
            rotation: 15 * (dx / (rect.width / 2)),
            duration: 0.3
        });
    });

    magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });

        const icon = magnet.querySelector('i');
        gsap.to(icon, {
            color: '', // Resets to CSS default
            rotation: 0,
            duration: 0.6
        });
    });

    // 360 Rotation on click or specific pulse
    magnet.addEventListener('mouseenter', () => {
        gsap.to(magnet.querySelector('i'), {
            rotation: 360,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    });
});

// Staggered Entrance for Content Blocks
if (window.innerWidth > 768) {
    gsap.utils.toArray(['section > div', '.bento-item']).forEach((block) => {
        gsap.from(block, {
            scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            clearProps: "all"
        });
    });

    // Special Reveal for Industry Cards
    gsap.from(".industry-card", {
        scrollTrigger: {
            trigger: ".industry-grid",
            start: "top 80%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power4.out",
        clearProps: "all"
    });

    // Impact Container Reveal
    gsap.from(".solution-impact-container", {
        scrollTrigger: {
            trigger: ".solution-impact-container",
            start: "top 90%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
        clearProps: "all"
    });

    // --- Line-Mask Reveal Animation (Apple/Linear Style) ---
    document.querySelectorAll('.reveal-mask').forEach((mask) => {
        const lines = mask.querySelectorAll('.reveal-line');
        if (lines.length === 0) {
            const content = mask.innerHTML;
            mask.innerHTML = `<span class="reveal-line">${content}</span>`;
        }
        gsap.from(mask.querySelectorAll('.reveal-line'), {
            scrollTrigger: {
                trigger: mask,
                start: "top 85%",
            },
            y: 60,
            opacity: 0,
            stagger: 0.12,
            duration: 1.2,
            ease: "power4.out",
            clearProps: "all"
        });
    });

    // --- Fade-Up Observer for Staggered Entrances ---
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.08}s`;
        fadeObserver.observe(el);
    });

    // Solution Card Stagger Entrance
    gsap.from(".sol-card", {
        scrollTrigger: {
            trigger: "#solutions",
            start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all"
    });
}

// Footer Parallax (Slide out from underneath)
gsap.from(".signature-footer", {
    yPercent: -40,
    opacity: 0.5,
    scrollTrigger: {
        trigger: ".signature-footer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
    }
});
// Refresh ScrollTrigger for new layout
ScrollTrigger.refresh();

// Sticky Side Numbering Logic (Optional: change opacity or number based on active card)
gsap.utils.toArray('.pillar-card').forEach((card, i) => {
    ScrollTrigger.create({
        trigger: card,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => gsap.to(`.sticky-showcase-sidebar .text-navy-to-slate`, { opacity: 1, duration: 0.3 }),
        onLeave: () => gsap.to(`.sticky-showcase-sidebar .text-navy-to-slate`, { opacity: 0.7, duration: 0.3 }),
        onEnterBack: () => gsap.to(`.sticky-showcase-sidebar .text-navy-to-slate`, { opacity: 1, duration: 0.3 }),
        onLeaveBack: () => gsap.to(`.sticky-showcase-sidebar .text-navy-to-slate`, { opacity: 0.7, duration: 0.3 })
    });
});

// --- 4. FOCUS RAIL SYSTEM (React Port) ---
const focusRailItems = [
    {
        id: 0,
        title: "Electronics & <span class='opacity-40'>Robotics</span>",
        desc: "Intelligent hardware systems powering automation. From industrial robotics to embedded IoT devices.",
        meta: "HARDWARE_SYS",
        color: "rgba(225, 29, 46, 0.4)" // Smartify Red
    },
    {
        id: 1,
        title: "Software & <span class='opacity-40'>AI</span>",
        desc: "AI-powered algorithms transforming data into decisions. Neural networks driving next-gen logic.",
        meta: "NEURAL_CORE",
        color: "rgba(56, 189, 248, 0.4)" // Cyan
    },
    {
        id: 2,
        title: "Smart <span class='opacity-40'>Future</span>",
        desc: "Education & Innovation. Preparing the next generation with immersive tech and adaptive learning.",
        meta: "EDU_INNO",
        color: "rgba(168, 85, 247, 0.4)" // Purple
    },
    {
        id: 3,
        title: "Energies <span class='opacity-40'>Matrix</span>",
        desc: "Clean Power & Sustainability solutions. Smart grids optimizing consumption for a greener planet.",
        meta: "SUSTAINABLE",
        color: "rgba(34, 197, 94, 0.4)" // Green
    },
    {
        id: 4,
        title: "Digital <span class='opacity-40'>Strategy</span>",
        desc: "Strategy & Branding presence. Connecting global networks with high-impact digital experiences.",
        meta: "CONNECTIVITY",
        color: "rgba(251, 146, 60, 0.4)" // Orange
    }
];

let activeRailIndex = 0;
const totalRailItems = focusRailItems.length;
let railCards = null;
let railTextContainer = null;
let railCounter = null;
let railAmbience = null;

function initFocusRail() {
    railCards = document.querySelectorAll('.focus-card');
    railTextContainer = document.getElementById('rail-text-container');
    railCounter = document.getElementById('rail-counter');
    const amb = document.getElementById('rail-ambience');
    railAmbience = amb ? amb.querySelector('div') : null;

    if (railCards.length > 0) updateFocusRail();

    // Controls
    const prevBtn = document.getElementById('rail-prev');
    const nextBtn = document.getElementById('rail-next');
    if (prevBtn) prevBtn.addEventListener('click', () => {
        activeRailIndex = wrapIndex(activeRailIndex - 1, totalRailItems);
        updateFocusRail();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        activeRailIndex = wrapIndex(activeRailIndex + 1, totalRailItems);
        updateFocusRail();
    });

}

// Wrap index helper
function wrapIndex(index, length) {
    return ((index % length) + length) % length;
}

function updateFocusRail() {
    if (!railCards) return;

    railCards.forEach((card, index) => {
        let offset = index - activeRailIndex;
        // visual wrap logic for 5 items
        if (offset > 2) offset -= totalRailItems;
        if (offset < -2) offset += totalRailItems;

        const isCenter = offset === 0;
        const dist = Math.abs(offset);

        // REACT PORT VALUES
        const xOffset = offset * 320;
        const zOffset = -dist * 180;
        const rotateY = offset * -20;
        const scale = isCenter ? 1 : 0.85;
        const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.5);
        const blur = isCenter ? 0 : dist * 6;
        const brightness = isCenter ? 1 : 0.5;
        const zIndex = 10 - dist;

        // GSAP Animation (Matching React Spring Physics)
        // Base Spring: stiffness 300, damping 30 => elastic.out(1, 0.4)
        gsap.to(card, {
            x: xOffset,
            z: zOffset,
            rotateY: rotateY, // Spatial
            scale: scale, // Scale (Tap Spring would be bouncier, but standard is fine)
            opacity: opacity,
            filter: `blur(${blur}px) brightness(${brightness})`,
            zIndex: zIndex,
            duration: 1.2, // Slower duration
            ease: "power3.out", // Smoother easing (less snap)
            overwrite: 'auto'
        });

        // Border Active
        const border = card.querySelector('.card-border');
        if (isCenter) {
            card.classList.add('active');
            if (border) gsap.to(border, { borderColor: '#E11D2E', duration: 0.3 });
            // Dynamic Ambience Color
            if (railAmbience) {
                gsap.to(railAmbience, { backgroundColor: focusRailItems[activeRailIndex].color, duration: 0.6 });
            }
        } else {
            card.classList.remove('active');
            if (border) gsap.to(border, { borderColor: 'rgba(255, 255, 255, 0.1)', duration: 0.3 });
        }

        // Click to activate
        card.onclick = () => {
            if (offset !== 0) {
                activeRailIndex = wrapIndex(activeRailIndex + offset, totalRailItems);
                updateFocusRail();
            }
        };
    });

    // Update Text
    if (railTextContainer) {
        const item = focusRailItems[activeRailIndex];
        gsap.to(railTextContainer, {
            opacity: 0,
            y: 10,
            filter: "blur(4px)",
            duration: 0.2,
            onComplete: () => {
                railTextContainer.innerHTML = `
                    <div class="space-y-2">
                        <div class="flex items-center justify-center md:justify-start">
                            <span class="operational-line"></span>
                            <span class="font-mono text-xs text-smartfy-red tracking-widest uppercase font-bold">${item.meta}</span>
                        </div>
                        <h3 class="focus-rail-title">${item.title}</h3>
                        <p class="focus-rail-desc">${item.desc}</p>
                    </div>
                `;
                gsap.to(railTextContainer, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" });
            }
        });
    }

    if (railCounter) railCounter.innerText = `0${activeRailIndex + 1} / 0${totalRailItems}`;
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    initFocusRail();
});


