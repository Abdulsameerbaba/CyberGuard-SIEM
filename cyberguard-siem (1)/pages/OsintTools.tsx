
import React, { useState } from 'react';
import { AnalysisResult, PasswordStrengthResult } from '../types';
import { analyzePassword, analyzeUrl } from '../services/geminiService';
import { Spinner } from '../components/icons';

const ToolCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="space-y-4">{children}</div>
    </div>
);

const RiskIndicator: React.FC<{ level: AnalysisResult['riskLevel'] }> = ({ level }) => {
    const levelColors = {
        'Low': 'bg-green-500', 'Safe': 'bg-green-500', 'Medium': 'bg-yellow-500', 'High': 'bg-orange-500',
        'Critical': 'bg-red-500', 'Unknown': 'bg-gray-500',
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${levelColors[level] || 'bg-gray-600'}`}>
            {level}
        </span>
    );
};

const PasswordStrengthMeter: React.FC<{ score: number }> = ({ score }) => {
    const getStrength = () => {
        if (score > 80) return { text: 'Very Strong', color: 'bg-green-500', width: '100%' };
        if (score > 60) return { text: 'Strong', color: 'bg-teal-500', width: '80%' };
        if (score > 40) return { text: 'Moderate', color: 'bg-yellow-500', width: '60%' };
        if (score > 20) return { text: 'Weak', color: 'bg-orange-500', width: '40%' };
        return { text: 'Very Weak', color: 'bg-red-500', width: '20%' };
    };

    const { text, color, width } = getStrength();

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-gray-300">{text}</span>
                <span className="text-sm font-medium text-gray-300">{score}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full transition-all duration-500`} style={{ width }}></div>
            </div>
        </div>
    );
};

export const OsintTools = () => {
    const [password, setPassword] = useState('');
    const [passwordResult, setPasswordResult] = useState<PasswordStrengthResult | null>(null);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const [url, setUrl] = useState('');
    const [urlResult, setUrlResult] = useState<AnalysisResult | null>(null);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    
    const [leakQuery, setLeakQuery] = useState('');
    const [isLeakLoading, setIsLeakLoading] = useState(false);
    const [leakResult, setLeakResult] = useState<string | null>(null);

    const handlePasswordCheck = async () => {
        if (!password) return;
        setIsPasswordLoading(true);
        setPasswordResult(null);
        const result = await analyzePassword(password);
        setPasswordResult(result);
        setIsPasswordLoading(false);
    };
    
    const handleUrlCheck = async () => {
        if (!url) return;
        setIsUrlLoading(true);
        setUrlResult(null);
        const result = await analyzeUrl(url);
        setUrlResult(result);
        setIsUrlLoading(false);
    };
    
    const handleLeakCheck = () => {
        if (!leakQuery) return;
        setIsLeakLoading(true);
        setLeakResult(null);
        setTimeout(() => { // Simulate API call
            const hasLeak = Math.random() > 0.5;
            if (hasLeak) {
                setLeakResult(`Potential leak found for "${leakQuery}" on a dark web marketplace. Immediate password change recommended for associated accounts.`);
            } else {
                setLeakResult(`No leaks found for "${leakQuery}" in our database.`);
            }
            setIsLeakLoading(false);
        }, 1500);
    };

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-white">OSINT Research Tools</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <ToolCard title="Email/Phone Leak Checker" description="Check if an email or phone number has been compromised in a data breach.">
                    <div className="flex gap-2">
                        <input type="text" value={leakQuery} onChange={e => setLeakQuery(e.target.value)} placeholder="Enter email or phone number" className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <button onClick={handleLeakCheck} disabled={isLeakLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center">
                            {isLeakLoading ? <Spinner/> : 'Check'}
                        </button>
                    </div>
                    {leakResult && (
                        <div className={`p-4 rounded-md ${leakResult.startsWith('No leaks') ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                            <p className={`${leakResult.startsWith('No leaks') ? 'text-green-300' : 'text-red-300'}`}>{leakResult}</p>
                        </div>
                    )}
                </ToolCard>
                
                <ToolCard title="Password Strength Analyzer" description="Evaluate the strength of your password against common attack vectors.">
                    <div className="flex gap-2">
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter a password" className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <button onClick={handlePasswordCheck} disabled={isPasswordLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center">
                            {isPasswordLoading ? <Spinner/> : 'Analyze'}
                        </button>
                    </div>
                    {passwordResult && (
                        <div className="space-y-4 pt-4">
                            <PasswordStrengthMeter score={passwordResult.score} />
                            <div className="p-4 rounded-md bg-gray-900/70">
                                <p className="text-gray-300">{passwordResult.explanation}</p>
                                {passwordResult.suggestions.length > 0 && <h4 className="font-semibold mt-3 mb-1 text-gray-200">Suggestions:</h4>}
                                <ul className="list-disc list-inside text-gray-400 space-y-1">
                                    {passwordResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </ToolCard>

                <div className="lg:col-span-2">
                  <ToolCard title="Web Detective & QR Security" description="Analyze a URL from text or a QR code for potential threats before you visit.">
                      <div className="flex gap-2">
                          <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter a URL to investigate" className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                          <button onClick={handleUrlCheck} disabled={isUrlLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center">
                            {isUrlLoading ? <Spinner/> : 'Investigate'}
                          </button>
                      </div>
                      <div className="text-center text-gray-500">
                          <p>--- OR ---</p>
                          <label htmlFor="qr-upload" className="mt-2 cursor-pointer inline-block bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors">
                              Upload QR Code Image
                          </label>
                          <input id="qr-upload" type="file" accept="image/*" className="hidden" />
                          <p className="text-xs mt-1">(QR code scanning is a mock-up feature)</p>
                      </div>
                      {urlResult && (
                          <div className="p-4 rounded-md bg-gray-900/70 space-y-3">
                              <div className="flex items-center gap-4">
                                  <h4 className="font-semibold text-lg text-gray-200">Analysis Report</h4>
                                  <RiskIndicator level={urlResult.riskLevel} />
                              </div>
                              <div>
                                  <h5 className="font-semibold text-gray-300">Summary:</h5>
                                  <p className="text-gray-400">{urlResult.summary}</p>
                              </div>
                              {urlResult.recommendations && (
                                  <div>
                                      <h5 className="font-semibold text-gray-300">Recommendations:</h5>
                                      <p className="text-gray-400">{urlResult.recommendations}</p>
                                  </div>
                              )}
                          </div>
                      )}
                  </ToolCard>
                </div>
            </div>
        </div>
    );
};
