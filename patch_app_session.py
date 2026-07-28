with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { Cloud, Download, Upload } from 'lucide-react';", "import { Cloud, Download, Upload } from 'lucide-react';\nimport { saveActiveSession, subscribeToActiveSession } from './lib/db';")
content = content.replace("import { GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';", "import { GraduationCap, LayoutDashboard, LogOut } from 'lucide-react';\nimport { saveActiveSession, subscribeToActiveSession } from './lib/db';")


# Modify handlers
old_handle_generate = """  const handleGenerate = (data: GeneratedStudySession, text: string) => {
    setSessionData(data);
    setBaseText(text);
    setIsApproved(false);
  };"""

new_handle_generate = """  const handleGenerate = (data: GeneratedStudySession, text: string) => {
    setSessionData(data);
    setBaseText(text);
    setIsApproved(false);
    saveActiveSession(data, text, false).catch(console.error);
  };"""

content = content.replace(old_handle_generate, new_handle_generate)

old_handle_approve = """  const handleApprove = () => {
    setIsApproved(true);
    setActiveTab('child');
  };"""

new_handle_approve = """  const handleApprove = () => {
    setIsApproved(true);
    setActiveTab('child');
    if (sessionData) {
      saveActiveSession(sessionData, baseText, true).catch(console.error);
    }
  };"""

content = content.replace(old_handle_approve, new_handle_approve)

old_auth_state = """    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();"""

new_auth_state = """    let unsubscribeSession: () => void;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        unsubscribeSession = subscribeToActiveSession((data) => {
          if (data) {
            setSessionData(data.sessionData);
            setBaseText(data.baseText);
            setIsApproved(data.isApproved);
          }
        });
      }
    });
    return () => {
      unsubscribe();
      if (unsubscribeSession) unsubscribeSession();
    };"""

content = content.replace(old_auth_state, new_auth_state)

with open('src/App.tsx', 'w') as f:
    f.write(content)
