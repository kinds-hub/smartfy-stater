with open('/Users/mac/smartify/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Isolate Blocks
solutions_start = html.find('        <!-- PREMIUM SOLUTIONS SECTION -->')
solutions_end = html.find('    </main> <!-- Close Main Parallax Wrapper -->')
services_start = html.find('        <!-- OUR SERVICES (New Clean Section) -->')

# Extract focus rail
focus_start = html.find('        <!-- FOCUS RAIL SYSTEM (React Port) -->')
focus_end = html.find('        <!-- INDUSTRIES WE SERVE (Enterprise Bento) -->')
if focus_start == -1 or focus_end == -1:
    print("Could not find Focus Rail")
    exit(1)

focus_block = html[focus_start:focus_end]

# Remove Focus Rail from old position
html_no_focus = html[:focus_start] + html[focus_end:]

# 2. Find Services and Replace
services_start = html_no_focus.find('        <!-- OUR SERVICES (New Clean Section) -->')
services_end = html_no_focus.find('        <!-- INDUSTRIES WE SERVE (Enterprise Bento) -->') 

if services_start != -1 and services_end != -1:
    new_html = html_no_focus[:services_start] + focus_block + html_no_focus[services_end:]
else:
    # If no services block exists, insert focus right after solutions end
    sol_end = html_no_focus.find('    </main> <!-- Close Main Parallax Wrapper -->')
    new_html = html_no_focus[:sol_end] + focus_block + html_no_focus[sol_end:]

# 3. Update Nav Links
new_html = new_html.replace('href="#services-consulting"', 'href="#focus-rail-section"')
new_html = new_html.replace('href="#services-development"', 'href="#focus-rail-section"')
new_html = new_html.replace('href="#services-design"', 'href="#focus-rail-section"')

with open('/Users/mac/smartify/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Exact rewrite success.")
