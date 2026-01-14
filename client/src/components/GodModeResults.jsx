import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal, AlertTriangle, CheckCircle, Zap, FileText, Copy, Download, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const GodModeResults = ({ data, theme = 'cyberpunk' }) => {
    const [activeTab, setActiveTab] = useState('diagnostic');
    const [copyStatus, setCopyStatus] = useState('idle'); // idle, copied

    // Fallback if data structure is missing (e.g. old roast)
    if (!data.constructive_insights) {
        return <div className="text-red-500 font-mono text-center p-4">LEGACY DATA FORMAT DETECTED. RE-ROAST FOR GOD MODE 2.0.</div>;
    }

    const { constructive_insights, ats_gap_analysis, de_cringe_rewriter, remastered_resume_markdown } = data;

    const handleCopy = async () => {
        if (!remastered_resume_markdown) return;
        try {
            await navigator.clipboard.writeText(remastered_resume_markdown);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy code: ', err);
        }
    };

    const handleDownload = () => {
        if (!remastered_resume_markdown) return;
        window.print();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    // --- THEME STYLES ---
    const isPro = theme === 'professional';

    const styles = {
        wrapper: isPro ? "text-gray-900 font-sans selection:bg-gray-200 selection:text-black" : "text-gray-300 font-mono",
        heading: isPro ? "text-3xl font-extrabold tracking-tight text-gray-900 bg-white border border-gray-200 shadow-sm rounded-lg px-6 py-3 inline-block mb-4" : "text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500",
        subheading: isPro ? "text-lg font-bold text-gray-900 bg-white border border-gray-200 shadow-sm rounded-md px-4 py-2 mt-8 mb-4 inline-block" : "text-2xl font-bold text-red-500 mb-6 flex items-center gap-2",
        card: isPro ? "bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 rounded-2xl mb-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300" : "bg-black border border-neon-green/50 rounded p-6 font-mono relative overflow-hidden mb-8",
        redFlagCard: isPro ? "bg-white border border-red-100 p-5 rounded-xl text-left hover:border-red-200 hover:shadow-md transition-all group" : "bg-red-950/30 border border-red-500/50 p-5 rounded hover:bg-black/80 transition-colors group",
        atsCard: isPro ? "bg-white border border-gray-200 p-3 px-4 rounded-lg flex items-center gap-3 shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700" : "bg-blue-900/10 border border-blue-500/30 pl-3 pr-2 py-2 rounded flex items-center gap-3",
        cringeOriginal: isPro ? "bg-red-50/50 border-r border-red-100 p-6 md:w-1/2 relative" : "ctx-cringe md:w-1/2 p-6 bg-red-900/5 border-r border-gray-800 relative",
        cringeOptimized: isPro ? "bg-emerald-50/50 p-6 md:w-1/2 relative" : "ctx-optimized md:w-1/2 p-6 bg-green-900/5 relative overflow-hidden",
        strategicBubble: isPro ? "inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-xl text-sm tracking-widest uppercase transform hover:scale-[1.02] transition-transform" : "inline-block bg-black border border-neon-green rounded-full px-8 py-3 relative group cursor-default"
    };

    return (
        <div className={`w-full text-left transition-colors duration-500 ${styles.wrapper}`}>
            {/* HEADER & TABS */}
            <div className="mb-8 no-print">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        {!isPro && (
                            <div className="text-xs text-neon-green font-mono mb-1 tracking-[0.3em] uppercase">
                                Level 5 Clearance Verified
                            </div>
                        )}
                        <h2 className={styles.heading}>
                            {isPro ? "Executive Resume Analysis" : "GOD MODE ACTIVATED"}
                        </h2>
                        {isPro && (
                            <p className="text-gray-500 font-medium">Professional Grade Audit • Bank-Standard Security</p>
                        )}
                    </div>

                    {/* TABS */}
                    <div className="flex gap-1 p-1 rounded-lg backdrop-blur-md transition-colors"
                        style={{
                            backgroundColor: isPro ? '#f1f5f9' : 'rgba(0,0,0,0.5)',
                            border: isPro ? '1px solid #e2e8f0' : '1px solid rgba(0, 255, 159, 0.3)'
                        }}
                    >
                        <button
                            onClick={() => setActiveTab('diagnostic')}
                            className={`px-5 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'diagnostic'
                                ? (isPro ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'bg-neon-green text-black shadow-[0_0_15px_rgba(0,255,0,0.5)]')
                                : (isPro ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white')
                                }`}
                        >
                            <Terminal className="w-4 h-4" /> DIAGNOSTIC
                        </button>
                        <button
                            onClick={() => setActiveTab('remastered')}
                            className={`px-5 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'remastered'
                                ? (isPro ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]')
                                : (isPro ? 'text-gray-500 hover:text-gray-900' : 'text-gray-400 hover:text-white')
                                }`}
                        >
                            <FileText className="w-4 h-4" /> REMASTERED
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'diagnostic' ? (
                    <motion.div
                        key="diagnostic"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        className="space-y-12 no-print"
                    >
                        {/* RECRUITER REALITY CHECK */}
                        <motion.div variants={itemVariants} className={styles.card}>
                            {!isPro && <div className="absolute top-0 left-0 w-full h-1 bg-neon-green/50"></div>}

                            <h3 className={isPro ? "flex items-center gap-2 text-lg font-bold text-gray-900 mb-4" : "text-neon-green font-bold flex items-center gap-2 mb-4"}>
                                <Terminal className="w-5 h-5" /> {isPro ? "Recruiter Impression Log" : "RECRUITER_REALITY_CHECK.LOG"}
                            </h3>

                            <div className={`text-sm leading-relaxed ${isPro ? "text-gray-600 border-l-4 border-gray-200 pl-4 italic" : "text-gray-300 border-l-2 border-neon-green/30 pl-4"}`}>
                                {!isPro && <span className="text-neon-green mr-2">$</span>}
                                {constructive_insights.recruiter_reality_check}
                            </div>
                        </motion.div>

                        {/* SECTION A: FATAL RED FLAGS */}
                        <motion.div variants={itemVariants}>
                            <h3 className={styles.subheading}>
                                {isPro ? "Critical Issues Detected" : <><ShieldAlert className="w-6 h-6" /> FATAL RED FLAGS</>}
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                {constructive_insights.fatal_red_flags.map((flag, idx) => (
                                    <div key={idx} className={styles.redFlagCard}>
                                        <div className={`font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2 ${isPro ? "text-red-700" : "text-red-400"}`}>
                                            <AlertTriangle className="w-3 h-3" />
                                            {flag.error}
                                        </div>
                                        <p className={`text-xs mb-3 ${isPro ? "text-gray-600" : "text-gray-400"}`}>{flag.detail}</p>
                                        <div className={`text-xs p-2 rounded ${isPro ? "bg-red-50 text-red-700 border border-red-100" : "text-white bg-red-500/10 border border-red-500/10"}`}>
                                            <span className={`font-bold mr-1 ${isPro ? "text-red-800" : "text-red-300"}`}>FIX:</span> {flag.fix}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* SECTION B: ATS GAP ANALYSIS */}
                        <motion.div variants={itemVariants}>
                            <h3 className={styles.subheading}>
                                {isPro ? "ATS Keyword Analysis" : <><Zap className="w-6 h-6" /> ATS GAP ANALYSIS</>}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {ats_gap_analysis.map((gap, idx) => (
                                    <div key={idx} className={styles.atsCard}>
                                        <div>
                                            <div className={`font-bold text-sm ${isPro ? "text-gray-900" : "text-blue-300"}`}>{gap.missing_keyword}</div>
                                            <div className={`text-[10px] uppercase ${isPro ? "text-blue-600 font-bold" : "text-gray-500"}`}>{gap.category}</div>
                                        </div>
                                        {gap.impact === 'High' && (
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider ${isPro ? "bg-red-100 text-red-700" : "bg-red-500 text-black"}`}>
                                                HIGH IMPACT
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* SECTION C: DE-CRINGE REWRITER */}
                        <motion.div variants={itemVariants}>
                            <h3 className={styles.subheading}>
                                {isPro ? "Content Optimization" : <><Zap className="w-6 h-6" /> DE-CRINGE REWRITER</>}
                            </h3>

                            <div className="space-y-6">
                                {de_cringe_rewriter.map((item, idx) => (
                                    <div key={idx} className={`rounded-lg overflow-hidden flex flex-col md:flex-row ${isPro ? "border border-gray-200" : "border border-gray-800"}`}>
                                        {/* LEFT: CRINGE */}
                                        <div className={styles.cringeOriginal}>
                                            <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase ${isPro ? "bg-red-100 text-red-800" : "text-red-500 border border-red-500/50"}`}>
                                                Original
                                            </div>
                                            <div className={`mt-6 font-mono text-sm decoration-2 ${isPro ? "text-gray-900 font-medium bg-white p-3 rounded border border-gray-200 shadow-sm line-through decoration-red-500" : "text-gray-400 line-through decoration-red-500/50 opacity-70"}`}>
                                                "{item.original}"
                                            </div>
                                            {isPro ? (
                                                <div className="mt-4 text-xs text-red-700 font-bold bg-red-50 p-3 rounded border border-red-100 flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                                    <span>{item.flaw}</span>
                                                </div>
                                            ) : (
                                                <div className="mt-4 text-xs text-red-400">
                                                    <span className="font-bold">⚠ FLAW:</span> {item.flaw}
                                                </div>
                                            )}

                                        </div>

                                        {/* RIGHT: OPTIMIZED */}
                                        <div className={styles.cringeOptimized}>
                                            {!isPro && <div className="absolute top-0 right-0 w-20 h-20 bg-neon-green/10 blur-xl rounded-full pointer-events-none"></div>}
                                            <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 ${isPro ? "bg-emerald-100 text-emerald-800" : "text-neon-green border border-neon-green/50"}`}>
                                                <CheckCircle className="w-3 h-3" /> Optimized
                                            </div>
                                            <div className={`mt-6 font-mono text-sm ${isPro ? "text-gray-900 font-semibold bg-white p-3 rounded border border-emerald-100 shadow-sm" : "text-white drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]"}`}>
                                                "{item.fix}"
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* STRATEGIC FIX FOOTER */}
                        <motion.div variants={itemVariants} className="mt-12 text-center">
                            <div className={styles.strategicBubble}>
                                {!isPro && <div className="absolute inset-0 bg-neon-green/20 rounded-full blur group-hover:bg-neon-green/40 transition-all"></div>}
                                <span className={`relative z-10 font-bold uppercase tracking-widest text-sm ${isPro ? "text-white" : "text-neon-green font-mono"}`}>
                                    STRATEGIC PRIORITY: {constructive_insights.strategic_fix}
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    /* REMASTERED VERSION (White Paper Theme) */
                    <motion.div
                        key="remastered"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={containerVariants}
                        className="bg-white text-gray-900 p-8 md:p-12 rounded-sm shadow-2xl relative min-h-[800px] print-container"
                    >
                        {/* Toolbar */}
                        <div className="absolute top-4 right-4 flex gap-2 no-print">
                            <button
                                onClick={handleCopy}
                                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors tooltip"
                                title="Copy to Clipboard"
                            >
                                {copyStatus === 'copied' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleDownload}
                                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                                title="Download PDF"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Header Decoration */}
                        <div className="w-20 h-1 bg-gray-900 mb-8 no-print"></div>

                        {remastered_resume_markdown ? (
                            <div className="prose prose-slate max-w-none print:prose-sm">
                                <ReactMarkdown>{remastered_resume_markdown}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 pt-20">
                                <div className="animate-spin mb-4 text-gray-300">
                                    <RefreshCw className="w-8 h-8" />
                                </div>
                                <p>Generating remastered version...</p>
                                <p className="text-xs mt-2">If this persists, try re-roasting in God Mode.</p>
                            </div>
                        )}

                        {/* Watermark */}
                        <div className="absolute bottom-4 right-6 text-gray-200 font-black text-4xl opacity-20 pointer-events-none select-none no-print">
                            ANTIGRAVITY
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GodModeResults;
