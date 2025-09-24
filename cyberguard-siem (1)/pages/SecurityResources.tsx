
import React from 'react';

const ResourceCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">{title}</h3>
        <div className="space-y-3 text-gray-400">{children}</div>
    </div>
);

const ChecklistItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start">
        <svg className="h-5 w-5 mr-2 text-green-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{children}</span>
    </div>
);


export const SecurityResources = () => {
    return (
        <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-white">Security Resources & Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                <ResourceCard title="WiFi Security">
                    <ChecklistItem>Use WPA3 encryption if available, otherwise WPA2.</ChecklistItem>
                    <ChecklistItem>Change the default router admin password immediately.</ChecklistItem>
                    <ChecklistItem>Disable WPS (Wi-Fi Protected Setup) as it's vulnerable.</ChecklistItem>
                    <ChecklistItem>Use a strong, unique password for your WiFi network.</ChecklistItem>
                    <ChecklistItem>Keep your router's firmware updated.</ChecklistItem>
                    <ChecklistItem>Avoid using public WiFi for sensitive transactions.</ChecklistItem>
                </ResourceCard>

                <ResourceCard title="Web & Browser Security">
                    <ChecklistItem>Keep your browser and extensions up to date.</ChecklistItem>
                    <ChecklistItem>Use a reputable ad-blocker and anti-tracking extension.</ChecklistItem>
                    <ChecklistItem>Be cautious of phishing emails and suspicious links.</ChecklistItem>
                    <ChecklistItem>Enable multi-factor authentication (MFA) on all important accounts.</ChecklistItem>
                    <ChecklistItem>Regularly clear your browser cache and cookies.</ChecklistItem>
                </ResourceCard>
                
                <ResourceCard title="Social Media Security">
                    <ChecklistItem>Review and tighten privacy settings on all platforms.</ChecklistItem>
                    <ChecklistItem>Be mindful of what you share publicly.</ChecklistItem>
                    <ChecklistItem>Do not accept friend/connection requests from unknown individuals.</ChecklistItem>
                    <ChecklistItem>Use a unique, strong password for each social media account.</ChecklistItem>
                    <ChecklistItem>Enable login alerts to be notified of suspicious activity.</ChecklistItem>
                </ResourceCard>

                <div className="md:col-span-2 lg:col-span-3">
                    <ResourceCard title="Cyber Crime Emergency Contacts">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <h4 className="font-semibold text-gray-200 mb-2">National Emergency Numbers</h4>
                                <p><strong>Cyber Crime Helpline (India):</strong> 1930</p>
                                <p><strong>National Women Helpline (India):</strong> 181</p>
                                <p><strong>Police (Emergency):</strong> 112</p>
                           </div>
                           <div>
                                <h4 className="font-semibold text-gray-200 mb-2">Platform Grievance Numbers</h4>
                                <p><strong>WhatsApp Grievance Officer (India):</strong> <a href="#" className="text-blue-400 hover:underline">Contact via Post</a></p>
                                <p><strong>Instagram Grievance Officer (India):</strong> <a href="#" className="text-blue-400 hover:underline">Contact via Help Center</a></p>
                                <p className="text-xs text-gray-500 mt-2">Note: Direct numbers are often not provided; users are directed through official channels.</p>
                           </div>
                        </div>
                    </ResourceCard>
                </div>
            </div>
        </div>
    );
};
