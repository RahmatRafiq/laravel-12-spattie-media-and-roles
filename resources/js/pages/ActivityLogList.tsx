import { Card } from '@/components/ui/card';
import '@/echo';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
    properties?: {
        old?: Record<string, unknown>;
        attributes?: Record<string, unknown>;
    };
    created_at: string;
}

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface PageProps extends InertiaPageProps {
    initialLogs: ActivityLog[];
}

export default function ActivityLogList() {
    // Ambil data awal dari props Inertia
    const { initialLogs } = usePage<PageProps>().props;
    const [logs, setLogs] = useState<ActivityLog[]>(initialLogs || []);

    useEffect(() => {
        // Subscribe ke channel 'activity-logs' dan listen event 'ActivityLogCreated'
        window.Echo.channel('activity-logs').listen('ActivityLogCreated', (data: ActivityLog) => {
            console.log('Received event:', data);
            setLogs((prev) => [data, ...prev]);
        });

        return () => {
            window.Echo.leave('activity-logs');
        };
    }, []);

    const renderProperties = (properties: ActivityLog['properties']) => {
        if (!properties || !properties.old || !properties.attributes) return null;
        return (
            <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3">
                <strong className="mb-1 block text-gray-700">Perubahan:</strong>
                <ul className="ml-5 list-disc text-sm text-gray-600">
                    {Object.keys(properties.attributes).map((key) => (
                        <li key={key}>
                            {key}: <span className="text-red-500 line-through">{properties.old![key]?.toString()}</span> →{' '}
                            <span className="text-green-600">{properties.attributes![key]?.toString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Activity Logs', href: '/dashboard/activity-logs' }]}>
            <Head title="Live Activity Logs" />
            <div className="px-4 py-6">
                <h1 className="mb-6 text-2xl font-bold">Live Activity Logs</h1>
                {logs.length === 0 ? (
                    <p className="text-gray-500">Tidak ada log saat ini.</p>
                ) : (
                    logs.map((log) => (
                        <Card key={log.id} className="mb-4 rounded-lg border border-gray-200 p-4 shadow-sm">
                            <div className="mb-2">
                                <p className="text-lg font-medium text-gray-800">{log.description}</p>
                                <p className="text-sm text-gray-500">[{log.event}]</p>
                            </div>
                            <div className="mb-2 text-xs text-gray-500">
                                {log.subject_type} by <span className="font-semibold">{log.causer_type}</span> #{log.causer_id} on{' '}
                                {new Date(log.created_at).toLocaleString()}
                            </div>
                            {renderProperties(log.properties)}
                        </Card>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
