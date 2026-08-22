import os
import re

TEMPLATE_DIR = r"c:\faeda-jobs\templates\new_design"

replacements = {
    # Replace the red buttons with our standard faeda accent
    r"\bbtn-custom-red\b": "btn-faeda-accent",
    r"\bbtn-custom-blue\b": "btn-faeda-primary",
    # Specific bootstrap colors -> faeda standard where it makes sense
    r"\bbtn-primary\b": "btn-faeda-primary",
    # Addbtn-faeda-accent to any class that has background-color:#F0BF56
    r'style="background-color:#F0BF56;[^"]*"': 'class="btn btn-faeda-accent"',
    # Consolidate standard classes
}

def update_templates():
    for filename in os.listdir(TEMPLATE_DIR):
        if not filename.endswith('.html'):
            continue
            
        filepath = os.path.join(TEMPLATE_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        for old, new in replacements.items():
            content = re.sub(old, new, content)
            
        # Also let's clean up some specific inline styles on buttons if we see them
        # Like in welcomeMess.html
        content = re.sub(
            r'style="background-color:#F0BF56;\s*color:\s*black;\s*border-radius:\s*10px;\s*border:\s*2px\s*solid;"\s*type="button"\s*class="almarai-bold\s*btn\s*btn-confirm\s*m-3"',
            r'type="button" class="btn btn-faeda-accent m-3"',
            content
        )
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename}")

if __name__ == "__main__":
    update_templates()
    print("Done.")
