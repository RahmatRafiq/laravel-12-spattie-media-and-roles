import * as React from 'react';

export default function GalleryHeader() {
    return (
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">File Manager</h1>
                <p className="text-muted-foreground">Manage public and private files in your application</p>
            </div>
        </div>
    );
}
