with open('src/App.tsx', 'r') as f:
    content = f.read()

# Fix duplicates if any
while "if (currentUser && getDriveToken()) setHasDriveToken(true);\n      if (currentUser && getDriveToken()) setHasDriveToken(true);" in content:
    content = content.replace(
        "if (currentUser && getDriveToken()) setHasDriveToken(true);\n      if (currentUser && getDriveToken()) setHasDriveToken(true);",
        "if (currentUser && getDriveToken()) setHasDriveToken(true);"
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)
