import { API_BASE_URL } from '../config';

const LoginButton = ({ theme = 'cyberpunk' }) => {
    const handleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const isPro = theme === 'professional';

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className={`group relative px-8 py-3 font-mono uppercase tracking-widest overflow-hidden transition-all duration-300 ${isPro
                ? 'bg-black text-white border border-black hover:bg-gray-800 hover:shadow-lg rounded-lg'
                : 'bg-black border border-neon-cyan text-neon-cyan hover:text-black hover:shadow-[0_0_20px_var(--neon-cyan)]'
                }`}
        >
            <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Identity Login
            </span>

            {!isPro && (
                <>
                    <div className="absolute inset-0 bg-neon-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                    {/* Glitch effects */}
                    <div className="absolute top-0 right-0 w-2 h-2 bg-neon-pink opacity-0 group-hover:opacity-100 animate-ping"></div>
                </>
            )}
        </motion.button>
    );
};

export default LoginButton;
