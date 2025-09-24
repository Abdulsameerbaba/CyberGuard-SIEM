import { Alert } from '../pages/Dashboard';

export const initialAlerts: Alert[] = [
    { id: 1, severity: 'Critical', message: 'Multiple failed logins for `admin` from IP 192.168.1.101', isNew: false },
    { id: 2, severity: 'Critical', message: 'Potential ransomware activity detected on `FS-02`', isNew: false },
    { id: 3, severity: 'High', message: 'Unusual network traffic to a known malicious domain', isNew: false },
    { id: 4, severity: 'High', message: 'Suspicious process `svchost.exe` started with high privileges', isNew: false },
];
