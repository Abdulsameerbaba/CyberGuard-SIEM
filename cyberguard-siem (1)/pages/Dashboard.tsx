import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { CloseIcon } from '../components/icons';
import { eventsData, anomalyData, threatCategoryData } from '../data/dashboard';
import { initialAlerts } from '../data/alerts';

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">{title}</h3>
        <div className="h-64">{children}</div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; change: string; isIncreaseBad?: boolean }> = ({ title, value, change, isIncreaseBad = true }) => {
    const isPositive = change.startsWith('+');
    const colorClass = isPositive ? (isIncreaseBad ? 'text-red-400' : 'text-green-400') : (isIncreaseBad ? 'text-green-400' : 'text-red-400');
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className={`text-sm ${colorClass}`}>{change} vs last week</p>
        </div>
    );
};

export type Alert = {
    id: number;
    severity: 'Critical' | 'High';
    message: string;
    isNew: boolean;
};

const AlertItem: React.FC<{ alert: Alert; onDismiss: () => void; }> = ({ alert, onDismiss }) => {
    const severityStyles = {
        Critical: { base: 'bg-red-900/30', text: 'text-red-400', pulse: 'animate-pulse-red' },
        High: { base: 'bg-yellow-900/30', text: 'text-yellow-400', pulse: '' },
    };
    const styles = severityStyles[alert.severity];

    return (
        <li className={`flex items-center justify-between p-3 rounded-md transition-all duration-300 ${styles.base} ${alert.isNew ? styles.pulse : ''}`}>
            <div className="flex items-center overflow-hidden">
                <span className={`${styles.text} font-bold mr-3 flex-shrink-0`}>[{alert.severity.toUpperCase()}]</span>
                <span className="text-gray-300 text-sm truncate">{alert.message}</span>
            </div>
            <button onClick={onDismiss} className="ml-2 text-gray-500 hover:text-white transition-colors flex-shrink-0">
                <CloseIcon className="h-4 w-4" />
            </button>
        </li>
    );
};

export const Dashboard = () => {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

    useEffect(() => {
        const interval = setInterval(() => {
            const newAlert: Alert = {
                id: Date.now(),
                severity: 'Critical',
                message: `Unauthorized access attempt from geo-location: St. Petersburg`,
                isNew: true,
            };
            setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);

            // Remove the 'new' status after the animation completes
            setTimeout(() => {
                setAlerts(prev => prev.map(a => a.id === newAlert.id ? { ...a, isNew: false } : a));
            }, 3000); 

        }, 10000); // New alert every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const dismissAlert = (id: number) => {
        setAlerts(alerts.filter(a => a.id !== id));
    };

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-white">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Critical Alerts" value="12" change="+15%" isIncreaseBad={true}/>
                <StatCard title="Total Events Analyzed" value="2.1M" change="+5.2%" isIncreaseBad={false}/>
                <StatCard title="Network Anomalies" value="87" change="-8.1%" isIncreaseBad={true}/>
                <StatCard title="System Health" value="99.8%" change="+0.1%" isIncreaseBad={false}/>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <ChartCard title="Security Events & Alerts">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={eventsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Legend />
                            <Line type="monotone" dataKey="events" stroke="#4299E1" strokeWidth={2} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="alerts" stroke="#F56565" strokeWidth={2}/>
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Anomaly Detection (24h)">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={anomalyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F6E05E" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#F6E05E" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/>
                            <XAxis dataKey="name" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Area type="monotone" dataKey="anomalies" stroke="#F6E05E" fill="url(#colorAnomalies)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                 <ChartCard title="Threat Categories">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={threatCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis type="number" stroke="#A0AEC0"/>
                            <YAxis dataKey="name" type="category" stroke="#A0AEC0" width={80} />
                            <Bar dataKey="count" fill="#ED8936" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">Recent Critical Alerts</h3>
                    <ul className="space-y-3">
                        {alerts.length > 0 ? (
                            alerts.map(alert => (
                                <AlertItem key={alert.id} alert={alert} onDismiss={() => dismissAlert(alert.id)} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent alerts.</p>
                        )}
                    </ul>
                </div>

            </div>
        </div>
    );
};