with open('src/components/ChildArea.tsx', 'r') as f:
    content = f.read()

import re

# Add imports
content = re.sub(
    r"import \{ motion \} from 'framer-motion';",
    "import { motion } from 'framer-motion';\nimport { listActivitiesFromDrive, readActivityFromDrive, getDriveToken } from '../lib/drive';",
    content
)

# Update the component body
new_body = """export const ChildArea: React.FC<ChildAreaProps> = ({ sessionData: initialSessionData, baseText: initialBaseText, isApproved, onGoBack }) => {
  const [resultsToReview, setResultsToReview] = useState<StudentResult[]>([]);
  const [activeReviewResult, setActiveReviewResult] = useState<StudentResult | null>(null);
  
  const [driveActivities, setDriveActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDriveSession, setActiveDriveSession] = useState<{sessionData: GeneratedStudySession, baseText: string, fileId: string} | null>(null);

  const fetchActivitiesAndReviews = async () => {
    setLoading(true);
    try {
      if (getDriveToken()) {
        const files = await listActivitiesFromDrive();
        setDriveActivities(files);
      }
      
      const results = await getStudentResults();
      const toReview = results.filter(r => {
        const hasReadingReview = r.readingAnswers.some(a => a.needsReview);
        const hasChallengeReview = r.mathChallengeAnswers.some(a => a.needsReview);
        const hasProblemReview = r.mathProblemAnswers.some(a => a.needsReview);
        return hasReadingReview || hasChallengeReview || hasProblemReview;
      });
      setResultsToReview(toReview);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivitiesAndReviews();
  }, []);

  const handleReviewComplete = () => {
    setActiveReviewResult(null);
    fetchActivitiesAndReviews();
  };
  
  const startDriveActivity = async (fileId: string) => {
    setLoading(true);
    try {
      const data = await readActivityFromDrive(fileId);
      setActiveDriveSession({ sessionData: data.sessionData, baseText: data.baseText, fileId });
    } catch (e) {
      console.error("Failed to load activity:", e);
      alert("Erro ao carregar a atividade do Google Drive.");
    }
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center flex justify-center items-center h-[60vh]"><div className="animate-pulse text-blue-500 font-bold text-xl">Carregando Missões do Drive...</div></div>;

  if (activeReviewResult) {
    return <ChildReviewDashboard result={activeReviewResult} onComplete={handleReviewComplete} />;
  }

  if (activeDriveSession) {
    // We pass the fileId as a custom prop to ChildDashboard or we can handle it there,
    // but for now let's pass it by modifying ChildDashboard or just using it here.
    return <ChildDashboard session={activeDriveSession.sessionData} baseText={activeDriveSession.baseText} fileId={activeDriveSession.fileId} fileName={driveActivities.find(f => f.id === activeDriveSession.fileId)?.name} />;
  }
  
  // Fallback to local session if no drive activities but local is approved
  if (initialSessionData && isApproved && driveActivities.length === 0) {
    return <ChildDashboard session={initialSessionData} baseText={initialBaseText} />;
  }

  const hasReviews = resultsToReview.length > 0;
  const hasDriveActivities = driveActivities.length > 0;

  if (!hasDriveActivities && !hasReviews && !(initialSessionData && isApproved)) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-xl text-slate-500 mb-4">Nenhuma aula pendente no Google Drive.</p>
        <button 
          onClick={onGoBack}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full"
        >
          Voltar ao Painel do Tutor
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Suas Missões</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {driveActivities.map((file) => (
          <motion.div 
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-blue-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => startDriveActivity(file.id)}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Missão: {file.name.replace('.json', '')}</h3>
            <p className="text-slate-600 mb-6 flex-1">Uma nova aventura de aprendizado aguarda você!</p>
            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Começar
            </button>
          </motion.div>
        ))}
        
        {(!hasDriveActivities && initialSessionData && isApproved) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-blue-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => setActiveDriveSession({ sessionData: initialSessionData, baseText: initialBaseText, fileId: '' })}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nova Missão</h3>
            <p className="text-slate-600 mb-6 flex-1">Sessão Local Ativa</p>
            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Começar
            </button>
          </motion.div>
        )}

        {resultsToReview.map((result) => (
          <motion.div 
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 p-8 rounded-3xl shadow-sm border-2 border-amber-200 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
            onClick={() => setActiveReviewResult(result)}
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Revisão Necessária</h3>
            <p className="text-slate-600 mb-6 flex-1">
              Missão de {new Date(result.date).toLocaleDateString()} tem atividades para você refazer.
            </p>
            <button className="bg-amber-500 text-white font-bold py-3 px-8 rounded-2xl w-full flex items-center justify-center gap-2">
              <PenTool className="w-5 h-5" /> Refazer Agora
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};"""

content = re.sub(
    r"export const ChildArea: React\.FC<ChildAreaProps> = \(\{[\s\S]*?\}\);",
    new_body,
    content
)

with open('src/components/ChildArea.tsx', 'w') as f:
    f.write(content)
