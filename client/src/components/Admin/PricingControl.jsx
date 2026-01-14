import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Save, RefreshCw, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const PricingControl = ({ user }) => {
    const [prices, setPrices] = useState({
        day_pass_price: 99,
        lifetime_pass_price: 499
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/config/pricing`);
            setPrices(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch prices', error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPrices(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await axios.post(`${API_BASE_URL}/api/admin/pricing`, prices, {
                headers: { 'x-admin-email': user?.email },
                withCredentials: true
            });

            setMessage('PRICES UPDATED SUCCESSFULLY');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Update failed', error);
            setMessage('UPDATE FAILED - CHECK CONSOLE');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-black border border-neon-cyan/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.1)] relative overflow-hidden group">
            {/* Cyberpunk Decor */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-neon-cyan/10 blur-xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-neon-pink/10 blur-xl rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                <DollarSign className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-xl font-mono font-bold text-white tracking-wider">
                    ECONOMIC POLICY
                </h2>
                {loading && <RefreshCw className="w-4 h-4 text-neon-cyan animate-spin ml-auto" />}
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-xs font-mono text-neon-cyan mb-2 tracking-widest uppercase">
                        24-Hour Protocol (₹)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="day_pass_price"
                            value={prices.day_pass_price}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded p-3 text-white font-mono text-lg focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,255,0.3)] transition-all"
                        />
                        <div className="absolute right-3 top-3 text-gray-500 font-mono text-xs">INR</div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-mono text-neon-pink mb-2 tracking-widest uppercase">
                        Lifetime Override (₹)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="lifetime_pass_price"
                            value={prices.lifetime_pass_price}
                            onChange={handleChange}
                            className="w-full bg-black border border-gray-700 rounded p-3 text-white font-mono text-lg focus:border-neon-pink focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,128,0.3)] transition-all"
                        />
                        <div className="absolute right-3 top-3 text-gray-500 font-mono text-xs">INR</div>
                    </div>
                </div>

                {message && (
                    <div className={`text-center font-bold font-mono text-sm tracking-widest py-2 rounded ${message.includes('FAILED') ? 'text-red-500 bg-red-900/20' : 'text-neon-green bg-green-900/20 animate-pulse'}`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-neon-cyan/10 border border-neon-cyan text-neon-cyan py-3 rounded font-bold font-mono hover:bg-neon-cyan hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                    {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'UPDATING...' : 'UPDATE PRICES'}
                </button>
            </form>
        </div>
    );
};

export default PricingControl;
