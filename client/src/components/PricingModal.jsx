import { API_BASE_URL } from '../config';

const PricingModal = ({ isOpen, onClose, theme = 'cyberpunk' }) => {
    const [prices, setPrices] = useState({ day_pass_price: 99, lifetime_pass_price: 999 });

    useEffect(() => {
        if (isOpen) {
            fetchPrices();
        }
    }, [isOpen]);

    const fetchPrices = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/config/pricing`);
            // Ensure we fallback if APIs fail, but try to use fresh data
            if (res.data) {
                setPrices(prev => ({
                    day_pass_price: res.data.day_pass_price || prev.day_pass_price,
                    lifetime_pass_price: res.data.lifetime_pass_price || prev.lifetime_pass_price
                }));
            }
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        }
    };

    if (!isOpen) return null;
    const isPro = theme === 'professional';

    const styles = {
        overlay: "absolute inset-0 backdrop-blur-sm " + (isPro ? "bg-black/20" : "bg-black/80"),
        container: "relative w-full max-w-2xl rounded-xl overflow-hidden " + (isPro ? "bg-white shadow-2xl" : "bg-cyber-black border-2 border-neon-pink shadow-[0_0_50px_rgba(255,0,128,0.3)]"),
        header: "p-6 text-center " + (isPro ? "bg-gray-50 border-b border-gray-200" : "bg-gradient-to-r from-purple-900 to-pink-900 border-b border-neon-pink/30"),
        title: "text-3xl font-black italic tracking-tighter " + (isPro ? "text-gray-900" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"),
        subtitle: "font-mono text-sm mt-2 " + (isPro ? "text-gray-500" : "text-neon-cyan"),
        cardPopular: "rounded-lg p-6 transition-colors cursor-pointer group relative overflow-hidden " + (isPro ? "border border-black bg-white hover:shadow-lg" : "border border-neon-cyan/30 hover:bg-neon-cyan/5"),
        cardStandard: "rounded-lg p-6 transition-colors cursor-pointer group " + (isPro ? "border border-gray-200 hover:bg-gray-50" : "border border-neon-pink/30 hover:bg-neon-pink/5"),
        price: "text-3xl font-black mb-4 " + (isPro ? "text-gray-900" : "text-white"),
        check: isPro ? "text-black font-bold" : "text-neon-green",
        buttonPop: "w-full py-2 font-bold transition-all " + (isPro ? "bg-black text-white hover:bg-gray-800" : "bg-transparent border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black"),
        buttonStd: "w-full py-2 font-bold transition-all " + (isPro ? "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100" : "bg-transparent border border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black"),
        listText: isPro ? "text-gray-600" : "text-gray-400 font-mono"
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={styles.overlay}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={styles.container}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            UNLOCK GOD MODE
                        </h2>
                        <p className={styles.subtitle}>
                            STOP BEING MEDIOCRE. GET THE FULL ROAST.
                        </p>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-6">

                        {/* 24-Hour Pass */}
                        <div className={styles.cardPopular}>
                            <div className={`absolute top-0 right-0 font-bold text-xs px-2 py-1 ${isPro ? "bg-black text-white" : "bg-neon-cyan text-black"}`}>MOST POPULAR</div>
                            <h3 className={`text-xl font-bold mb-2 ${isPro ? "text-gray-900" : "text-neon-cyan"}`}>24-Hour Pass</h3>
                            <div className={styles.price}>₹{prices.day_pass_price}</div>
                            <ul className={`space-y-2 text-sm mb-6 ${styles.listText}`}>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> Unlimited Roasts</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> ATS Gap Analysis</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> De-Cringe Rewriter</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> Constructive Feedback</li>
                            </ul>
                            <button className={styles.buttonPop}>
                                GET ACCESS
                            </button>
                        </div>

                        {/* Lifetime */}
                        <div className={styles.cardStandard}>
                            <h3 className={`text-xl font-bold mb-2 ${isPro ? "text-gray-900" : "text-neon-pink"}`}>Lifetime Unlock</h3>
                            <div className={styles.price}>₹{prices.lifetime_pass_price}</div>
                            <ul className={`space-y-2 text-sm mb-6 ${styles.listText}`}>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> Own it Forever</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> Valid Updates</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> Support the Roast</li>
                                <li className="flex items-center gap-2"><span className={styles.check}>✓</span> God Mode Enabled</li>
                            </ul>
                            <button className={styles.buttonStd}>
                                BUY FOREVER
                            </button>
                        </div>

                    </div>

                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 ${isPro ? "text-gray-400 hover:text-black" : "text-gray-500 hover:text-white"}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PricingModal;
