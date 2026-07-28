with open('src/lib/db.ts', 'r') as f:
    content = f.read()

subscribe_results_code = """
export const subscribeToStudentResults = (callback: (results: StudentResult[]) => void) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return () => {};
  const colRef = collection(db, 'users', uid, 'results');
  return onSnapshot(colRef, (snapshot) => {
    const results = snapshot.docs.map(doc => doc.data() as StudentResult);
    callback(results);
  }, (error) => {
    console.warn("Could not subscribe to results", error);
    callback([]);
  });
};
"""

content = content + "\n" + subscribe_results_code

with open('src/lib/db.ts', 'w') as f:
    f.write(content)
