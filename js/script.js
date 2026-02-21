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
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Butterfly ease
    smooth: true,
    mouseMultiplier: 1,
    touchMultiplier: 2,
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame to GSAP's ticker for performance
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable lag smoothing in GSAP to prevent jumps during smooth scroll
gsap.ticker.lagSmoothing(0);

// --- 1. CINEMATIC INTRO REMOVED ---



// --- 2. HERO INTERACTIVE CANVAS (Connect Dots) ---
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d');
let heroWidth = window.innerWidth;
let heroHeight = window.innerHeight;
if (heroCanvas) {
    heroCanvas.width = heroWidth;
    heroCanvas.height = heroHeight;
}

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
        if (!heroCtx) return;
        heroCtx.fillStyle = this.color;
        heroCtx.globalAlpha = 0.4;
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
            }
        }
    }
}

// Only init if canvas exists
if (heroCanvas) {
    for (let i = 0; i < 100; i++) {
        nodes.push(new Node());
    }
}

function animateHero() {
    if (!heroCtx || !heroCanvas) return;
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



// ===================================================================
// SMARTIFY ENTERPRISE NAV — Complete JS System
// ===================================================================

(function initEnterpriseNav() {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const sheetDrawer = document.getElementById('sheet-drawer');
    const sheetOverlay = document.getElementById('sheet-overlay');
    const closeBtn = document.getElementById('close-btn');

    // ---- 1. Mobile drawer open/close ----
    function openMenu() {
        sheetDrawer.classList.remove('-translate-x-full');
        sheetOverlay.classList.remove('opacity-0', 'pointer-events-none');
        sheetDrawer.classList.add('is-open');
    }
    function closeMenu() {
        sheetDrawer.classList.add('-translate-x-full');
        sheetOverlay.classList.add('opacity-0', 'pointer-events-none');
        sheetDrawer.classList.remove('is-open');
    }

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (sheetOverlay) sheetOverlay.addEventListener('click', closeMenu);

    // Close sheet when any non-accordion link inside it is clicked
    sheetDrawer && sheetDrawer.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            closeMenu();
            if (href && href !== '#') {
                e.preventDefault();
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target && typeof lenis !== 'undefined') lenis.scrollTo(target, { offset: -70 });
                }, 320);
            }
        });
    });

    // ---- 2. Mobile accordion groups ----
    document.querySelectorAll('.mobile-acc-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.dataset.mobileAcc;
            const body = document.getElementById(targetId);
            if (!body) return;
            const isExpanded = body.classList.contains('is-open');
            // Collapse all others
            document.querySelectorAll('.mobile-acc-body.is-open').forEach(b => {
                b.classList.remove('is-open');
                const t = document.querySelector(`[data-mobile-acc="${b.id}"]`);
                if (t) t.classList.remove('is-open');
            });
            if (!isExpanded) {
                body.classList.add('is-open');
                trigger.classList.add('is-open');
            }
        });
    });

    // ---- 3. Desktop dropdown system ----
    const dropdownItems = document.querySelectorAll('.snav-has-dropdown');
    let openTimer = null;
    let closeTimer = null;
    let currentOpen = null;

    function openItem(item) {
        if (currentOpen && currentOpen !== item) closeItem(currentOpen, true);
        item.classList.add('is-open');
        const trigger = item.querySelector('.snav-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        currentOpen = item;
    }

    function closeItem(item, immediate = false) {
        const doClose = () => {
            item.classList.remove('is-open');
            const trigger = item.querySelector('.snav-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
            if (currentOpen === item) currentOpen = null;
        };
        if (immediate) {
            clearTimeout(closeTimer);
            doClose();
        } else {
            closeTimer = setTimeout(doClose, 120);
        }
    }

    function closeAllItems() {
        dropdownItems.forEach(item => closeItem(item, true));
    }

    dropdownItems.forEach(item => {
        // Hover trigger
        item.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
            clearTimeout(openTimer);
            openTimer = setTimeout(() => openItem(item), 130);
        });

        item.addEventListener('mouseleave', () => {
            clearTimeout(openTimer);
            closeItem(item);
        });

        // Click for touch / keyboard
        const trigger = item.querySelector('.snav-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                if (item.classList.contains('is-open')) {
                    closeItem(item, true);
                } else {
                    openItem(item);
                }
            });
        }
    });

    // Escape key closes all
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllItems();
    });

    // Click outside closes dropdowns
    document.addEventListener('click', e => {
        if (!e.target.closest('.snav-has-dropdown')) closeAllItems();
    });

    // ---- 4. Company mega GSAP text animations ----
    const companyWrap = document.getElementById('company-dropdown-wrap');
    const headline = document.getElementById('company-headline');
    const storyBlock = document.querySelector('.company-story-block');
    const companyBlocks = document.querySelectorAll('.company-block');
    const brandStatement = document.getElementById('company-brand-statement');

    // Set initial states
    if (!isReduced && headline) {
        gsap.set(headline, { opacity: 0, y: 20 });
        gsap.set(storyBlock, { opacity: 0, y: 15 });
        gsap.set(companyBlocks, { opacity: 0, y: 12 });
        if (brandStatement) gsap.set(brandStatement, { opacity: 0, y: 8 });
    }

    if (companyWrap) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.attributeName === 'class') {
                    const isOpen = companyWrap.classList.contains('is-open');
                    if (isOpen && !isReduced) {
                        // Animate in
                        gsap.to(headline, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.05 });
                        gsap.to(storyBlock, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.22 });
                        gsap.fromTo(companyBlocks,
                            { opacity: 0, y: 12 },
                            { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
                        );
                        if (brandStatement) gsap.fromTo(brandStatement,
                            { opacity: 0, y: 8 },
                            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.6 }
                        );
                    } else if (!isOpen && !isReduced) {
                        // Reset
                        gsap.set([headline, storyBlock], { opacity: 0, y: 20 });
                        gsap.set(companyBlocks, { opacity: 0, y: 12 });
                        if (brandStatement) gsap.set(brandStatement, { opacity: 0, y: 8 });
                    }
                }
            });
        });
        observer.observe(companyWrap, { attributes: true });
    }

    // Backdrop click for company mega
    const companyBackdrop = document.getElementById('company-backdrop-blur');
    if (companyBackdrop) {
        companyBackdrop.addEventListener('click', () => closeAllItems());
    }

    // ---- 5. Desktop smooth scroll for all nav anchor links ----
    document.querySelectorAll('.snav-link[href^="#"], .snav-dropdown-link[href^="#"], .snav-cta-btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            closeAllItems();
            const target = document.querySelector(href);
            if (target && typeof lenis !== 'undefined') lenis.scrollTo(target, { offset: -70 });
        });
    });

    // ---- 6. Scroll compress (navbar height shrinks on scroll) ----
    let lastScrollY = 0;
    const onScroll = () => {
        const y = window.scrollY;
        if (header) {
            if (y > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScrollY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init state

    // ---- 7. Active section detection ----
    const sectionMap = {
        '#solutions': 'solutions',
        '#services': 'services',
        '#industries': 'industries',
        '#technologies': 'technologies',
        '#contact': 'contact'
    };

    function setActiveLink(sectionId) {
        document.querySelectorAll('.snav-link').forEach(l => l.classList.remove('snav-active-section'));

        // Find which nav link corresponds
        const desktopLinks = document.querySelectorAll('#desktop-nav .snav-link, #desktop-nav .snav-trigger, .snav-cta-btn');
        desktopLinks.forEach(link => {
            const href = link.getAttribute('href');
            const dataSec = link.getAttribute('data-section');
            const dd = link.closest('.snav-item');
            const ddKey = dd ? dd.dataset.dropdown : null;

            const targetKey = sectionMap[sectionId];

            if (href === sectionId || dataSec === targetKey || ddKey === targetKey) {
                link.classList.add('snav-active-section');
            }
        });
    }

    // Use IntersectionObserver for section detection
    const navSections = document.querySelectorAll('section[id], footer[id="contact"]');
    if (navSections.length) {
        const sectionObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveLink('#' + entry.target.id);
                }
            });
        }, { threshold: 0.25 }); // Threshold lower for very tall sections

        navSections.forEach(s => sectionObserver.observe(s));
    }

})();

// Window Resize
window.addEventListener('resize', () => {
    if (heroCanvas) {
        heroWidth = heroCanvas.width = window.innerWidth;
        heroHeight = heroCanvas.height = window.innerHeight;
    }
});





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
// [Removed old pillar-card triggers in favor of unified system]

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
            ease: "power2.out"
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
            ease: "power2.out"
        });
    });
});

// [Removed old scattered triggers in favor of unified system]

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

// --- 4. SCROLL ANIMATIONS (Unified Premium System) ---
function initScrollReveal() {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
        gsap.set("[data-reveal]", { opacity: 1, y: 0 });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Text Block Sequencing (Apple Style: Heading then Paragraph)
    // "Headings must feel solid (Mask), Paragraphs must feel subordinate (Fade)"
    gsap.utils.toArray('[data-reveal="text-block"]').forEach(block => {
        const elements = block.querySelectorAll('h1, h2, h3, h4, h5, p, .reveal-mask, .typo-body');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: block,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        elements.forEach((el, i) => {
            const isFirst = i === 0;
            const delay = isFirst ? 0 : "-=0.58";

            if (el.classList.contains('reveal-mask')) {
                const lines = el.querySelectorAll('.reveal-line');
                if (lines.length > 0) {
                    tl.fromTo(lines,
                        { y: "100%", opacity: 0 },
                        { y: "0%", opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" },
                        delay
                    );
                } else {
                    tl.from(el, { y: 40, opacity: 0, duration: 0.7, ease: "power2.out" }, delay);
                }
            } else if (el.classList.contains('reveal-horizontal')) {
                tl.from(el, {
                    x: 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: "power2.out"
                }, delay);
            } else if (el.tagName === 'P' || el.classList.contains('typo-body')) {
                tl.from(el, {
                    y: 10,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power2.out"
                }, delay);
            } else {
                tl.from(el, { y: 40, opacity: 0, duration: 0.7, ease: "power2.out" }, delay);
            }
        });
    });

    // 2. Generic Section Reveals (Fallback)
    gsap.utils.toArray('[data-reveal="section"]').forEach(section => {
        gsap.fromTo(section,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 3. Staggered Children
    gsap.utils.toArray('[data-reveal="stagger"]').forEach(container => {
        const children = container.children;
        gsap.fromTo(children,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    // 4. Industry Bento Specific (Premium Motion)
    const industryBento = document.querySelector('.industry-bento-grid');
    if (industryBento) {
        gsap.fromTo(industryBento.children,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: industryBento,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // 4. Standalone Reveal Masks (if not inside text-block)
    document.querySelectorAll('.reveal-mask').forEach((mask) => {
        if (mask.closest('[data-reveal="text-block"]')) return; // handled by timeline

        const lines = mask.querySelectorAll('.reveal-line');
        if (lines.length === 0) {
            const content = mask.innerHTML;
            mask.innerHTML = `<span class="reveal-line">${content}</span>`;
        }

        gsap.fromTo(mask.querySelectorAll('.reveal-line'),
            { y: "100%", opacity: 0 },
            {
                y: "0%",
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: mask,
                    start: "top 85%",
                }
            }
        );
    });

    ScrollTrigger.refresh();
}

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
        desc: "AI powered algorithms transforming data into decisions. Neural networks driving next gen logic.",
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
        desc: "Strategy & Branding presence. Connecting global networks with high impact digital experiences.",
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
            ease: "power2.out", // Smoother easing (less snap)
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

// --- 5. INDUSTRIES GLOWING EFFECT (React Port) ---
function initIndustriesGlow() {
    const cards = document.querySelectorAll('.industry-card');
    if (!cards.length) return;

    cards.forEach(card => {
        const glowLayer = card.querySelector('.glow-layer');
        if (!glowLayer) return;

        // Initialize variables
        card.style.setProperty('--active', '0');
        card.style.setProperty('--start', '0');

        let isHovered = false;
        let animationFrameId = null;

        const handleMove = (e) => {
            if (!isHovered) return;

            const rect = card.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // React Port Parameters
            const inactiveZone = 0.7;
            const proximity = 0;

            const centerX = rect.left + rect.width * 0.5;
            const centerY = rect.top + rect.height * 0.5;
            const distanceFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);

            // The glow is disabled if the mouse is too close to the center
            const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * inactiveZone;

            if (distanceFromCenter < inactiveRadius) {
                card.style.setProperty('--active', '0');
                return;
            }

            const isActive =
                mouseX > rect.left - proximity &&
                mouseX < rect.right + proximity &&
                mouseY > rect.top - proximity &&
                mouseY < rect.bottom + proximity;

            card.style.setProperty('--active', isActive ? '1' : '0');

            if (isActive) {
                const targetAngle = (Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI) + 90;
                const currentAngle = parseFloat(card.style.getPropertyValue('--start')) || 0;
                let angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
                const newAngle = currentAngle + angleDiff;

                gsap.to(card, {
                    '--start': newAngle,
                    duration: 0.8,
                    ease: "power2.out",
                    overwrite: 'auto'
                });
            }
        };

        card.addEventListener('mouseenter', () => {
            isHovered = true;
            card.style.setProperty('--active', '1');
        });

        card.addEventListener('mouseleave', () => {
            isHovered = false;
            card.style.setProperty('--active', '0');
        });

        document.addEventListener('mousemove', (e) => {
            if (isHovered) {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(() => handleMove(e));
            }
        });
    });
}

// Update DOMContentLoaded to include the new initiative
document.addEventListener('DOMContentLoaded', () => {
    initFocusRail();
    initIndustriesGlow();
    init3DCornerCards();
    initScrollReveal();
    initContourParallax();
    initPremiumCardCursorGlow();
});

// --- PREMIUM CARD CURSOR LIGHT REFLECTION ---
function initPremiumCardCursorGlow() {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = document.querySelectorAll('#solutions .premium-card');
    if (!cards.length || isReduced) return;

    cards.forEach(card => {
        const glow = card.querySelector('.card-cursor-glow');
        if (!glow) return;

        let rafId = null;

        card.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                glow.style.setProperty('--glow-x', `${x}%`);
                glow.style.setProperty('--glow-y', `${y}%`);
            });
        });

        card.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            // Reset to center so next entry is clean
            glow.style.setProperty('--glow-x', '50%');
            glow.style.setProperty('--glow-y', '50%');
        });
    });
}


// --- SOLUTIONS CONTOUR SCROLL PARALLAX ---
function initContourParallax() {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const primary = document.querySelector('.solutions-contour-primary');
    const red = document.querySelector('.solutions-contour-red');
    const section = document.getElementById('solutions');
    if (!primary || !red || !section) return;

    // Subtle vertical drift on scroll — GPU-only transforms
    gsap.to(primary, {
        y: 40,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to(red, {
        y: -25,
        ease: 'none',
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// --- 3D Corner Card Animations ---
function init3DCornerCards() {
    const cards = document.querySelectorAll('.premium-card');

    cards.forEach((card, index) => {
        // Entry animation
        gsap.fromTo(card,
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    once: true
                }
            }
        );

        // 3D Tilt on hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = (y / rect.height - 0.5) * -10;
            const rotateY = (x / rect.width - 0.5) * 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: "power2.out",
                transformPerspective: 800,
                transformStyle: "preserve-3d"
            });
        });

        // Reset on leave
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power3.out"
            });
        });
    });
}


