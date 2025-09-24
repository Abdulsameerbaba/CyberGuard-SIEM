import React, { useState, useEffect } from 'react';
import { AnalysisResult, AutomatedAction } from '../types';
import { analyzeFile, analyzeFileHash } from '../services/geminiService';
import { Spinner, LightningBoltIcon } from '../components/icons';
import { threats as threatTemplates } from '../data/threats';


const LiveThreatsFeed = () => {
    const [liveThreats, setLiveThreats] = useState<any[]>([]);
    const [severityFilter, setSeverityFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const threatTypes = [...new Set(threatTemplates.map(t => t.type))].sort();

    useEffect(() => {
        const interval = setInterval(() => {
            const newThreat = { ...threatTemplates[Math.floor(Math.random() * threatTemplates.length)], time: new Date().toLocaleTimeString() };
            setLiveThreats(prev => [newThreat, ...prev.slice(0, 19)]);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const severityColor = (severity: string) => {
        switch(severity) {
            case 'Critical': return 'text-red-400';
            case 'High': return 'text-orange-400';
            case 'Medium': return 'text-yellow-400';
            case 'Low': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    }

    const filteredThreats = liveThreats.filter(threat => {
        const severityMatch = severityFilter === 'All' || threat.severity === severityFilter;
        const typeMatch = typeFilter === 'All' || threat.type === typeFilter;
        return severityMatch && typeMatch;
    });

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Live Cyber Threat Feed</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <label htmlFor="severity-filter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Severity</label>
                    <select 
                        id="severity-filter" 
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                    >
                        <option value="All">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Threat Type</label>
                    <select 
                        id="type-filter" 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 text-gray-200"
                    >
                        <option value="All">All Types</option>
                        {threatTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 h-80 sm:h-auto">
                <ul className="space-y-3">
                    {filteredThreats.length > 0 ? filteredThreats.map((threat, index) => (
                        <li key={index} className="bg-gray-900/70 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-300">{threat.type} Attack</p>
                                <span className={`font-bold ${severityColor(threat.severity)}`}>{threat.severity}</span>
                            </div>
                            <p className="text-sm text-gray-400">Target: {threat.target} | Region: {threat.region}</p>
                            <p className="text-xs text-gray-500 text-right">{threat.time}</p>
                        </li>
                    )) : (
                        <div className="text-center text-gray-500 py-10">
                            <p>No threats match the current filters.</p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

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

const ThreatScanner: React.FC<{ onThreatDetected: (threat: { trigger: string; riskLevel: 'High' | 'Critical' }) => void }> = ({ onThreatDetected }) => {
    const [scanMode, setScanMode] = useState<'file' | 'hash'>('file');
    
    // File state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [fileResult, setFileResult] = useState<AnalysisResult | null>(null);

    // Hash state
    const [fileHash, setFileHash] = useState('');
    const [isHashLoading, setIsHashLoading] = useState(false);
    const [hashResult, setHashResult] = useState<AnalysisResult | null>(null);

    // Alert state
    const [alert, setAlert] = useState<{message: string; level: 'High' | 'Critical'} | null>(null);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setFileResult(null);
            setAlert(null);
        }
    };

    const handleFileScan = async () => {
        if (!selectedFile) return;
        setIsFileLoading(true);
        setFileResult(null);
        setAlert(null);
        const analysisResult = await analyzeFile(selectedFile.name);
        setFileResult(analysisResult);
        if (analysisResult.riskLevel === 'Critical' || analysisResult.riskLevel === 'High') {
            setAlert({ 
                message: `High-risk file detected: ${selectedFile.name}. Automated response protocols initiated.`,
                level: analysisResult.riskLevel 
            });
            onThreatDetected({ trigger: selectedFile.name, riskLevel: analysisResult.riskLevel });
        }
        setIsFileLoading(false);
    };

    const handleHashScan = async () => {
        if (!fileHash) return;
        setIsHashLoading(true);
        setHashResult(null);
        setAlert(null);
        const analysisResult = await analyzeFileHash(fileHash);
        setHashResult(analysisResult);
        if (analysisResult.riskLevel === 'Critical' || analysisResult.riskLevel === 'High') {
            setAlert({ 
                message: `Malicious hash detected. Automated blocking and response protocols initiated.`,
                level: analysisResult.riskLevel 
            });
            onThreatDetected({ trigger: fileHash, riskLevel: analysisResult.riskLevel });
        }
        setIsHashLoading(false);
    };

    const renderResult = (result: AnalysisResult | null) => result && (
        <div className="mt-4 p-4 rounded-md bg-gray-900/70 space-y-3">
           <div className="flex items-center gap-4">
               <h4 className="font-semibold text-lg text-gray-200">Scan Report</h4>
               <RiskIndicator level={result.riskLevel} />
           </div>
           <div>
               <h5 className="font-semibold text-gray-300">Summary:</h5>
               <p className="text-gray-400">{result.summary}</p>
           </div>
       </div>
   );

    return (
         <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-200 mb-2">Threat Scanner</h3>
            <p className="text-gray-400 mb-4">Scan files or hashes for potential security risks.</p>

            {alert && (
                 <div className={`p-4 mb-4 rounded-lg border-l-4 ${alert.level === 'Critical' ? 'bg-red-900/50 border-red-500' : 'bg-orange-900/50 border-orange-500'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                             <svg className={`h-5 w-5 ${alert.level === 'Critical' ? 'text-red-400' : 'text-orange-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm ${alert.level === 'Critical' ? 'text-red-300' : 'text-orange-300'}`}>{alert.message}</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex border-b border-gray-600 mb-4">
                <button onClick={() => setScanMode('file')} className={`px-4 py-2 text-sm font-medium ${scanMode === 'file' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Scan File</button>
                <button onClick={() => setScanMode('hash')} className={`px-4 py-2 text-sm font-medium ${scanMode === 'hash' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Scan Hash</button>
            </div>
            
            {scanMode === 'file' && (
                <div>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-lg">
                        <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                            Choose File
                        </label>
                        {selectedFile && <p className="mt-4 text-gray-300">Selected: {selectedFile.name}</p>}
                    </div>
                    <button onClick={handleFileScan} disabled={!selectedFile || isFileLoading} className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center">
                        {isFileLoading ? <Spinner /> : 'Scan File'}
                    </button>
                    {renderResult(fileResult)}
                </div>
            )}

            {scanMode === 'hash' && (
                <div>
                    <div className="flex gap-2">
                         <input type="text" value={fileHash} onChange={e => setFileHash(e.target.value)} placeholder="Enter MD5, SHA256, etc." className="flex-grow bg-gray-900 border border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"/>
                        <button onClick={handleHashScan} disabled={!fileHash || isHashLoading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center justify-center">
                            {isHashLoading ? <Spinner/> : 'Scan'}
                        </button>
                    </div>
                     {renderResult(hashResult)}
                </div>
            )}
        </div>
    );
};

const AutomatedResponseLog: React.FC<{ actions: AutomatedAction[] }> = ({ actions }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg lg:col-span-2">
        <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
            <LightningBoltIcon className="h-6 w-6 mr-3 text-yellow-400"/>
            Automated Response Log
        </h3>
        <div className="overflow-y-auto pr-2 h-64">
            {actions.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No automated actions logged yet.</p>
                    <p className="text-sm">High-risk threats detected by the scanner will be logged here.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {actions.map(action => (
                        <li key={action.id} className="bg-gray-900/70 p-3 rounded-md text-sm animate-fade-in-down">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-gray-300">{action.action}</p>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${action.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{action.status}</span>
                            </div>
                            <p className="text-gray-400 mt-1">Trigger: <span className="font-mono bg-gray-700/50 px-1 py-0.5 rounded text-xs">{action.trigger}</span></p>
                            <p className="text-xs text-gray-500 text-right mt-1">{action.timestamp}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
);

export const ThreatIntelligence = () => {
    const [automatedActions, setAutomatedActions] = useState<AutomatedAction[]>([]);

    const handleThreatDetected = (threat: { trigger: string; riskLevel: 'High' | 'Critical' }) => {
        const newAction: AutomatedAction = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            action: `Threat associated with '${threat.trigger}' automatically blocked.`,
            trigger: threat.riskLevel === 'Critical' ? 'Critical Threat Detection' : 'High-Risk Anomaly',
            status: 'Completed'
        };
        setAutomatedActions(prev => [newAction, ...prev.slice(0, 9)]);
    };

    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-white">Threat Intelligence Center</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LiveThreatsFeed />
                <ThreatScanner onThreatDetected={handleThreatDetected} />
                <AutomatedResponseLog actions={automatedActions} />
            </div>
        </div>
    );
};