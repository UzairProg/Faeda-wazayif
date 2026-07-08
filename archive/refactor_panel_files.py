import os
import glob
import re

def refactor_panel_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If already refactored, skip
    if "{% extends 'new_design/panel_base.html' %}" in content:
        return False

    # Find the content wrapper
    start_idx = content.find('class="container-xxl flex-grow-1 container-p-y"')
    if start_idx == -1:
        start_idx = content.find('class="container-xxl')
        
    if start_idx != -1:
        div_start = content.rfind('<div', 0, start_idx)
    else:
        # Fallback
        div_start = content.find('<body>') + 6
        if div_start == 5:
            div_start = 0

    # Find the footer to mark the end of content
    end_idx = content.find('<!-- Footer -->', div_start)
    if end_idx == -1:
        end_idx = content.find('<!-- / Content -->', div_start)
    if end_idx == -1:
        end_idx = content.find('<footer', div_start)
    if end_idx == -1:
        end_idx = content.find('<!-- Core JS -->', div_start)
    if end_idx == -1:
        end_idx = content.rfind('</body>')
    if end_idx == -1:
        end_idx = len(content)

    # Extract the main content
    main_content = content[div_start:end_idx].strip()
    
    # Fix white text colors
    main_content = re.sub(r'(color:\s*)(?:#fff|#ffffff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))', r'\1var(--primary-dark)', main_content, flags=re.IGNORECASE)
    main_content = re.sub(r'\btext-white\b', 'text-dark', main_content)

    # Grab the title if exists
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1).strip() if title_match else "لوحة التحكم"

    # Construct the new content
    new_content = f"{{% extends 'new_design/panel_base.html' %}}\n"
    new_content += f"{{% block title %}}{title}{{% endblock %}}\n"
    new_content += f"{{% block page_title %}}{title}{{% endblock %}}\n\n"
    new_content += "{% block content %}\n"
    new_content += "<div class=\"card p-4 shadow-sm\" style=\"border-radius: 15px; border: none;\">\n"
    new_content += f"    {main_content}\n"
    new_content += "</div>\n"
    new_content += "{% endblock %}\n"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

files = glob.glob('templates/panel/**/*.html', recursive=True)
processed = []
for f in files:
    try:
        if refactor_panel_file(f):
            processed.append(f)
    except Exception as e:
        print(f"Error on {f}: {e}")

print(f"Processed {len(processed)} remaining files.")
