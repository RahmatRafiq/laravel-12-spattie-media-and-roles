import React from 'react';
import { FolderOpen, Folder as FolderIcon, ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

    // Dialog state
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogType, setDialogType] = React.useState<'add' | 'rename'>('add');
    const [dialogParentId, setDialogParentId] = React.useState<number | null>(null);
    const [dialogFolderId, setDialogFolderId] = React.useState<number | null>(null);
    const [folderName, setFolderName] = React.useState('');
    // removed unused renameDefault state

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

    // Dialog handlers
    const openAddDialog = (parentId: number | null = null) => {
        setDialogType('add');
        setDialogParentId(parentId);
        setFolderName('');
        setDialogOpen(true);
    };
    const openRenameDialog = (folderId: number, currentName: string) => {
        setDialogType('rename');
        setDialogFolderId(folderId);
        setFolderName(currentName);
        setDialogOpen(true);
    };
    const handleDialogSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (dialogType === 'add') {
            if (folderName.trim()) onCreateFolder(folderName.trim(), dialogParentId);
        } else if (dialogType === 'rename' && dialogFolderId) {
            if (folderName.trim()) onRenameFolder(dialogFolderId, folderName.trim());
        }
        setDialogOpen(false);
    };

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
                                    className="p-0.5 text-gray-400 hover:text-blue-500 flex items-center justify-center focus:outline-none"
                                    tabIndex={-1}
                                    aria-label={isOpen ? 'Collapse folder' : 'Expand folder'}
                                >
                                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            ) : (
                                <span className="w-4 inline-block" />
                            )}

                            <button
                                className={`flex items-center gap-2 flex-1 text-left truncate ${currentFolderId === folder.id ? 'font-bold text-blue-600' : ''}`}
                                onClick={() => handleFolderClick(folder.id)}
                                aria-current={currentFolderId === folder.id ? 'page' : undefined}
                            >
                                <span>{isOpen && hasChildren ? <FolderOpen size={16} /> : <FolderIcon size={16} />}</span>
                                <span className="truncate">{folder.name}</span>
                            </button>

                            <button
                                title="Add subfolder"
                                type="button"
                                onClick={() => openAddDialog(folder.id)}
                                className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition flex items-center ml-1 focus:outline-none"
                                aria-label="Add subfolder"
                            >
                                <Plus size={14} />
                            </button>

                            <button
                                title="Rename"
                                type="button"
                                onClick={() => openRenameDialog(folder.id, folder.name)}
                                className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition flex items-center focus:outline-none"
                                aria-label="Rename folder"
                            >
                                <Pencil size={14} />
                            </button>

                            <button
                                title="Delete"
                                type="button"
                                onClick={() => onDeleteFolder(folder.id)}
                                className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition flex items-center focus:outline-none"
                                aria-label="Delete folder"
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
        <aside className="w-full md:w-64 min-w-0 md:min-w-[240px] pr-6 bg-background max-h-[80vh] md:max-h-none overflow-y-auto border rounded shadow-sm">
            <div className="mb-2 font-semibold text-sm text-muted-foreground flex items-center justify-between px-4 pt-4">
                Folders
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary hover:underline px-1 py-0 h-6"
                    onClick={() => openAddDialog(null)}
                >
                    + Folder
                </Button>
            </div>

            <div className="px-2 pb-4">{renderFolderTree(null, 0)}</div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-xs">
                    <form onSubmit={handleDialogSubmit}>
                        <DialogHeader>
                            <DialogTitle>{dialogType === 'add' ? 'Add Folder' : 'Rename Folder'}</DialogTitle>
                        </DialogHeader>
                        <Input
                            autoFocus
                            value={folderName}
                            onChange={e => setFolderName(e.target.value)}
                            placeholder={dialogType === 'add' ? 'Folder name' : 'New folder name'}
                            className="mt-2"
                        />
                        <DialogFooter className="mt-4 flex gap-2 justify-end">
                            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!folderName.trim()}>
                                {dialogType === 'add' ? 'Add' : 'Rename'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </aside>
    );
}
