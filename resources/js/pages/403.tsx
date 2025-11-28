import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, router } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

interface ErrorPageProps {
    message: string;
    status: number;
}

export default function Error403({ message, status }: ErrorPageProps) {
    return (
        <>
            <Head title="Access Denied" />
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Access Denied</CardTitle>
                        <CardDescription className="text-lg">
                            Error {status}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-center text-muted-foreground">
                            {message || 'You do not have permission to access this page.'}
                        </p>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => router.visit('/dashboard')}
                                className="w-full"
                            >
                                <Home className="mr-2 h-4 w-4" />
                                Go to Dashboard
                            </Button>
                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="w-full"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
