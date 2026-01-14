import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, LayoutTemplate } from 'lucide-react';
import UploadZone from './components/UploadZone';
import RoastResult from './components/RoastResult';
import LoginButton from './components/LoginButton';
import LanguageSelector from './components/LanguageSelector';
import PricingModal from './components/PricingModal';
import AdminDashboard from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { API_BASE_URL } from './config';

function Home({ user, handleLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roastData, setRoastData] = useState(null);
  const [language, setLanguage] = useState('English');
  const [limitReached, setLimitReached] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'cyberpunk');

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setLimitReached(false);
    setRoastData(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('language', language);

    try {
      // Small artificial delay for dramatic effect if it's too fast
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
      const request = axios.post(`${API_BASE_URL}/api/roast`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true // Ensure cookie is sent
      });

      const [response] = await Promise.all([request, minLoadingTime]);
      setRoastData(response.data);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || 'Failed to roast your resume. The server might be cringing too hard.';
      setError(errorMessage);

      if (err.response?.data?.limitReached) {
        setLimitReached(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const isPro = theme === 'professional';

  return (
    <div className={isPro
      ? "min-h-screen w-full bg-white text-gray-900 font-sans selection:bg-blue-100 flex flex-col items-center py-12 px-4 transition-colors duration-500"
      : "min-h-screen bg-cyber-black text-gray-200 flex flex-col items-center py-12 px-4 relative overflow-hidden crt font-mono selection:bg-neon-pink selection:text-white transition-colors duration-500"
    }>

      {/* Dynamic Background - Only for Cyberpunk */}
      {!isPro && (
        <>
          <div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:40px_40px] opacity-20 pointer-events-none animate-pulse-slow"></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent pointer-events-none"></div>
          {/* Floating Particles */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-neon-cyan rounded-full animate-ping opacity-75"></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 bg-neon-pink rounded-full animate-pulse opacity-50"></div>
        </>
      )}

      {/* Executive Background (Subtle) */}
      {isPro && (
        <div className="absolute inset-0 z-0 bg-gray-50 pointer-events-none"></div>
      )}

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-16 z-10 relative w-full flex flex-col items-center"
      >
        <div className="absolute top-0 right-4 md:right-10 flex flex-col items-end gap-4">
          {user ? (
            <div className={`flex items-center gap-4 p-2 rounded-full border backdrop-blur-md transition-colors ${isPro ? "bg-white border-gray-200 shadow-sm" : "bg-black/50 border-neon-green/30"}`}>
              <img
                src={user.photos?.[0]?.value || "https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"}
                alt="Profile"
                className={`w-10 h-10 rounded-full border-2 ${isPro ? "border-gray-300" : "border-neon-green"}`}
              />
              <div className="hidden md:block text-left mr-2">
                <div className={`text-xs font-mono uppercase ${isPro ? "text-gray-500" : "text-neon-green"}`}>OPERATOR</div>
                <div className={`text-sm font-bold ${isPro ? "text-gray-900" : "text-white"}`}>{user.displayName}</div>
              </div>
              <button
                onClick={handleLogout}
                className={`text-xs font-mono border px-2 py-1 rounded transition-colors ${isPro ? "text-red-500 border-red-200 hover:bg-red-50" : "text-red-400 hover:text-red-500 border-red-500/30"}`}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <LoginButton theme={theme} />
          )}

          {/* THEME TOGGLE */}
          <div className={`flex p-1 rounded-full border backdrop-blur-md transition-colors ${isPro ? "bg-white border-gray-200 shadow-sm" : "bg-black/50 border-neon-green/30"}`}>
            <button
              onClick={() => setTheme('cyberpunk')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${theme === 'cyberpunk' ? 'bg-neon-green text-black shadow-[0_0_10px_lime]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutTemplate className="w-3 h-3" /> HACKER
            </button>
            <button
              onClick={() => setTheme('professional')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${theme === 'professional' ? 'bg-black text-white shadow-lg' : isPro ? 'text-gray-400 hover:text-black' : 'text-gray-400 hover:text-white'}`}
            >
              <Eye className="w-3 h-3" /> EXECUTIVE
            </button>
          </div>
        </div>

        <h1
          className={isPro
            ? "text-6xl md:text-8xl font-extrabold tracking-tight text-black mt-12 md:mt-0 transition-all duration-500"
            : "text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_20px_rgba(0,255,255,0.6)] animate-glitch relative mt-12 md:mt-0"
          }
          data-text="RESUME ROASTER"
        >
          RESUME<br />ROASTER
        </h1>
        <p className={`mt-4 text-xl font-mono tracking-widest uppercase border-b inline-block pb-1 transition-all duration-500 ${isPro ? "text-gray-500 border-gray-300" : "text-neon-green border-neon-green animate-pulse"}`}>
          [ ROAST PROTOCOL INITIALIZED ]
        </p>
      </motion.header>

      {/* Language Selector in Header/Hero area */}
      <div className="absolute top-4 left-4 z-20">
        <LanguageSelector selectedLanguage={language} onSelect={setLanguage} theme={theme} />
      </div>

      <main className="w-full max-w-4xl z-10 flex flex-col items-center space-y-12">
        <AnimatePresence mode="wait">
          {!user && !roastData ? (
            <div className={`text-center p-8 border rounded-xl backdrop-blur-sm max-w-lg transition-colors ${isPro ? "bg-white border-gray-200 shadow-xl" : "border-neon-cyan/20 bg-black/60"}`}>
              <h2 className={`text-2xl font-bold mb-4 font-mono ${isPro ? "text-black" : "text-neon-cyan"}`}>AUTHENTICATION REQUIRED</h2>
              <p className={`mb-6 ${isPro ? "text-gray-600" : "text-gray-400"}`}>Access to the Roaster Core is restricted to authorized personnel only.</p>
              <LoginButton theme={theme} />
            </div>
          ) : !roastData ? (
            <motion.div
              key="upload"
              initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.9, opacity: 0, height: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="w-full flex justify-center"
            >
              <UploadZone onFileSelect={handleFileUpload} isLoading={loading} theme={theme} />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center p-8 border rounded-lg backdrop-blur-md ${isPro ? "bg-white border-gray-200 shadow-xl" : "border-neon-pink/50 bg-black/80"}`}
          >
            <div className="relative w-24 h-24 mb-6">
              <div className={`absolute inset-0 border-4 border-t-transparent rounded-full animate-spin ${isPro ? "border-gray-300" : "border-neon-cyan"}`}></div>
              <div className={`absolute inset-2 border-4 border-b-transparent rounded-full animate-spin-slow ${isPro ? "border-black" : "border-neon-pink"}`}></div>
            </div>

            <p className={`font-bold text-xl tracking-widest ${isPro ? "text-black animate-pulse" : "text-neon-pink animate-pulse"}`}>ANALYZING CRINGE...</p>
            <div className={`w-64 h-2 rounded mt-4 overflow-hidden relative ${isPro ? "bg-gray-200" : "bg-gray-800"}`}>
              <div className={`absolute top-0 left-0 h-full w-1/2 animate-scanline ${isPro ? "bg-black" : "bg-neon-green"}`} style={{ width: '100%', animationDuration: '2s', transformOrigin: 'left' }}></div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 border-l-4 rounded max-w-md text-center backdrop-blur-sm flex flex-col items-center shadow-lg ${isPro ? "bg-red-50 border-red-500 text-red-900" : "bg-red-900/40 border-glitch-red text-red-200 shadow-[0_0_15px_rgba(255,0,0,0.3)]"}`}
          >
            <span className={`font-bold block text-2xl mb-2 font-display ${isPro ? "text-red-600" : "text-glitch-red"}`}>⚠ SYSTEM ERROR</span>
            <p className="font-mono text-sm mb-4">{error}</p>

            {limitReached && (
              <button
                onClick={() => setShowPricing(true)}
                className={`px-6 py-2 font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 ${isPro ? "bg-black text-white hover:bg-gray-800 shadow-lg" : "bg-neon-cyan hover:bg-white text-black shadow-[0_0_10px_rgba(0,255,255,0.4)]"}`}
              >
                UNLOCK GOD MODE
              </button>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {roastData && (
            <RoastResult
              data={roastData}
              isPremium={user?.isPremium}
              onUnlock={() => setShowPricing(true)}
              theme={theme}
            />
          )}
        </AnimatePresence>

        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} theme={theme} />

        {roastData && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setRoastData(null)}
            className={`group relative mt-12 px-10 py-4 font-bold font-mono uppercase tracking-widest overflow-hidden transition-all duration-300 ${isPro ? "bg-black text-white border-2 border-black hover:bg-gray-800 hover:border-gray-800 shadow-lg rounded-lg" : "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:text-black hover:shadow-[0_0_20px_var(--neon-cyan)]"}`}
          >
            <span className="relative z-10">Roast Another Victim</span>
            {!isPro && <div className="absolute inset-0 bg-neon-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>}
          </motion.button>
        )}
      </main>

      <footer className={`mt-20 font-mono text-xs z-10 opacity-70 hover:opacity-100 transition-opacity ${isPro ? "text-gray-400" : "text-gray-600"}`}>
        &copy; 2026 RESUME ROASTER CORP. DO NOT TAKE IT PERSONALLY. // RESISTANCE IS FUTILE.
      </footer>
    </div>
  );
}



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for logged in user
    const checkUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, { withCredentials: true });
        if (res.data) setUser(res.data);
      } catch (e) {
        console.log("Not logged in");
      }
    };
    checkUser();
  }, []);

  const handleLogout = () => {
    window.location.href = `${API_BASE_URL}/auth/logout`;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} handleLogout={handleLogout} />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
