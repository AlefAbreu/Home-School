import re

with open('src/components/ChildDashboard.tsx', 'r') as f:
    content = f.read()

reading_old = """                        return (
                          <button
                            key={idx}
                            onClick={() => setReadingAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex flex-col ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 font-bold text-blue-700'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="font-bold mr-3 text-slate-400">{optId})</span>
                              {optText}
                            </div>
                          </button>
                        );"""

reading_new = """                        return (
                          <button
                            key={idx}
                            onClick={() => setReadingAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 font-bold text-blue-700 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 text-slate-700 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                              </div>
                              <div>
                                <span className="font-bold mr-2 text-slate-400">{optId})</span>
                                {optText}
                              </div>
                            </div>
                          </button>
                        );"""
content = content.replace(reading_old, reading_new)

math_old = """                        return (
                          <button
                            key={idx}
                            onClick={() => setMathAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex flex-col ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 font-bold text-purple-700'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <span className="font-bold mr-3 text-slate-400">{optId})</span>
                              {optText}
                            </div>
                          </button>
                        );"""

math_new = """                        return (
                          <button
                            key={idx}
                            onClick={() => setMathAnswer(optId)}
                            className={`w-full p-4 text-left border-2 rounded-2xl text-lg font-sans transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-purple-500 bg-purple-50 font-bold text-purple-700 shadow-sm'
                                : 'border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50 text-slate-700 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-purple-500 bg-purple-500' : 'border-slate-300 bg-white'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                              </div>
                              <div>
                                <span className="font-bold mr-2 text-slate-400">{optId})</span>
                                {optText}
                              </div>
                            </div>
                          </button>
                        );"""
content = content.replace(math_old, math_new)

with open('src/components/ChildDashboard.tsx', 'w') as f:
    f.write(content)
