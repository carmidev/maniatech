from PIL import Image, ImageDraw

def create_square_favicon():
    path = 'C:/Users/Personal/Documents/CarMiDev/DolceCandy/public/images/Favicondolce.png'
    output_path = 'C:/Users/Personal/Documents/CarMiDev/DolceCandy/public/images/Favicondolce_v2.png'
    
    # Load original
    logo = Image.open(path).convert("RGBA")
    
    # Create background (Brand Red: #bd2926)
    # Using #bd2926 which is 'brand.red' in config
    bg_color = (189, 41, 38, 255) # #bd2926
    
    new_img = Image.new("RGBA", logo.size, bg_color)
    
    # Paste logo on top
    new_img.paste(logo, (0, 0), logo)
    
    # Save
    new_img.save(output_path)
    print(f"New favicon saved to {output_path}")

if __name__ == "__main__":
    create_square_favicon()
