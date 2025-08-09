import React from 'react';
import { FolderOpen, Folder as FolderIcon, ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';

export interface FilemanagerFolder {
    id: number;
    name: string;
    parent_id: number | null;
    path?: string | null;
}

interface SidebarProps {
    folders: FilemanagerFolder[];
    currentFolderId: number | null;
    onFolderClick: (folderId: number | null) => void;
    onCreateFolder: (name: string, parentId: number | null) => void;
    onRenameFolder: (id: number, name: string) => void;
    onDeleteFolder: (id: number) => void;
    expanded?: { [id: number]: boolean };
    setExpanded?: React.Dispatch<React.SetStateAction<{ [id: number]: boolean }>>;
}

export default function Sidebar({
    folders,
    currentFolderId,
    onFolderClick,
    onCreateFolder,
    onRenameFolder,
    onDeleteFolder,
    expanded: controlledExpanded,
    setExpanded: setControlledExpanded,
}: SidebarProps) {
    const [localExpanded, setLocalExpanded] = React.useState<{ [id: number]: boolean }>({});
    const expanded = controlledExpanded ?? localExpanded;
    const setExpanded = setControlledExpanded ?? setLocalExpanded;

    const openParentChain = React.useCallback((folderId: number | null, setter: typeof setExpanded) => {
        if (!folderId) return;
        setter((prev) => {
            const next = { ...prev };
            next[folderId] = true;
            let parent = folders.find((f) => f.id === folderId)?.parent_id ?? null;
            while (parent) {
                next[parent] = true;
                parent = folders.find((f) => f.id === parent)?.parent_id ?? null;
            }
            return next;
        });
    }, [folders]);

    const handleToggle = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleFolderClick = (folderId: number | null) => {
        if (folderId === null) {
            onFolderClick(null);
            return;
        }
        openParentChain(folderId, setExpanded);
        onFolderClick(folderId);
    };

    React.useEffect(() => {
        if (!currentFolderId) return;
        openParentChain(currentFolderId, setExpanded);
    }, [currentFolderId, folders, openParentChain, setExpanded]);

    const renderFolderTree = (parentId: number | null = null, level = 0): React.ReactNode => {
        return folders
            .filter((f) => f.parent_id === parentId)
            .map((folder) => {
                const hasChildren = folders.some((f) => f.parent_id === folder.id);
                const isOpen = !!expanded[folder.id];
                return (
                    <div key={folder.id} className={
                        [
                            'flex flex-col',
                            level > 0 ? 'border-l border-gray-200 pl-3' : '',
                        ].join(' ')
                    }>
                        <div className={`flex items-center gap-2 py-1 group rounded ${currentFolderId === folder.id ? 'bg-accent/10 text-accent-foreground' : ''}`}>
                            {hasChildren ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(folder.id);
                                    }}
                                    className="p-0.5 text-gray-400 hover:text-blue-500 flex items-center justify-center"
                                    tabIndex={-1}
                                >
                                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            ) : (
                                <span className="w-4 inline-block" />
                            )}

                            <button
                                className={`flex items-center gap-2 flex-1 text-left truncate ${currentFolderId === folder.id ? 'font-bold text-blue-600' : ''}`}
                                onClick={() => handleFolderClick(folder.id)}
                            >
                                <span>{isOpen && hasChildren ? <FolderOpen size={16} /> : <FolderIcon size={16} />}</span>
                                <span className="truncate">{folder.name}</span>
                            </button>

                            <button
                                title="Add subfolder"
                                onClick={() => {
                                    const name = prompt('Subfolder name');
                                    if (name) onCreateFolder(name, folder.id);
                                }}
                                className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition flex items-center"
                                style={{ marginLeft: 2 }}
                            >
                                <Plus size={14} />
                            </button>

                            <button
                                title="Rename"
                                onClick={() => {
                                    const newName = prompt('Rename folder', folder.name) || folder.name;
                                    onRenameFolder(folder.id, newName);
                                }}
                                className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition flex items-center"
                            >
                                <Pencil size={14} />
                            </button>

                            <button
                                title="Delete"
                                onClick={() => onDeleteFolder(folder.id)}
                                className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition flex items-center"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {hasChildren && isOpen && <div>{renderFolderTree(folder.id, level + 1)}</div>}
                    </div>
                );
            });
    };

    return (
        <aside className="w-full md:w-64 min-w-0 md:min-w-[240px] border-r border-border pr-6 bg-background max-h-[80vh] md:max-h-none overflow-y-auto">
            <div className="mb-2 font-semibold text-sm text-muted-foreground flex items-center justify-between">
                Folders
                <button
                    onClick={() => {
                        const name = prompt('Folder name');
                        if (name) onCreateFolder(name, null);
                    }}
                    className="text-xs text-primary hover:underline"
                >
                    + Folder
                </button>
            </div>

            <div>{renderFolderTree(null, 0)}</div>
        </aside>
    );
}
