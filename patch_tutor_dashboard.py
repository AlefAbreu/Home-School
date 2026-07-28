with open('src/components/TutorDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { getStudentResults, StudentResult, evaluateStudentResult, updateStudentResult, deleteStudentResult } from '../lib/db';",
    "import { getStudentResults, subscribeToStudentResults, StudentResult, evaluateStudentResult, updateStudentResult, deleteStudentResult } from '../lib/db';"
)

old_use_effect = """  const fetchResults = async () => {
    const res = await getStudentResults();
    setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    fetchResults();
  }, []);"""

new_use_effect = """  const fetchResults = async () => {
    const res = await getStudentResults();
    setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  useEffect(() => {
    const unsubscribe = subscribeToStudentResults((res) => {
      setResults(res.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });
    return () => unsubscribe();
  }, []);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/components/TutorDashboard.tsx', 'w') as f:
    f.write(content)
