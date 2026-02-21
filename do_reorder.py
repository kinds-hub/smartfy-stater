import re

def reorder_smartify():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    # We will split the HTML into blocks by standard comments.
    
    # Hero is everything before Technologies
    tech_start = html.find('        <!-- TECHNOLOGIES SHOWCASE -->')
    focus_start = html.find('        <!-- Bento Grid with Tilt Cards -->')
    if focus_start == -1: 
        focus_start = html.find('        <!-- FOCUS RAIL SYSTEM (React Port) -->')
    
    ind_start = html.find('        <!-- INDUSTRIES WE SERVE')
    sol_start = html.find('        <!-- OUR SOLUTIONS -->')
    if sol_start == -1:
         sol_start = html.find('        <!-- PREMIUM SOLUTIONS SECTION -->')
         
    main_end = html.find('    </main> <!-- Close Main Parallax Wrapper -->')
    
    # 1. Hero block (from start up to Tech)
    hero_plus_nav = html[:tech_start]
    
    # 2. Tech block
    tech_block = html[tech_start:focus_start]
    
    # 3. Focus rail (Services) block
    focus_block = html[focus_start:ind_start]
    # Rename ID so JS and Nav work cleanly
    focus_block = focus_block.replace('id="focus-rail-section"', 'id="services"')
    focus_block = focus_block.replace('href="#focus-rail-section"', 'href="#services"')
    
    # 4. Industries block
    ind_block = html[ind_start:sol_start]
    
    # 5. Solutions block
    sol_block = html[sol_start:main_end]
    
    # 6. Company block (We will generate this and slip it before main_end)
    company_block = """
        <!-- COMPANY SECTION (Extracted from Mega Nav) -->
        <section id="company" class="py-32 relative bg-[#020617] overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <!-- Left: Story -->
                    <div data-reveal="text-block">
                        <span class="text-smartfy-red font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Story</span>
                        <h2 class="font-display font-bold text-4xl md:text-5xl text-white mb-6 tracking-tight leading-tight">
                            We Are Smartify.<br>And We Built This for Africa.
                        </h2>
                        <div class="space-y-6 text-slate-400 text-lg font-light leading-relaxed">
                            <p>
                                Smartify Technology was founded on a simple belief: that the most powerful
                                technologies in the world should be accessible to African businesses,
                                institutions, and communities — not just global corporations with unlimited
                                budgets.
                            </p>
                            <p>
                                We are a multi-division technology group. When you work with us, you're gaining
                                a technology partner that handles hardware, software, energy systems, team
                                training, and market positioning — all from one team, with one unified vision.
                            </p>
                        </div>
                    </div>
                    <!-- Right: Purpose/Mission/Vision -->
                    <div class="space-y-8">
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                            <span class="text-smartfy-red font-mono text-xs font-bold tracking-[0.1em] uppercase mb-2 block">Purpose</span>
                            <p class="text-white text-lg font-medium">To transform technology into meaningful, real-world impact for businesses, institutions, and future generations.</p>
                        </div>
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                            <span class="text-smartfy-red font-mono text-xs font-bold tracking-[0.1em] uppercase mb-2 block">Mission</span>
                            <p class="text-white text-lg font-medium">To simplify complex problems and create smarter systems that improve productivity, sustainability, and growth across industries.</p>
                        </div>
                        <div class="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                            <span class="text-smartfy-red font-mono text-xs font-bold tracking-[0.1em] uppercase mb-2 block">Vision</span>
                            <p class="text-white text-lg font-medium">To become a leading African smart-technology group powering digital transformation, clean energy adoption, and future-ready innovation across the continent and beyond.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
"""
    
    # Now reorder them to match: Hero -> Solutions -> Focus(Services) -> Industries -> Tech -> Company -> End
    new_html = (
        hero_plus_nav
        + sol_block
        + focus_block
        + ind_block
        + tech_block
        + company_block
        + html[main_end:]
    )
    
    # Also update any lingering href="#focus-rail-section" in the rest of the HTML
    new_html = new_html.replace('href="#focus-rail-section"', 'href="#services"')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
        
    print("Reordered correctly!")

if __name__ == "__main__":
    reorder_smartify()
