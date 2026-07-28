with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("if (!stats) return null;", "if (!stats) return <div className='h-screen w-full flex items-center justify-center bg-blue-50'><div className='text-2xl font-bold text-blue-500 animate-pulse'>Carregando Missão...</div></div>;")

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
