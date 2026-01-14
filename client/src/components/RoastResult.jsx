import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import GodModeResults from './GodModeResults';
import CheckoutButton from './CheckoutButton';

const RoastResult = ({ data, isPremium, onUnlock, theme }) => {
    if (!data) return null;

    const { score, roast_headline, glitches, fix_it, premium_teaser } = data;

    // Color coding
    const getScoreColor = (s) => {
        if (s < 20) return 'text-glitch-red drop-shadow-[0_0_10px_red]';
        if (s < 50) return 'text-orange-500 drop-shadow-[0_0_10px_orange]';
        if (s < 80) return 'text-yellow-400 drop-shadow-[0_0_10px_yellow]';
        return 'text-neon-green drop-shadow-[0_0_10px_lime]';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full max-w-4xl mt-12 bg-black/80 border border-neon-pink/50 p-8 md:p-12 rounded-xl backdrop-blur-md relative overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.15)]"
        >
            {/* Animated Gradient Border Top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan animate-pulse"></div>

            <div className="text-center mb-12 relative">
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-glitch-red font-mono text-sm tracking-[0.5em] mb-4 uppercase animate-pulse"
                >
                    ⚠ Analysis Complete{isPremium ? " // GOD MODE" : ""} ⚠
                </motion.h2>

                <motion.h1
                    className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    {roast_headline}
                </motion.h1>

                {/* Score Circle */}
                <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    className="relative inline-block"
                >
                    <div className="absolute inset-0 rounded-full border-4 border-neon-pink/30 animate-ping"></div>
                    <div className="border-4 border-double border-neon-pink p-8 rounded-full bg-black shadow-[0_0_30px_rgba(255,0,255,0.3)] min-w-[180px] min-h-[180px] flex flex-col justify-center items-center">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Employability</div>
                        <div className={`text-7xl font-black ${getScoreColor(score)} font-mono`}>
                            {score}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">/ 100</div>
                    </div>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 mb-10">
                {/* Glitches Section (Always Visible) */}
                <motion.div variants={itemVariants} className="space-y-6 bg-red-900/10 p-6 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-colors">
                    <h3 className="text-2xl font-bold text-neon-cyan border-b-2 border-neon-cyan/50 pb-3 flex items-center shadow-[0_2px_10px_rgba(0,255,255,0.2)]">
                        <span className="mr-3 text-3xl">🚫</span> FATAL ERRORS
                    </h3>
                    <ul className="space-y-4">
                        {glitches?.map((glitch, idx) => (
                            <motion.li
                                key={idx}
                                variants={itemVariants}
                                className="text-gray-300 font-mono text-sm flex items-start group"
                            >
                                <span className="text-glitch-red mr-3 mt-1 font-bold group-hover:translate-x-1 transition-transform">&gt;</span>
                                <span className="group-hover:text-white transition-colors">{glitch}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Fixes Section (Also Visible for Free, but basic) */}
                <motion.div variants={itemVariants} className="space-y-6 bg-green-900/10 p-6 rounded-lg border border-green-500/20 hover:border-green-500/50 transition-colors">
                    <h3 className="text-2xl font-bold text-neon-green border-b-2 border-neon-green/50 pb-3 flex items-center shadow-[0_2px_10px_rgba(0,255,0,0.2)]">
                        <span className="mr-3 text-3xl">⚡</span> QUICK FIXES
                    </h3>
                    {fix_it ? (
                        <ul className="space-y-4">
                            {fix_it.map((fix, idx) => (
                                <motion.li key={idx} className="text-gray-300 font-mono text-sm flex items-start group">
                                    <span className="text-neon-green mr-3 mt-1 font-bold group-hover:translate-x-1 transition-transform">+</span>
                                    <span className="group-hover:text-white transition-colors">{fix}</span>
                                </motion.li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm font-mono">Upgrade to see fixes.</p>
                    )}
                </motion.div>
            </div>

            {/* PREMIUM SECTION: God Mode 2.0 or Legacy */}
            {isPremium ? (
                <div className="border-t border-gray-800 pt-10">
                    <GodModeResults data={data} theme={theme} />
                </div>
            ) : (
                /* BLURRED PREMIUM PREVIEW */
                <motion.div
                    variants={itemVariants}
                    className="relative border-t border-gray-800 pt-10 overflow-hidden rounded-lg mt-8"
                >
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                        <p className="text-neon-pink font-bold text-lg mb-4 text-center max-w-md px-4">
                            {premium_teaser || "I found critical errors that are costing you interviews."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md z-30">
                            <button
                                onClick={onUnlock}
                                className="px-8 py-3 bg-neon-pink text-black font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-300"
                            >
                                Unlock God Mode
                            </button>
                        </div>
                    </div>

                    {/* Dummy Blurred Content to look like real data */}
                    <div className="filter blur-md opacity-50 select-none pointer-events-none">
                        <div className="bg-purple-900/10 p-6 rounded-lg mb-8 h-32"></div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-blue-900/10 p-6 rounded-lg h-40"></div>
                            <div className="bg-pink-900/10 p-6 rounded-lg h-40"></div>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="mt-12 text-center border-t border-gray-800 pt-8">
                <p className="text-xs text-gray-500 uppercase tracking-[0.3em] animate-pulse">
                    System Status: {isPremium ? "GoD MODE ACTIVE" : "LIMITED ACCESS"} // Reality Check: Delivered
                </p>
            </div>
        </motion.div>
    );
};

export default RoastResult;
