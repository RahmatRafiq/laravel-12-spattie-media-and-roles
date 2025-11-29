import * as React from 'react';

interface PrivateImageProps {
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
        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await fetch(src, {
                    credentials: 'include', // Important: include cookies for authentication
                    headers: {
                        'Accept': 'image/*',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                setBlobUrl(objectUrl);
            } catch (err) {
                console.error('Failed to load private image:', err);
                setError(true);
                onError?.();
            } finally {
                setLoading(false);
            }
        };

        fetchImage();

        // Cleanup blob URL on unmount
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src, onError]);

    if (loading) {
        return (
            <div className={`${className} flex items-center justify-center bg-muted animate-pulse`}>
                <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (error || !blobUrl) {
        return (
            <div className={`${className} flex items-center justify-center bg-muted`}>
                <span className="text-xs text-destructive">Failed to load</span>
            </div>
        );
    }

    return <img src={blobUrl} alt={alt} className={className} />;
}
