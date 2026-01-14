import React, { useState, useEffect } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, Users, DollarSign, Activity } from 'lucide-react';
import ActivityLog from '../components/ActivityLog';
import PricingControl from '../components/Admin/PricingControl';
import { API_BASE_URL } from '../config';

const ADMIN_EMAIL = 'singhahasas94@gmail.com'; // TODO: Change to real email

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false); // Changed to false initially
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // Track which user is being updated

    useEffect(() => {
        if (!user) return;

        if (user.email !== ADMIN_EMAIL) {
            setError('ACCESS DENIED: Insufficient Clearance Level');
            return;
        }

        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { 'x-admin-email': user.email },
                    withCredentials: true
                });
                setStats(res.data.stats);
                setUsers(res.data.users);
                setError(null);
            } catch (err) {
                console.error(err);
                setError('Connection Terminated: verification failed.');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [user]);

    // If not logged in, show Login Screen instead of redirecting
    if (!user) {
        return (
            <div className="min-h-screen bg-black text-neon-green font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 z-0 bg-cyber-grid bg-[length:30px_30px] opacity-10 pointer-events-none"></div>

                <div className="z-10 bg-black/80 border border-neon-green p-8 rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.2)] max-w-md w-full text-center">
                    <Shield className="w-16 h-16 mx-auto mb-6 text-neon-green animate-pulse" />
                    <h1 className="text-2xl font-black italic mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-600">
                        CLASSIFIED ACCESS
                    </h1>
                    <p className="text-xs text-gray-500 mb-8 tracking-widest uppercase">
                        Administrative Clearance Required
                    </p>

                    <a
                        href={`${API_BASE_URL}/auth/google?redirect=/admin`}
                        className="block w-full py-3 px-4 bg-neon-green/10 border border-neon-green text-neon-green font-bold hover:bg-neon-green hover:text-black transition-all uppercase tracking-wider mt-8"
                    >
                        Authenticate with Google
                    </a>
                </div>
            </div>
        );
    }



    // Generic Action Handler (Premium or Ban)
    const handleUserAction = async (targetEmail, action, currentStatus) => {
        try {
            setActionLoading(targetEmail);
            await axios.post(`${API_BASE_URL}/api/admin/upgrade`, {
                targetEmail,
                action, // 'premium' or 'ban'
                status: !currentStatus // Toggle logic
            }, {
                headers: { 'x-admin-email': user.email },
                withCredentials: true
            });

            // Optimistic Update
            setUsers(users.map(u => {
                if (u.email !== targetEmail) return u;
                if (action === 'ban') return { ...u, isBanned: !currentStatus };
                if (action === 'premium') return { ...u, isPremium: !currentStatus };
                return u;
            }));

        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || 'Command Failed';
            const details = err.response?.data?.details ? JSON.stringify(err.response.data.details) : '';
            alert(`${msg}\n${details}`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="text-neon-cyan text-center mt-20 font-mono animate-pulse">ESTABLISHING SECURE CONNECTION...</div>;
    if (error) return <div className="text-red-500 text-center mt-20 font-bold font-mono">{error}</div>;

    return (
        <div className="min-h-screen bg-black text-neon-green font-mono p-8 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            <header className="relative z-10 flex justify-between items-center mb-12 border-b border-neon-green/30 pb-4">
                <h1 className="text-3xl font-black italic flex items-center gap-3">
                    <Shield className="w-8 h-8" />
                    ADMIN COMMAND CENTER
                </h1>
                <div className="text-xs border border-neon-green px-2 py-1 rounded">
                    OPERATOR: {user.email}
                </div>
            </header>

            {/* HUD / Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black/80 border border-neon-green p-6 rounded shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                        <Activity className="w-4 h-4" /> TOTAL ROASTS
                    </div>
                    <div className="text-4xl font-bold">{stats?.total_roasts || 0}</div>
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/80 border border-neon-green p-6 rounded shadow-[0_0_15px_rgba(0,255,0,0.2)]"
                >
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm">
                        <Users className="w-4 h-4" /> TOTAL USERS
                    </div>
                    <div className="text-4xl font-bold text-neon-cyan">{users.length}</div> {/* Approx recent count */}
                </motion.div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-black/80 border border-red-500/50 p-6 rounded shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                >
                    <div className="flex items-center gap-2 mb-2 text-red-400 text-sm">
                        <DollarSign className="w-4 h-4" /> EST. API COST
                    </div>
                    <div className="text-4xl font-bold text-red-500">${stats?.estimated_cost || "0.00"}</div>
                </motion.div>
            </div>

            {/* CONTROL SYSTEMS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 relative z-10">
                <PricingControl user={user} />
                {/* Future Controls (Feature Flags, etc) */}
            </div>

            {/* User Matrix */}
            <div className="relative z-10 bg-black/90 border border-neon-green/30 rounded-lg overflow-hidden mb-8">
                <div className="bg-neon-green/10 p-4 border-b border-neon-green/30 flex justify-between items-center">
                    <h2 className="text-xl font-bold">USER MATRIX [RECENT 50]</h2>
                    <div className="text-xs text-gray-500 animate-pulse">LIVE DATA FEED</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 border-b border-gray-800">
                            <tr>
                                <th className="p-4 font-normal">USER</th>
                                <th className="p-4 font-normal">ROASTS</th>
                                <th className="p-4 font-normal text-center">STATUS</th>
                                <th className="p-4 font-normal text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-900">
                            {users.map(u => (
                                <tr key={u.id} className={`hover:bg-neon-green/5 transition-colors ${u.isBanned ? 'grayscale opacity-50 bg-red-900/10' : ''}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.photo || "https://ui-avatars.com/api/?name=User"} className="w-8 h-8 rounded-full grayscale" alt="" />
                                            <div>
                                                <div className="font-bold flex items-center gap-2">
                                                    {u.displayName}
                                                    {u.isBanned && <span className="text-[10px] bg-red-500 text-black px-1 rounded font-bold">BANNED</span>}
                                                </div>
                                                <div className="text-xs text-gray-500">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono">{u.roastCount || 0}</td>
                                    <td className="p-4 text-center">
                                        {u.isPremium ? (
                                            <span className="text-neon-cyan text-xs border border-neon-cyan px-1 rounded shadow-[0_0_5px_cyan]">GOD MODE</span>
                                        ) : (
                                            <span className="text-gray-600 text-xs">MORTAL</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {/* GOD MODE TOGGLE */}
                                        <button
                                            disabled={actionLoading === u.email}
                                            onClick={() => handleUserAction(u.email, 'premium', u.isPremium)}
                                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${u.isPremium
                                                ? 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black'
                                                : 'border-gray-500 text-gray-500 hover:border-neon-cyan hover:text-neon-cyan'
                                                }`}
                                        >
                                            {u.isPremium ? 'REVOKE GOD' : 'GRANT GOD'}
                                        </button>

                                        {/* BAN HAMMER */}
                                        <button
                                            disabled={actionLoading === u.email}
                                            onClick={() => handleUserAction(u.email, 'ban', u.isBanned)}
                                            className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${u.isBanned
                                                ? 'border-red-500 bg-red-500 text-black hover:bg-transparent hover:text-red-500'
                                                : 'border-red-900 text-red-900 hover:border-red-500 hover:text-red-500'
                                                }`}
                                        >
                                            {u.isBanned ? 'UNBAN' : 'BAN'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODULE 1: THE MATRIX LIVE LOGS */}
            <ActivityLog user={user} />

        </div>
    );
};

export default AdminDashboard;
