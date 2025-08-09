import * as React from 'react';
import { Globe2, Lock, Folder, FolderOpen } from 'lucide-react';

interface SidebarProps {
    groupedCollections: { [key: string]: string[] };
    openAccordion: 'public' | 'private';
    setOpenAccordion: (v: 'public' | 'private') => void;
    data: { collection_name: string };
    handleFilterChange: (field: 'collection_name' | 'visibility', value: string) => void;
}

export default function Sidebar({ groupedCollections, openAccordion, setOpenAccordion, data, handleFilterChange }: SidebarProps) {
    return (
        <aside className="w-56 min-w-[180px] border-r pr-4">
            <div className="mb-2 font-semibold text-sm text-muted-foreground">Folders</div>
            <ul className="space-y-1">
                {(['public', 'private'] as const).map((disk) => (
                    <li key={disk}>
                        <button
                            className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm font-bold ${openAccordion === disk ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                            onClick={() => {
                                setOpenAccordion(disk);
                                handleFilterChange('visibility', disk);
                            }}
                        >
                            <span className="inline-block align-middle mr-2">
                                {disk === 'public' ? <Globe2 className="inline w-4 h-4 align-middle" /> : <Lock className="inline w-4 h-4 align-middle" />}
                            </span>
                            {disk.charAt(0).toUpperCase() + disk.slice(1)}
                        </button>
                        {openAccordion === disk && (
                            <ul className="ml-4 mt-1 space-y-1">
                                <li>
                                    <button
                                        className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm ${!data.collection_name ? 'bg-muted font-bold text-foreground' : ''}`}
                                        onClick={() => handleFilterChange('collection_name', '')}
                                    >
                                        <span className="inline-block align-middle mr-2">
                                            <FolderOpen className="inline w-4 h-4 align-middle" />
                                        </span>
                                        All Collections
                                    </button>
                                </li>
                                {groupedCollections[disk].map((col) => (
                                    <li key={col}>
                                        <button
                                            className={`w-full text-left px-3 py-2 rounded hover:bg-muted/70 transition text-sm ${data.collection_name === col ? 'bg-muted font-bold text-foreground' : ''}`}
                                            onClick={() => handleFilterChange('collection_name', col)}
                                        >
                                            <span className="inline-block align-middle mr-2">
                                                <Folder className="inline w-4 h-4 align-middle" />
                                            </span>
                                            {col}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
