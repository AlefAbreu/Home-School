with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "const [hasDriveToken, setHasDriveToken]" in line:
        if skip:
            continue
        skip = True
    new_lines.append(line)

with open('src/App.tsx', 'w') as f:
    f.write("".join(new_lines))
