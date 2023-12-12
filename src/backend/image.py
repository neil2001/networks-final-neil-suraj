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

    # Calculate the size of the bounding box for the text
    text_bbox = draw.textbbox((0, 0), caption_text, font=font)

    # Calculate the position to center the text
    text_width, text_height = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
    text_x = (image.width - text_width) // 2
    text_y = image.height + 10

    # Add the caption text in black
    draw.text((text_x, text_y), caption_text, font=font, fill='black')

    # Save the resulting image
    background.save(output_path)