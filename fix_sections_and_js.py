import re

html_path = '/Users/mac/smartify/index.html'
js_path = '/Users/mac/smartify/js/script.js'

# --- 1. Fix HTML (Remove Services, Move Focus Rail) ---
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Define boundaries
sol_end_marker = "        </section>\n\n        <!-- OUR SERVICES"
services_start_marker = "        <!-- OUR SERVICES"
ind_start_marker = "        <!-- INDUSTRIES WE SERVE"
tech_start_marker = "        <!-- TECHNOLOGIES SHOWCASE -->"
focus_rail_start_marker = "        <!-- FOCUS RAIL SYSTEM (React Port) -->"
focus_rail_end_marker = "        <!-- INDUSTRIES WE SERVE" # It was moved recently, so it might be here. Let's find it more robustly.

# Actually, the quickest way is to just find the blocks using regex
services_pattern = re.compile(r'(\s*<!-- OUR SERVICES.*?)(?=\s*<!-- INDUSTRIES WE SERVE)', re.DOTALL)
focus_rail_pattern = re.compile(r'(\s*<!-- FOCUS RAIL SYSTEM.*?)(?=\s*<!-- ENTERPRISE FOOTER)', re.DOTALL) # In current DOM, focus rail is after technologies, before footer
if not focus_rail_pattern.search(html):
    # Try finding it before technologies instead in case it was left there
    focus_rail_pattern = re.compile(r'(\s*<!-- FOCUS RAIL SYSTEM.*?)(?=\s*<!-- TECHNOLOGIES SHOWCASE|\s*<!-- ENTERPRISE FOOTER)', re.DOTALL)

services_match = services_pattern.search(html)
focus_rail_match = focus_rail_pattern.search(html)

if services_match and focus_rail_match:
    focus_rail_html = focus_rail_match.group(1)
    
    # 1. Remove focus rail from its current position
    html = html[:focus_rail_match.start(1)] + html[focus_rail_match.end(1):]
    
    # 2. Replace Services with Focus rail
    # Need to recalculate match because string length changed
    services_match = services_pattern.search(html)
    if services_match:
         # Make sure to update the focus rail ID to "services" so links work, or keep IDs and update links
         modified_focus_rail = focus_rail_html
         
         html = html[:services_match.start(1)] + modified_focus_rail + html[services_match.end(1):]

    # Quick link target fix in nav
    html = html.replace('href="#services-consulting"', 'href="#focus-rail-section"')
    html = html.replace('href="#services-development"', 'href="#focus-rail-section"')
    html = html.replace('href="#services-design"', 'href="#focus-rail-section"')
    
    # Ensure IDs match dropdowns for Scrollspy later
    # The sections we care about: #hero, #solutions, #focus-rail-section, #industries, #technologies, #contact

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print("HTML updated successfully.")
else:
    print(f"Error finding blocks. Services: {bool(services_match)}, Focus Rail: {bool(focus_rail_match)}")


# --- 2. Fix JS (Smooth Scroll Interceptor & ScrollSpy) ---
with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

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
    // Map section IDs to their corresponding data-dropdown or data-section values in the nav
    const sectionNavMapping = {
        'hero': null,
        'solutions': 'solutions',
        'focus-rail-section': 'services', // Maps to the new Services trigger
        'industries': 'industries',
        'technologies': 'technologies',
        'contact': 'company'
    };

    const spyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section crosses the middle of the screen
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const navKey = sectionNavMapping[sectionId];
                
                // Remove active class from all links and triggers
                document.querySelectorAll('.snav-link, .snav-trigger').forEach(el => {
                    el.classList.remove('snav-active-section');
                });

                if (navKey) {
                    // Find matching desktop nav element
                    const trigger = document.querySelector(`[data-dropdown="${navKey}"] > .snav-trigger`) || 
                                    document.querySelector(`[data-section="${navKey}"]`);
                    
                    if (trigger) {
                        trigger.classList.add('snav-active-section');
                    }
                }
            }
        });
    }, spyOptions);

    sections.forEach(id => {
        const el = document.querySelector(id);
        if (el) spyObserver.observe(el);
    });
"""

# Insert near the end of initEnterpriseNav
insert_marker = "    // Backdrop click for company mega"
if insert_marker in js:
    js = js.replace(insert_marker, scroll_interceptor + "\n\n" + insert_marker)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("JS updated successfully.")
else:
    print("Could not find JS insertion marker.")

