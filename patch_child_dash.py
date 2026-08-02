with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Add props
content = re.sub(
    r"interface ChildDashboardProps \{",
    "interface ChildDashboardProps {\n  fileId?: string;\n  fileName?: string;",
    content
)

content = re.sub(
    r"export const ChildDashboard: React\.FC<ChildDashboardProps> = \(\{ session, baseText \} \)=> \{",
    "export const ChildDashboard: React.FC<ChildDashboardProps> = ({ session, baseText, fileId, fileName }) => {",
    content
)

# Import drive API
content = re.sub(
    r"import \{ getGamification, incrementMissions, awardBadge, UserStats, saveStudentResult, StudentResult \} from '\.\./lib/db';",
    "import { getGamification, incrementMissions, awardBadge, UserStats, saveStudentResult, StudentResult } from '../lib/db';\nimport { markActivityAsCompleted } from '../lib/drive';",
    content
)

# Update completeSession
complete_session_new = """  const completeSession = async (finalProblemAnswers = mathProblemAnswers, finalChallengeAnswers = mathChallengeAnswers, finalReadingAnswers = readingAnswers) => {
    const resultData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      readingText: baseText,
      readingAnswers: finalReadingAnswers,
      mathChallengeAnswers: finalChallengeAnswers,
      mathProblemAnswers: finalProblemAnswers,
      evaluated: false
    };
    
    // Save locally
    await saveStudentResult(resultData);
    
    // Move on Drive if fileId exists
    if (fileId && fileName) {
      try {
        await markActivityAsCompleted(fileId, resultData, fileName);
      } catch (e) {
        console.error("Failed to mark activity completed on Drive", e);
      }
    }

    // Award gamification
    await incrementMissions();
"""

content = re.sub(
    r"  const completeSession = async \([\s\S]*?await incrementMissions\(\);",
    complete_session_new,
    content
)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
