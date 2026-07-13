from pathlib import Path
from PIL import Image, ImageDraw

root = Path('src/assets/Products')
root.mkdir(parents=True, exist_ok=True)


def create_image(path):
    img = Image.new('RGB', (400, 400), (245, 214, 180))
    draw = ImageDraw.Draw(img)

    if path.name.startswith('tomato'):
        draw.ellipse((70, 70, 330, 330), fill=(220, 40, 40))
        draw.rectangle((155, 145, 245, 330), fill=(70, 140, 30))
    elif path.name.startswith('chilli'):
        draw.rectangle((40, 110, 140, 290), fill=(35, 90, 20))
        draw.ellipse((145, 95, 310, 265), fill=(220, 40, 40))
    elif path.name.startswith('groundnut'):
        draw.ellipse((80, 80, 320, 320), fill=(175, 130, 80))
        draw.ellipse((120, 120, 180, 180), fill=(110, 80, 45))
        draw.ellipse((220, 220, 280, 280), fill=(110, 80, 45))

    img.save(path)

create_image(root / 'tomato.jpg')
create_image(root / 'chilli.jpg')
create_image(root / 'groundnut.jpg')
print('created jpg files')
