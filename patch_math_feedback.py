import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

math_feedback_old = """    if (isCorrect) {
      setMathFeedback("Problema resolvido com perfeição!");"""

math_feedback_new = """    const feedback = currentProblem?.multipla_escolha?.opcoes?.find((o: any) => o.id.toLowerCase() === String(mathAnswer).toLowerCase())?.feedback_pedagogico;
    
    if (isCorrect) {
      setMathFeedback(feedback || "Problema resolvido com perfeição!");"""
content = content.replace(math_feedback_old, math_feedback_new)

math_feedback_old_2 = """    } else {
      setMathFeedback("Ops! Tente novamente.");
    }"""
math_feedback_new_2 = """    } else {
      setMathFeedback(feedback || "Ops! Tente novamente.");
    }"""
content = content.replace(math_feedback_old_2, math_feedback_new_2)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
