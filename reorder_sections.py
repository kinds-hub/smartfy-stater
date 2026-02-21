with open('/Users/mac/smartify/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

tech_start_marker = "        <!-- TECHNOLOGIES SHOWCASE -->"
ind_start_marker = "        <!-- INDUSTRIES WE SERVE (Enterprise Bento) -->"
sol_start_marker = "        <!-- OUR SOLUTIONS -->"
main_end_marker = "    </main> <!-- Close Main Parallax Wrapper -->"

tech_idx = html.find(tech_start_marker)
ind_idx = html.find(ind_start_marker)
sol_idx = html.find(sol_start_marker)
main_end_idx = html.find(main_end_marker)

print(f"Indices -> tech: {tech_idx}, ind: {ind_idx}, sol: {sol_idx}, end: {main_end_idx}")

if -1 in (tech_idx, ind_idx, sol_idx, main_end_idx):
    print("Could not find one of the markers. Exiting.")
    exit(1)

tech_block = html[tech_idx:ind_idx]
ind_block = html[ind_idx:sol_idx]
sol_block = html[sol_idx:main_end_idx]

services_block = """
        <!-- OUR SERVICES (New Clean Section) -->
        <section id="services" class="py-32 relative bg-[#0A1128] overflow-hidden">
            <!-- Subtle Radial Glow Background -->
            <div class="absolute inset-0 pointer-events-none" style="background: radial-gradient(circle at 50% -20%, rgba(225,29,46,0.05) 0%, rgba(10,17,40,0) 70%);"></div>

            <div class="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div class="mb-20 text-center max-w-3xl mx-auto" data-reveal="text-block">
                    <h5 class="text-smartfy-red font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 fade-up">Our Capabilities</h5>
                    <h2 class="font-display font-bold text-5xl md:text-6xl text-white mb-6 tracking-tight">Services that Scale.</h2>
                    <p class="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        We deliver end-to-end expertise across consulting, engineering, and design to help you move faster.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Consulting -->
                    <div class="p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group">
                        <div class="w-14 h-14 rounded-full bg-smartfy-red/10 flex items-center justify-center mb-8 border border-smartfy-red/20 group-hover:bg-smartfy-red/20 transition-colors">
                            <i class="bi bi-person-lines-fill text-smartfy-red text-2xl"></i>
                        </div>
                        <h3 class="text-white font-display text-2xl mb-4 font-bold">Consulting</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-8">
                            Expert advice & digital strategy to align technology with your business objectives. We map your operations and design a roadmap.
                        </p>
                        <a href="#contact" class="text-white text-sm font-bold group-hover:text-smartfy-red transition-colors inline-flex items-center gap-2">Learn More <i class="bi bi-arrow-right"></i></a>
                    </div>
                    <!-- Development -->
                    <div class="p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group">
                        <div class="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 transition-colors">
                            <i class="bi bi-code-square text-white text-2xl"></i>
                        </div>
                        <h3 class="text-white font-display text-2xl mb-4 font-bold">Development</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-8">
                            Custom software & web engineering built for scale, performance, and reliability. Every line of code serves your growth.
                        </p>
                        <a href="#contact" class="text-white text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity inline-flex items-center gap-2">Learn More <i class="bi bi-arrow-right"></i></a>
                    </div>
                    <!-- Design -->
                    <div class="p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group">
                        <div class="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center mb-8 border border-slate-700 group-hover:bg-slate-700 transition-colors">
                            <i class="bi bi-palette text-slate-300 text-2xl"></i>
                        </div>
                        <h3 class="text-white font-display text-2xl mb-4 font-bold">Design</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-8">
                            UX/UI, branding, and interfaces that elevate the user experience. Your brand is your first impression — we make it count.
                        </p>
                        <a href="#contact" class="text-white text-sm font-bold text-slate-300 group-hover:text-white transition-colors inline-flex items-center gap-2">Learn More <i class="bi bi-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </section>
"""

new_main_body = sol_block + services_block + ind_block + tech_block

new_html = html[:tech_idx] + new_main_body + html[main_end_idx:]

with open('/Users/mac/smartify/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("success")
