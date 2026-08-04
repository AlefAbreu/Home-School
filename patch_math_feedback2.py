import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

math_feedback_old_2 = """    } else {
      setMathFeedback("Ops, tente novamente! Verifique a dica.");"""
math_feedback_new_2 = """    } else {
      setMathFeedback(feedback || "Ops, tente novamente! Verifique a dica.");"""

content = content.replace(math_feedback_old_2, math_feedback_new_2)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
