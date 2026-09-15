import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    def repl(m):
        full_tag = m.group(0)
        # Check if the tag is for an animation
        if 'anim-' in full_tag or 'gallery-' in full_tag and 'anim' in full_tag: 
            new_tag = re.sub(r"onerror=\"this\.src='(cha-\d+\.png|cat\d+\.png)'\"", "onerror=\"this.src='video_coming_soon.png'\"", full_tag)
        else:
            new_tag = re.sub(r"onerror=\"this\.src='(cha-\d+\.png|cat\d+\.png)'\"", "onerror=\"this.src='Image_coming_soon.png'\"", full_tag)
        return new_tag

    new_content = re.sub(r'<img[^>]+onerror="this\.src=\'(cha-\d+\.png|cat\d+\.png)\'"[^>]*>', repl, content)
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

