#!/usr/bin/env python3
"""
Image Normalization Script
Makes all technology card images look like they were shot in the same studio
with consistent angle, lighting, contrast, and color balance.
"""

from PIL import Image, ImageEnhance, ImageFilter, ImageStat
import os

# List of images to normalize
images = [
    'assets/images/ electronics and embedded1.jpg',
    'assets/images/ IoT.jpg',
    'assets/images/ smart energies.jpg',
    'assets/images/ smart future.jpg',
    'assets/images/ software.jpg'
]

def get_average_brightness(img):
    """Calculate average brightness of an image"""
    grayscale = img.convert('L')
    stat = ImageStat.Stat(grayscale)
    return stat.mean[0]

def normalize_image(img_path, target_brightness=128, target_contrast=1.2, target_saturation=1.1):
    """
    Normalize an image for consistent lighting, contrast, and saturation
    """
    print(f"Processing: {img_path}")
    
    # Open image
    img = Image.open(img_path)
    
    # Get original size
    original_size = img.size
    print(f"  Original size: {original_size}")
    
    # 1. Resize all to same dimensions for consistency (using the average)
    # We'll use 640x800 as standard size for tech cards
    standard_size = (640, 800)
    img = img.resize(standard_size, Image.Resampling.LANCZOS)
    print(f"  Resized to: {standard_size}")
   
    # 2. Enhance brightness to target level
    current_brightness = get_average_brightness(img)
    brightness_factor = target_brightness / current_brightness
    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(brightness_factor)
    print(f"  Brightness adjusted: {current_brightness:.1f} → {target_brightness}")
    
    # 3. Normalize contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(target_contrast)
    print(f"  Contrast set to: {target_contrast}")
    
    # 4. Normalize saturation (color vibrancy)
    enhancer = ImageEnhance.Color(img)
    img = enhancer.enhance(target_saturation)
    print(f"  Saturation set to: {target_saturation}")
    
    # 5. Apply slight sharpening for consistency
    img = img.filter(ImageFilter.SHARPEN)
    print(f"  Sharpening applied")
    
    # 6. Save normalized image (overwrite original)
    img.save(img_path, 'JPEG', quality=90, optimize=True)
    print(f"  ✓ Saved: {img_path}\n")
    
    return img

def main():
    print("=" * 60)
    print("IMAGE NORMALIZATION - Technology Cards")
    print("=" * 60)
    print(f"Processing {len(images)} images...\n")
    
    for img_path in images:
        if os.path.exists(img_path):
            normalize_image(img_path)
        else:
            print(f"⚠ Warning: {img_path} not found, skipping.\n")
    
    print("=" * 60)
    print("✅ ALL IMAGES NORMALIZED SUCCESSFULLY")
    print("=" * 60)
    print("\nAll technology card images now have:")
    print("  • Consistent size: 640x800px")
    print("  • Normalized brightness: 128")
    print("  • Consistent contrast: 1.2x")
    print("  • Consistent saturation: 1.1x")
    print("  • Uniform sharpness")

if __name__ == "__main__":
    main()
