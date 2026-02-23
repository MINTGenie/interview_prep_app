#!/usr/bin/env python3
"""Assembles interview-prep-app.html from part files."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def read(name):
    with open(os.path.join(BASE, name), 'r', encoding='utf-8') as f:
        return f.read()

parts = [
    read('p1_head_css.txt'),    # <!DOCTYPE html> ... <style> ... </style></head>
    read('p2_body_html.txt'),   # <body> ... <script>
    read('p3_js_core.txt'),     # LLM clients, session mgmt, routing
    read('p4_js_screens.txt'),  # analyzeRole, generatePrep, history
    read('p5_js_tabs.txt'),     # renderSkillsMap, renderStories, renderMockInterview
    read('p6_js_canvas.txt'),   # concept map canvas
    read('p7_js_finish.txt'),   # expansions, download, init
    '</script>\n</body>\n</html>\n',
]

output = '\n'.join(parts)

out_path = os.path.join(BASE, 'interview-prep-app.html')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(output)

size_kb = os.path.getsize(out_path) / 1024
print(f"Built: {out_path}")
print(f"Size:  {size_kb:.1f} KB")
print(f"Lines: {output.count(chr(10))}")
