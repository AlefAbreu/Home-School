with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Update props
content = re.sub(
    r"export const ChildDashboard: React\.FC<ChildDashboardProps> = \(\{ session, baseText \} *\) *=> *\{",
    "export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText, fileId, fileName }) => {",
    content
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
