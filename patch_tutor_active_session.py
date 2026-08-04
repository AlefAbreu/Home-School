with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { getStudentResults, subscribeToStudentResults, StudentResult, evaluateStudentResult, updateStudentResult, deleteStudentResult } from '../lib/db';",
    "import { getStudentResults, subscribeToStudentResults, StudentResult, evaluateStudentResult, updateStudentResult, deleteStudentResult, subscribeToActiveSession } from '../lib/db';"
)

state_vars = """
  const [activeTab, setActiveTab] = useState<'create' | 'all' | 'local'>('create');
  const [drivePending, setDrivePending] = useState<any[]>([]);
  const [driveCompleted, setDriveCompleted] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [localActiveSession, setLocalActiveSession] = useState<{sessionData: any, isApproved: boolean} | null>(null);
"""

content = content.replace(
    "  const [activeTab, setActiveTab] = useState<'create' | 'all' | 'local'>('create');\n  const [drivePending, setDrivePending] = useState<any[]>([]);\n  const [driveCompleted, setDriveCompleted] = useState<any[]>([]);\n  const [loadingDrive, setLoadingDrive] = useState(false);",
    state_vars
)

use_effect = """
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsubscribe = subscribeToStudentResults(auth.currentUser.uid, (res) => {
      setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    
    const unsubscribeSession = subscribeToActiveSession(auth.currentUser.uid, (data) => {
      if (data) {
        setLocalActiveSession({ sessionData: data.sessionData, isApproved: data.isApproved });
      } else {
        setLocalActiveSession(null);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeSession();
    };
  }, []);
"""

content = content.replace(
    "  useEffect(() => {\n    if (!auth.currentUser) return;\n    const unsubscribe = subscribeToStudentResults(auth.currentUser.uid, (res) => {\n      setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));\n    });\n    return () => unsubscribe();\n  }, []);",
    use_effect
)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
