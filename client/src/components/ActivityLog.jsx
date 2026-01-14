import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle, CheckCircle, Ban } from 'lucide-react';
import { API_BASE_URL } from '../config';

const ActivityLog = ({ user }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchLogs = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/admin/logs`, {
                    headers: { 'x-admin-email': user.email },
                    withCredentials: true
                });
                setLogs(res.data);
            } catch (err) {
                console.error("Log fetch error", err);
            }
        };

        // Initial fetch
        fetchLogs();

        // Poll every 3 seconds for "Matrix" feel without overloading
        const interval = setInterval(fetchLogs, 3000);
        return () => clearInterval(interval);
    }, [user]);

    const getIcon = (type) => {
        switch (type) {
            case 'ROAST': return <CheckCircle className="w-3 h-3 text-neon-green" />;
            case 'BLOCKED': return <Ban className="w-3 h-3 text-red-500" />;
            case 'ADMIN_ACTION': return <AlertCircle className="w-3 h-3 text-neon-cyan" />;
            default: return <Terminal className="w-3 h-3 text-gray-400" />;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'ROAST': return 'text-neon-green';
            case 'BLOCKED': return 'text-red-500';
            case 'ADMIN_ACTION': return 'text-neon-cyan';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="bg-black/90 border border-neon-green/30 rounded-lg overflow-hidden font-mono mt-8">
            <div className="bg-neon-green/10 p-3 border-b border-neon-green/30 flex justify-between items-center">
                <h3 className="text-sm font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    THE MATRIX [LIVE LOGS]
                </h3>
                <div className="flex gap-2">
                    <span className="w-2 h-2 bg-neon-green rounded-full animate-ping"></span>
                </div>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-neon-green/20 scrollbar-track-black">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-xs flex items-start gap-3 border-b border-gray-900/50 pb-2 ${getColor(log.type)}`}
                        >
                            <span className="opacity-50 min-w-[120px]">
                                {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="mt-0.5">
                                {getIcon(log.type)}
                            </div>
                            <div>
                                <span className="font-bold mr-2">[{log.type}]</span>
                                {log.message}
                                <span className="opacity-40 ml-2">({log.userEmail})</span>
                            </div>
                        </motion.div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-gray-600 text-center py-10 opacity-50">
                            WAITING FOR SIGNALS...
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ActivityLog;
