with open('/Users/mac/smartify/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

services_start = html.find('        <!-- OUR SERVICES')
ind_start = html.find('        <!-- INDUSTRIES WE SERVE')
focus_start = html.find('        <!-- FOCUS RAIL SYSTEM')
footer_start = html.find('    <!-- ENTERPRISE FOOTER')

if -1 in (services_start, ind_start, focus_start, footer_start):
    print("Failed to find boundaries")
    exit(1)

# Extract Focus Rail
focus_rail_block = html[focus_start:footer_start]

# Strip Focus Rail from original spot
html_without_focus = html[:focus_start] + html[footer_start:]

# Recalculate markers
services_start_new = html_without_focus.find('        <!-- OUR SERVICES')
ind_start_new = html_without_focus.find('        <!-- INDUSTRIES WE SERVE')

# Replace Services block with Focus Rail block
new_html = html_without_focus[:services_start_new] + focus_rail_block + html_without_focus[ind_start_new:]

# Fix anchor references in nav
new_html = new_html.replace('href="#services-consulting"', 'href="#focus-rail-section"')
new_html = new_html.replace('href="#services-development"', 'href="#focus-rail-section"')
new_html = new_html.replace('href="#services-design"', 'href="#focus-rail-section"')

with open('/Users/mac/smartify/index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("HTML reordering complete.")
