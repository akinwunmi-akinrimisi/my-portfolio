import os
from PIL import Image, ImageDraw, ImageFont

SRC = os.environ.get('SRC', '../akin.png')
PUB = os.environ.get('PUB', '../public')

im = Image.open(SRC).convert('RGB')

# Responsive portrait variants for the hero.
for w in (640, 960, 1280):
    h = round(im.height * w / im.width)
    r = im.resize((w, h), Image.LANCZOS)
    r.save(f'{PUB}/akin-{w}.webp', 'WEBP', quality=82, method=6)
    if w == 960:
        r.save(f'{PUB}/akin-960.jpg', 'JPEG', quality=84, optimize=True, progressive=True)

# --- Open Graph card: 1200x630, portrait on the right, text on the left. ---
OG_W, OG_H = 1200, 630
INK = (10, 8, 6)
og = Image.new('RGB', (OG_W, OG_H), INK)

# Cover-crop the portrait into the right-hand panel.
panel_w = 470
scale = max(panel_w / im.width, OG_H / im.height)
pw, ph = round(im.width * scale), round(im.height * scale)
photo = im.resize((pw, ph), Image.LANCZOS)
# Bias the crop upward so the face is not cut off.
top = max(0, round((ph - OG_H) * 0.18))
photo = photo.crop((round((pw - panel_w) / 2), top, round((pw - panel_w) / 2) + panel_w, top + OG_H))
og.paste(photo, (OG_W - panel_w, 0))

# Feather the photo's left edge into the navy so the join is not a hard seam.
grad = Image.new('L', (200, OG_H), 0)
gd = ImageDraw.Draw(grad)
for x in range(200):
    gd.line([(x, 0), (x, OG_H)], fill=int(255 * (1 - x / 200)))
og.paste(Image.new('RGB', (200, OG_H), INK), (OG_W - panel_w, 0), grad)

d = ImageDraw.Draw(og)


def font(size, bold=True):
    for path in (
        r'C:\Windows\Fonts\segoeuib.ttf' if bold else r'C:\Windows\Fonts\segoeui.ttf',
        r'C:\Windows\Fonts\arialbd.ttf' if bold else r'C:\Windows\Fonts\arial.ttf',
    ):
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


# Accent rule, echoing the site's amber->gold gradient.
for x in range(180):
    t = x / 180
    c = (round(245 + (255 - 245) * t), round(165 + (209 - 165) * t), round(36 + (102 - 36) * t))
    d.rectangle([70 + x, 94, 70 + x, 98], fill=c)

d.text((70, 130), 'Akinwunmi Akinrimisi', font=font(52), fill=(240, 235, 227))
d.text((70, 202), 'Cloud DevOps Engineer', font=font(34), fill=(245, 165, 36))
d.text((70, 246), 'AI Automation Architect', font=font(34), fill=(255, 209, 102))

body = [
    'I build systems that run the',
    'business while you sleep.',
]
y = 330
for line in body:
    d.text((70, y), line, font=font(30, bold=False), fill=(169, 159, 144))
    y += 42

d.text((70, 470), 'AWS  ·  Terraform  ·  n8n  ·  Kubernetes  ·  Supabase',
       font=font(21, bold=False), fill=(124, 114, 100))
d.text((70, 512), 'akinwunmi-akinrimisi.netlify.app', font=font(21), fill=(245, 165, 36))

og.save(f'{PUB}/og-image.jpg', 'JPEG', quality=88, optimize=True, progressive=True)

for f in sorted(os.listdir(PUB)):
    p = f'{PUB}/{f}'
    print(f'{f:24s} {os.path.getsize(p)/1024:8.1f} KB')
