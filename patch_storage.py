import os
import glob

files = glob.glob('src/**/*.ts', recursive=True) + glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    new_content = content.replace('sessionStorage', 'localStorage')
    
    if content != new_content:
        with open(file, 'w') as f:
            f.write(new_content)
