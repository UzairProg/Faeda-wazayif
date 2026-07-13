import re
import os

files_to_process = {
    r"templates\panel\customer_jobs.html": {"title": "وظائفي", "nav": "nav_my_jobs"},
    r"templates\panel\create_team.html": {"title": "انشاء مجموعة", "nav": "nav_create_team"},
    r"templates\panel\profile_team.html": {"title": "ملف المجموعة", "nav": "nav_my_teams"},
    r"templates\panel\add_members_to_team.html": {"title": "إضافة أعضاء", "nav": "nav_my_teams"},
}

for filepath, meta in files_to_process.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find start of core content
    start_idx = content.find('class="container-xxl flex-grow-1 container-p-y"')
    if start_idx == -1:
        start_idx = content.find('class="container-xxl')
        
    # The actual div starts a bit earlier
    div_start = content.rfind('<div', 0, start_idx)
    
    # Find end of core content
    end_idx = content.find('<!-- Footer -->', div_start)
    if end_idx == -1:
        end_idx = content.find('<!-- / Content -->', div_start)
    if end_idx == -1:
        end_idx = content.find('<footer', div_start)
        
    if div_start != -1 and end_idx != -1:
        core_content = content[div_start:end_idx].strip()
        
        # Strip out any remaining Sneat row/col wrappers if we just want to wrap the inner tables/forms in a clean card
        # Or we can just wrap the extracted content in our new card wrapper as requested
        
        new_html = f"{{% extends 'new_design/panel_base.html' %}}\n"
        new_html += f"{{% block page_title %}}{meta['title']}{{% endblock %}}\n"
        new_html += f"{{% block {meta['nav']} %}}active{{% endblock %}}\n\n"
        new_html += "{% block content %}\n"
        new_html += "<div class=\"card p-4 shadow-sm\" style=\"border-radius: 15px; border: none;\">\n"
        new_html += f"    {core_content}\n"
        new_html += "</div>\n"
        new_html += "{% endblock %}\n"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print(f"Successfully refactored {filepath}")
    else:
        print(f"Could not find boundaries for {filepath}")
