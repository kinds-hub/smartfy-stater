with open('/Users/mac/smartify/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Make sure Services dropdown trigger has data-dropdown="services"
html = html.replace(
    '<div class="snav-item snav-has-dropdown">',
    '<div class="snav-item snav-has-dropdown" data-dropdown="services">',
    1 # First instance is Services
)

# Second instance of snav-has-dropdown without data-dropdown would be nothing since Industries has it:
# <div class="snav-item snav-has-dropdown" data-dropdown="industries">
# <div class="snav-item snav-has-dropdown snav-has-mega" data-dropdown="company"

# Make sure Technologies link has data-section="technologies"
# <a href="#technologies" class="snav-link snav-plain" data-section="technologies">Technologies</a> -> this is already set from our previous task!

# Mobile Accordion Triggers mapping:
html = html.replace('data-mobile-acc="m-services"', 'data-mobile-acc="m-services" data-accordion="services"')
html = html.replace('data-mobile-acc="m-industries"', 'data-mobile-acc="m-industries" data-accordion="industries"')
html = html.replace('data-mobile-acc="m-solutions"', 'data-mobile-acc="m-solutions" data-accordion="solutions"')
html = html.replace('data-mobile-acc="m-company"', 'data-mobile-acc="m-company" data-accordion="company"')

if 'data-section="technologies"' not in html.split('<!-- Mobile: Technologies -->')[1][:100]:
   parts = html.split('<!-- Mobile: Technologies -->')
   parts[1] = parts[1].replace('class="sheet-link"', 'class="sheet-link" data-section="technologies"', 1)
   html = '<!-- Mobile: Technologies -->'.join(parts)


with open('/Users/mac/smartify/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Attributes added successfully for ScrollSpy.")
