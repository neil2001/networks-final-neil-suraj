from PIL import Image, ImageDraw, ImageFont

def add_caption(image_path, caption_text, output_path):
    # Open the image
    image = Image.open(image_path)

    # Create a blank white image with the same size as the original image
    width, height = image.size
    background = Image.new('RGB', (width, height + 50), 'white')

    # Paste the original image onto the white background
    background.paste(image, (0, 0))

    # Initialize the drawing context
    draw = ImageDraw.Draw(background)

    # Choose a font and size for the caption
    font = ImageFont.load_default()

    # Calculate the position to center the text
    text_width, text_height = draw.textsize(caption_text, font)
    text_x = (width - text_width) // 2
    text_y = height + 10  # Adjust as needed

    # Add the caption text in black
    draw.text((text_x, text_y), caption_text, font=font, fill='black')

    # Save the resulting image
    background.save(output_path)