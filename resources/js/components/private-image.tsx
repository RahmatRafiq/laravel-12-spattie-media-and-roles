import * as React from 'react';

type PrivateImageProps = {
    src: string;
    alt: string;
    className?: string;
    onError?: () => void;
}

/**
 * Component for displaying images from protected routes
 * Fetches image with credentials and converts to blob URL
 */
export default function PrivateImage({ src, alt, className, onError }: PrivateImageProps) {
    const [blobUrl, setBlobUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        // SECURITY: Prevent memory leaks with proper cleanup
        let objectUrl: string | null = null;
        let isMounted = true;
        const abortController = new AbortController();

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(src, {
                    credentials: 'include', // Important: include cookies for authentication
                    headers: {
                        Accept: 'image/*',
                    },
                    signal: abortController.signal,
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);

                // Only update state if component is still mounted
                if (isMounted) {
                    setBlobUrl(objectUrl);
                }
            } catch (err) {
                // Ignore abort errors
                if (err instanceof Error && err.name === 'AbortError') {
                    return;
                }

                console.error('Failed to load private image:', err);
                if (isMounted) {
                    setError(true);
                    onError?.();
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchImage();

        // Cleanup: abort fetch and revoke blob URL
        return () => {
            isMounted = false;
            abortController.abort();
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src, onError]);

    if (loading) {
        return (
            <div className={`${className} bg-muted flex animate-pulse items-center justify-center`}>
                <span className="text-muted-foreground text-xs">Loading...</span>
            </div>
        );
    }

    if (error || !blobUrl) {
        return (
            <div className={`${className} bg-muted flex items-center justify-center`}>
                <span className="text-destructive text-xs">Failed to load</span>
            </div>
        );
    }

    return <img src={blobUrl} alt={alt} className={className} />;
}
