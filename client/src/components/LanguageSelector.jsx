import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
    { code: 'English', label: 'English', flag: '🇺🇸' },
    { code: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
    { code: 'French', label: 'French', flag: '🇫🇷' },
    { code: 'Hinglish', label: 'Hinglish', flag: '🇮🇳/🇺🇸' },
];

const LanguageSelector = ({ selectedLanguage, onSelect, theme = 'cyberpunk' }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const isPro = theme === 'professional';

    const styles = {
        button: isPro
            ? "flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 font-sans text-sm hover:bg-gray-50 hover:text-black transition-colors"
            : "flex items-center gap-2 px-4 py-2 bg-black/60 border border-neon-cyan/50 rounded-lg backdrop-blur-md text-neon-cyan font-mono text-sm hover:bg-neon-cyan/10 transition-colors",
        dropdown: isPro
            ? "absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xl z-50"
            : "absolute right-0 top-full mt-2 w-40 bg-black/90 border border-neon-cyan/30 rounded-lg overflow-hidden backdrop-blur-xl shadow-[0_0_15px_rgba(0,255,255,0.2)] z-50",
        option: (isSelected) => isPro
            ? `w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors font-sans text-sm ${isSelected ? 'text-black font-bold bg-gray-50' : 'text-gray-600'}`
            : `w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neon-cyan/20 transition-colors font-mono text-sm ${isSelected ? 'text-neon-cyan bg-neon-cyan/10' : 'text-gray-300'}`
    };

    return (
        <div className="relative z-50">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={styles.button}
            >
                <span className="text-lg">{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                <span>{selectedLanguage}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={styles.dropdown}
                    >
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    onSelect(lang.code);
                                    setIsOpen(false);
                                }}
                                className={styles.option(selectedLanguage === lang.code)}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSelector;
