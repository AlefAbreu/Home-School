import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

helper = """
  // Helper to extract options se a IA colocou no texto
  const extractOptions = (text: string, opcoes?: string[]) => {
    if (opcoes && opcoes.length > 0) return { cleanText: text, options: opcoes };
    
    // Look for patterns like "A) text" or "a) text" or "1. text" at the end of the question
    const lines = text.split('\\n');
    const options = [];
    const cleanLines = [];
    
    let inOptions = false;
    for (const line of lines) {
      if (line.trim().match(/^([a-eA-E][\\)\.]|\\d+\\.)\\s+(.+)$/)) {
        inOptions = true;
        const match = line.trim().match(/^([a-eA-E][\\)\.]|\\d+\\.)\\s+(.+)$/);
        if (match) {
          options.push(match[2].trim());
        }
      } else {
        if (!inOptions) {
          cleanLines.push(line);
        }
      }
    }
    
    if (options.length >= 2) {
      return { cleanText: cleanLines.join('\\n'), options };
    }
    
    return { cleanText: text, options: null };
  };
"""

content = content.replace(
    'export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText, fileId, fileName }) => {',
    'export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText, fileId, fileName }) => {' + helper
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
