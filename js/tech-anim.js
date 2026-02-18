/**
 * TechAnimController
 * Handles high-end motion effects for the Technology Selection.
 * Features:
 * - Magnetic Hover Effects for Cards
 * - Dynamic Spotlight/Glow Tracking
 * - Intelligent SVG Data Flow Speed adjustments
 * - Reduced Motion Preference Handling
 */
class TechAnimController {
    constructor() {
        this.section = document.getElementById('technologies');
        this.hubContainer = document.querySelector('.hub-system-container');
        this.cards = document.querySelectorAll('.hub-card');
        this.beams = document.querySelectorAll('.connector-beam');
        this.dataPackets = document.querySelectorAll('.data-packet animateMotion');

        // Configuration
        this.config = {
            magneticStrength: 0.4, // How much cards move with mouse (0-1)
            magneticRadius: 300,   // Distance to trigger magnetic effect
            spotlightSize: 400,    // Size of the glow effect
            motionReduction: 0.5,  // Factor to reduce motion by if preference is set
            lerpFactor: 0.1       // Smoothness of mouse tracking
        };

        // State
        this.mouse = { x: 0, y: 0 };
        this.smoothMouse = { x: 0, y: 0 };
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Initialize
        if (this.section) {
            this.init();
        }
    }

    init() {
        console.log('TechAnimController: Initializing...');

        // Setup Event Listeners
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Start Animation Loop
        this.animate();

        // Setup Card Interactions
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
        });

        // Initial check for reduced motion
        this.updateMotionPreferences();
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', this.updateMotionPreferences.bind(this));
    }

    updateMotionPreferences() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.isReducedMotion) {
            console.log('TechAnimController: Reduced motion enabled.');
        }
    }

    handleMouseMove(e) {
        // Calculate relative position within the section if needed, 
        // but for global effects like spotlight, screen coords are often easier.
        // For magnetic effects, we need coordinates relative to the card centers.
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Specific logic if mouse is over the section
        const rect = this.section.getBoundingClientRect();
        if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
            this.updateSpotlight(e.clientX - rect.left, e.clientY - rect.top);
        }
    }

    handleCardHover(card, isHovering) {
        // Speed up data packets when hovering a relevant card
        // This is a "nice to have" - we can target specific paths if we map them.
        // For now, let's just add a class to the card for CSS transitions
        if (isHovering) {
            card.classList.add('is-hovering');
        } else {
            card.classList.remove('is-hovering');
        }
    }

    updateSpotlight(x, y) {
        // We will implement a custom cursor or a background radial gradient 
        // that follows the mouse within the hub container.
        if (this.hubContainer) {
            const hubRect = this.hubContainer.getBoundingClientRect();
            // Calculate position relative to the hub container
            const relativeX = this.mouse.x - hubRect.left;
            const relativeY = this.mouse.y - hubRect.top;

            gsap.to(this.hubContainer, {
                '--mouse-x': `${relativeX}px`,
                '--mouse-y': `${relativeY}px`,
                duration: 0.5,
                ease: 'power2.out'
            });
        }
    }

    animate() {
        // Smooth Mouse Lerp
        this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * this.config.lerpFactor;
        this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * this.config.lerpFactor;

        // Apply Magnetic Effect to Cards
        this.cards.forEach(card => {
            if (this.isReducedMotion) return; // Skip if restricted

            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distX = this.smoothMouse.x - centerX;
            const distY = this.smoothMouse.y - centerY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < this.config.magneticRadius) {
                // Determine attraction strength based on distance (closer = stronger)
                const force = (1 - distance / this.config.magneticRadius) * this.config.magneticStrength;

                // GSAP SET for performance (render loop)
                gsap.set(card, {
                    x: distX * force * 0.2, // Scaling down movement for subtlety
                    y: distY * force * 0.2,
                    rotationX: -distY * force * 0.05, // 3D Tilt
                    rotationY: distX * force * 0.05,
                    scale: 1.02 // Slight scale up
                });
            } else {
                // Reset if out of range
                gsap.to(card, {
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        new TechAnimController();
    } else {
        console.warn('TechAnimController: GSAP not found. Animations disabled.');
    }
});
