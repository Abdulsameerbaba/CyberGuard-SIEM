import { Notification } from '../components/DashboardLayout';

export const initialNotifications: Notification[] = [
    { id: 1, type: 'Critical', message: 'Ransomware activity detected on `FS-02`.', timestamp: '2 minutes ago', isRead: false },
    { id: 2, type: 'High', message: 'Multiple failed logins for `admin` from IP 192.168.1.101.', timestamp: '15 minutes ago', isRead: false },
    { id: 3, type: 'System', message: 'Threat intelligence database updated successfully.', timestamp: '1 hour ago', isRead: true },
    { id: 4, type: 'High', message: 'Unusual network traffic to a known malicious domain.', timestamp: '3 hours ago', isRead: true },
    { id: 5, type: 'System', message: 'New firewall rule #772 applied.', timestamp: '5 hours ago', isRead: true },
];
