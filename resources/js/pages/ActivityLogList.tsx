import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import '@/echo';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Activity, Clock, User, Database, Wifi, WifiOff } from 'lucide-react';
import type Echo from 'laravel-echo';

declare global {
    interface Window {
        Echo: Echo;
    }
}

interface ActivityLog {
    id: number;
    description: string;
    subject_type: string | null;
    subject_id?: number | null;
    event: string;
    causer_type: string | null;
    causer_id: number | null;
    causer_name?: string | null;
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

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Activity Logs', href: '/dashboard/activity-logs' }
];

export default function ActivityLogList() {
    const { initialLogs } = usePage<PageProps>().props;
    const [logs, setLogs] = useState<ActivityLog[]>(initialLogs || []);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Echo) {
            try {
                const pusher = window.Echo.connector.pusher;

                pusher.connection.bind('connected', () => {
                    setConnectionStatus('connected');
                });

                pusher.connection.bind('disconnected', () => {
                    setConnectionStatus('disconnected');
                });

                pusher.connection.bind('error', () => {
                    setConnectionStatus('error');
                });

                window.Echo.private('activity-logs').listen('ActivityLogCreated', (data: ActivityLog) => {
                    if (data && data.id && data.description) {
                        setLogs((prev) => [data, ...prev.slice(0, 49)]);
                    }
                });

                return () => {
                    window.Echo.leave('private-activity-logs');
                    pusher.connection.unbind_all();
                };
            } catch (error) {
                console.error('Error setting up Echo listener:', error);
                setConnectionStatus('error');
            }
        }
    }, []);

    useEffect(() => {
        const cleanup = setInterval(() => {
            setLogs(prev => prev.slice(0, 50));
        }, 60000);

        return () => clearInterval(cleanup);
    }, []);

    const getEventColor = (event: string) => {
        switch (event.toLowerCase()) {
            case 'created':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'updated':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'deleted':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const formatSubjectType = (subjectType: string | null) => {
        if (!subjectType) return 'Unknown';
        return subjectType.split('\\').pop() || subjectType;
    };

    const renderProperties = (properties: ActivityLog['properties']) => {
        if (!properties || !properties.old || !properties.attributes) return null;

        return (
            <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Data Changes</span>
                </div>
                <div className="space-y-2">
                    {Object.keys(properties.attributes).map((key) => (
                        <div key={key} className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                            <div className="font-medium text-foreground">{key}</div>
                            <div className="text-destructive line-through">
                                {String(properties.old![key] || '-')}
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                                {String(properties.attributes![key] || '-')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Live Activity Logs" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Live Activity Logs</h1>
                        <p className="text-muted-foreground">
                            Monitor real-time user activities and system changes
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {connectionStatus === 'connected' && (
                            <Badge variant="outline" className="gap-1 border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                                <Wifi className="h-3 w-3" />
                                Live
                            </Badge>
                        )}
                        {connectionStatus === 'connecting' && (
                            <Badge variant="outline" className="gap-1 border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                                <Wifi className="h-3 w-3 animate-pulse" />
                                Connecting
                            </Badge>
                        )}
                        {connectionStatus === 'disconnected' && (
                            <Badge variant="outline" className="gap-1 border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                                <WifiOff className="h-3 w-3" />
                                Disconnected
                            </Badge>
                        )}
                        {connectionStatus === 'error' && (
                            <Badge variant="outline" className="gap-1 border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                                <WifiOff className="h-3 w-3" />
                                Error
                            </Badge>
                        )}
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {logs.length} log{logs.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    {logs.length === 0 ? (
                        <Card className="flex h-64 items-center justify-center">
                            <CardContent className="text-center">
                                <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                <h3 className="mt-4 text-lg font-medium text-foreground">No Activity Logs</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Activity logs will appear here in real-time when users perform actions.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log, index) => (
                                <Card key={log.id} className={`transition-all duration-300 ${index === 0 ? 'ring-2 ring-primary/20' : ''}`}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-base font-medium text-foreground">
                                                    {log.description || 'Unknown activity'}
                                                </CardTitle>
                                                <CardDescription className="mt-1 flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        {log.causer_name || `${formatSubjectType(log.causer_type)} #${log.causer_id || 'N/A'}`}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Database className="h-3 w-3" />
                                                        {formatSubjectType(log.subject_type)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(log.created_at).toLocaleString('en-US', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={`${getEventColor(log.event || 'unknown')} border-0`}
                                            >
                                                {log.event || 'unknown'}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    {log.properties && (
                                        <CardContent>
                                            {renderProperties(log.properties)}
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
