import os
import re

directory = r"c:\mysite\templates\new_design"

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<!DOCTYPE html>' not in content:
        return False
        
    # Extract extra_css
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    extra_css = ""
    if style_match:
        extra_css = style_match.group(1).strip()
        
    # Extract extra_js
    script_tags = re.findall(r'<script.*?</script>', content, re.DOTALL)
    extra_js_tags = []
    for tag in script_tags:
        if 'bootstrap.bundle.min.js' not in tag:
            extra_js_tags.append(tag.strip())
            
    # Extract body content (between </nav> and <footer)
    nav_end = content.find('</nav>')
    if nav_end == -1:
        # Some files might not have nav? Try to find <body>
        body_start = content.find('<body>')
        if body_start != -1:
            start_idx = body_start + 6
        else:
            start_idx = 0
    else:
        start_idx = nav_end + 6
        
    footer_start = content.find('<footer')
    if footer_start == -1:
        # find script or </body>
        script_idx = content.find('<script')
        if script_idx != -1 and script_idx > start_idx:
            footer_start = script_idx
        else:
            body_end = content.find('</body>')
            if body_end != -1:
                footer_start = body_end
            else:
                footer_start = len(content)
                
    main_content = content[start_idx:footer_start].strip()
    
    # Extract title
    title_match = re.search(r'<title>(.*?)</title>', content)
    title = title_match.group(1) if title_match else "منصة فائدة"
    
    # Reconstruct
    new_content = f"{{% extends 'new_design/base.html' %}}\n"
    new_content += f"{{% block title %}}{title}{{% endblock %}}\n\n"
    
    if extra_css:
        new_content += f"{{% block extra_css %}}\n<style>\n    {extra_css}\n</style>\n{{% endblock %}}\n\n"
        
    new_content += f"{{% block content %}}\n{main_content}\n{{% endblock %}}\n"
    
    if extra_js_tags:
        new_content += f"\n{{% block extra_js %}}\n"
        for tag in extra_js_tags:
            new_content += tag + "\n"
        new_content += f"{{% endblock %}}\n"
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    return True

processed = []
for filename in os.listdir(directory):
    if filename.endswith(".html") and filename not in ['base.html']:
        filepath = os.path.join(directory, filename)
        try:
            if refactor_file(filepath):
                processed.append(filename)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
print("Processed:", processed)
