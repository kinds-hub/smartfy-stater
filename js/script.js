// Register Plugins
gsap.registerPlugin(ScrollTrigger);

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
        this.size = Math.random() * 2 + 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.color = '#0B1B3D';
    }
    draw() {
        heroCtx.fillStyle = this.color;
        heroCtx.beginPath();
        heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        heroCtx.fill();
    }
    update() {
        // Slight float movement
        // this.x += (Math.random() - 0.5) * 0.2;
        // this.y += (Math.random() - 0.5) * 0.2;
    }
}

for (let i = 0; i < 80; i++) {
    nodes.push(new Node());
}

function animateHero() {
    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    // Draw Red Cursor Dot
    if (mouse.x && window.innerWidth > 760) {
        heroCtx.fillStyle = '#E11D2E';
        heroCtx.beginPath();
        heroCtx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
        heroCtx.fill();

        // Glow effect
        heroCtx.shadowBlur = 20;
        heroCtx.shadowColor = '#E11D2E';
    } else {
        heroCtx.shadowBlur = 0;
    }

    // Connect Cursor to nearest Nodes WITH RED LINES
    nodes.forEach(node => {
        node.draw();

        if (mouse.x && window.innerWidth > 760) {
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 250) { // Increased distance slightly
                heroCtx.beginPath();
                // RED LINE style matching branding
                heroCtx.strokeStyle = `rgba(225, 29, 46, ${1 - distance / 250})`;
                heroCtx.lineWidth = 1.5;
                heroCtx.moveTo(mouse.x, mouse.y);
                heroCtx.lineTo(node.x, node.y);
                heroCtx.stroke();

                // Pull node slightly towards mouse
                const force = (200 - distance) / 200;
                // node.x += dx * force * 0.05;
                // node.y += dy * force * 0.05;
            }
        }
    });

    heroCtx.shadowBlur = 0; // Reset shadow for other elements
    requestAnimationFrame(animateHero);
}
animateHero();


// --- 3. NAVIGATION & MOBILE MENU ---
const mobileBtn = document.getElementById('mobile-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-btn');

mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Smooth Scroll to ID for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            lenis.scrollTo(target);
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

// Liquid Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector('.progress-bar').style.width = scrollPercent + '%';
});

// Magnetic Hub (Social Icons)
const magnets = document.querySelectorAll('.magnetic-icon');

magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(magnet, {
            x: x * 0.5,
            y: y * 0.5,
            rotate: 15 * (x / rect.width),
            duration: 0.3,
            ease: "power2.out"
        });
    });

    magnet.addEventListener('mouseleave', () => {
        gsap.to(magnet, {
            x: 0,
            y: 0,
            rotate: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });
    });

    // 360 Rotation on Hover
    magnet.addEventListener('mouseenter', () => {
        gsap.to(magnet.querySelector('i'), {
            rotation: 360,
            duration: 0.6,
            ease: "back.out(1.7)"
        });
    });

    // Reset rotation check
    magnet.addEventListener('mouseleave', () => {
        gsap.set(magnet.querySelector('i'), { rotation: 0 });
    });
});

// 3D Tilt for Cards
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.3,
            ease: "power1.out"
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// Footer Reveal Effect (Parallax)
gsap.from(".signature-footer", {
    yPercent: -20,
    opacity: 0,
    scrollTrigger: {
        trigger: ".signature-footer",
        start: "top bottom",
        end: "bottom bottom",
        scrub: true
    }
});
