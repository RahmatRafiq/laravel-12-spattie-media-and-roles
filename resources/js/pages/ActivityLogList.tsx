import { useEffect, useState } from 'react';
import '@/echo'; // pastikan import echo.js kamu
import { Card } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';

declare global {
    interface Window {
        Echo: {
            channel: (channelName: string) => {
                listen: (eventName: string, callback: (data: ActivityLog) => void) => void;
            };
            leave: (channelName: string) => void;
        };
    }
}

interface ActivityLog {
    id: number;
    description: string;
    subject_type: string;
    event: string;
    causer_type: string;
    causer_id: number;
    properties?: Record<string, unknown>;
    created_at: string;
}

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
    initialLogs: ActivityLog[];
}

export default function ActivityLogList() {
    // Ambil initialLogs dari props Inertia
    const { initialLogs } = usePage<PageProps>().props;
    const [logs, setLogs] = useState<ActivityLog[]>(initialLogs || []);

    useEffect(() => {
        // Subscribe ke channel dan listen event
        window.Echo.channel('activity-logs')
            .listen('ActivityLogCreated', (data: ActivityLog) => {
                console.log('Received event:', data);
                setLogs((prev) => [data, ...prev]);
            });

        return () => {
            window.Echo.leave('activity-logs');
        };
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Live Activity Logs</h1>
            {logs.length === 0 && <p>Tidak ada log saat ini.</p>}
            {logs.map((log) => (
                <Card key={log.id} className="p-4">
                    <div>
                        <strong>{log.description}</strong> [{log.event}]
                    </div>
                    <div className="text-xs text-gray-500">
                        {log.subject_type} by {log.causer_type} #{log.causer_id} on {new Date(log.created_at).toLocaleString()}
                    </div>
                </Card>
            ))}
        </div>
    );
}
