import React from 'react';
import { motion } from 'framer-motion';

const UploadZone = ({ onFileSelect, isLoading, theme = 'cyberpunk' }) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const isPro = theme === 'professional';

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const styles = {
        container: isPro
            ? `relative w-full max-w-2xl p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`
            : `relative w-full max-w-2xl p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-500 group overflow-hidden ${isDragging ? 'border-neon-pink bg-pink-900/20 shadow-[0_0_50px_rgba(255,0,255,0.4)] scale-[1.02]' : 'border-cyan-800/50 hover:border-neon-cyan hover:bg-cyan-900/10 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]'}`,
        icon: isPro
            ? `text-7xl transition-all duration-300 ${isDragging ? 'scale-110' : 'text-gray-400 group-hover:text-gray-600'}`
            : `text-7xl transition-all duration-300 filter drop-shadow-lg ${isDragging ? 'text-neon-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]' : 'text-cyan-500 group-hover:text-neon-cyan'}`,
        heading: isPro
            ? `text-3xl font-bold tracking-tight transition-colors duration-300 ${isDragging ? 'text-black' : 'text-gray-700'}`
            : `text-3xl font-bold font-mono tracking-widest transition-colors duration-300 ${isDragging ? 'text-white' : 'text-gray-200'}`,
        text: isPro
            ? "text-gray-500 text-sm max-w-md mx-auto leading-relaxed"
            : "text-gray-400 font-mono text-sm max-w-md mx-auto leading-relaxed"
    };

    return (
        <motion.div
            className={`${styles.container} ${isLoading ? 'opacity-50 pointer-events-none grayscale' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                onChange={handleChange}
                accept="application/pdf"
                disabled={isLoading}
            />

            {/* Glowing Corner Accents (Cyberpunk Only) */}
            {!isPro && (
                <>
                    <div className={`absolute top-0 left-0 w-16 h-16 border-t-[4px] border-l-[4px] transition-colors duration-300 ${isDragging ? 'border-neon-pink' : 'border-neon-cyan'} rounded-tl-xl`}></div>
                    <div className={`absolute top-0 right-0 w-16 h-16 border-t-[4px] border-r-[4px] transition-colors duration-300 ${isDragging ? 'border-neon-pink' : 'border-neon-cyan'} rounded-tr-xl`}></div>
                    <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-[4px] border-l-[4px] transition-colors duration-300 ${isDragging ? 'border-neon-pink' : 'border-neon-cyan'} rounded-bl-xl`}></div>
                    <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-[4px] border-r-[4px] transition-colors duration-300 ${isDragging ? 'border-neon-pink' : 'border-neon-cyan'} rounded-br-xl`}></div>
                </>
            )}

            <div className="text-center space-y-6 relative z-10">
                <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={styles.icon}
                >
                    📂
                </motion.div>

                <div>
                    <h3 className={styles.heading}>
                        {isPro
                            ? (isDragging ? "Drop Resume PDF" : "Upload Resume")
                            : (isDragging ? "DROP DATA PACKET" : "INITIATE UPLOAD")
                        }
                    </h3>
                    {!isPro && <div className="h-1 w-24 mx-auto mt-2 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>}
                </div>

                <p className={styles.text}>
                    {isPro ? (
                        <>Drag & drop your <span className="font-semibold text-black">resume.pdf</span> here to begin.</>
                    ) : (
                        <>
                            Drag & drop your <span className="text-neon-pink">resume.pdf</span> here to begin the roasting sequence.
                            <br />
                            <span className="text-xs text-neon-green/80 mt-2 block tracking-wider">[ SECURE CONNECTION ESTABLISHED ]</span>
                        </>
                    )}
                </p>
            </div>
        </motion.div>
    );
};

export default UploadZone;
