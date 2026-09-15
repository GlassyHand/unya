import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # First, let's split the content into animations and the rest to handle animations separately if possible.
    # Or, we can use regex to find anim-*.png or inside char-animations-grid
    
    def replacer(match):
        img_tag = match.group(0)
        src = match.group(1)
        fallback = match.group(2)
        
        # If it's an animation placeholder (anim-*.png or inside animation card), 
        # it usually has src starting with anim- or it's in the animation section
        if 'anim-' in src:
            return img_tag.replace(fallback, "video_coming_soon.png")
        else:
            return img_tag.replace(fallback, "Image_coming_soon.png")
            
    # Find img tags with onerror="this.src='cat*.png'"
    # Pattern: <img ... src="([^"]+)" ... onerror="this.src='(cat\d+\.png)'"
    # Actually, the onerror might be single quotes or double quotes.
    
    # Let's replace all onerror="this.src='cat\d+\.png'" 
    
    def repl(m):
        full_tag = m.group(0)
        # Check if the tag is for an animation
        if 'anim-' in full_tag or 'gallery-' in full_tag and 'anim' in full_tag: # Wait, just anim- is in char*.html
            new_tag = re.sub(r"onerror=\"this\.src='cat\d+\.png'\"", "onerror=\"this.src='video_coming_soon.png'\"", full_tag)
        else:
            new_tag = re.sub(r"onerror=\"this\.src='cat\d+\.png'\"", "onerror=\"this.src='Image_coming_soon.png'\"", full_tag)
        return new_tag

    new_content = re.sub(r'<img[^>]+onerror="this\.src=\'cat\d+\.png\'"[^>]*>', repl, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

