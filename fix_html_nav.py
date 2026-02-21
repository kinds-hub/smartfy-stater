with open('/Users/mac/smartify/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure all anchor links to services point to focus rail
html = html.replace('href="#services-consulting"', 'href="#focus-rail-section"')
html = html.replace('href="#services-development"', 'href="#focus-rail-section"')
html = html.replace('href="#services-design"', 'href="#focus-rail-section"')

# Now process script.js
js_path = '/Users/mac/smartify/js/script.js'
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

# Only add interceptor if not exists
if '==== GLOBAL SMOOTH SCROLL INTERCEPTOR ====' not in js:
    scroll_interceptor = """
    // ==== GLOBAL SMOOTH SCROLL INTERCEPTOR ====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (typeof closeMenu === 'function') closeMenu();
                
                if (typeof lenis !== 'undefined') {
                    lenis.scrollTo(targetElement, { offset: -80, duration: 1.2 });
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ==== SCROLLSPY (Active Red Line) ====
    const sections = ['#hero', '#solutions', '#focus-rail-section', '#industries', '#technologies', '#contact'];
    const sectionNavMapping = {
        'hero': null,
        'solutions': 'solutions',
        'focus-rail-section': 'services', // Maps to the Services trigger
        'industries': 'industries',
        'technologies': 'technologies',
        'contact': 'company'
    };

    const spyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', 
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const navKey = sectionNavMapping['#' + entry.target.id];
                
                // Clear active states
                document.querySelectorAll('.snav-link, .snav-trigger').forEach(el => {
                    el.classList.remove('snav-active-section');
                });

                if (navKey) {
                    const trigger = document.querySelector(`[data-dropdown="${navKey}"] > .snav-trigger`) || 
                                    document.querySelector(`[data-section="${navKey}"]`);
                    if (trigger) trigger.classList.add('snav-active-section');
                }
            }
        });
    }, spyOptions);

    sections.forEach(id => {
        const el = document.querySelector(id);
        if (el) spyObserver.observe(el);
    });
"""

    insert_marker = "    // Backdrop click for company mega"
    if insert_marker in js:
        js = js.replace(insert_marker, scroll_interceptor + "\n\n" + insert_marker)
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js)
        print("JS successfully updated with Smooth Scroll & Scrollspy.")
    else:
        print("Marker not found in JS.")

with open('/Users/mac/smartify/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML successfully updated.")
