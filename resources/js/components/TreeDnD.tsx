import React from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Z_INDEX } from '@/lib/constants';

export interface TreeDnDProps<T> {
    items: T[];
    onChange: (items: T[]) => void;
    getId: (item: T) => string | number;
    getChildren: (item: T) => T[] | undefined;
    setChildren: (item: T, children: T[]) => T;
    renderItem: (item: T) => React.ReactNode;
}

function DefaultTreeItem<T>({ item, children, getId, renderItem }: { item: T; children?: React.ReactNode; getId: (item: T) => string | number; renderItem: (item: T) => React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(getId(item)) });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? Z_INDEX.DRAGGING : undefined,
    };
    return (
        <li ref={setNodeRef} style={style} className="mb-1">
            <div {...attributes} {...listeners}>
                {renderItem(item)}
            </div>
            {children}
        </li>
    );
}

function Tree<T>({ items, getId, getChildren, setChildren, renderItem }: { items: T[]; getId: (item: T) => string | number; getChildren: (item: T) => T[] | undefined; setChildren: (item: T, children: T[]) => T; renderItem: (item: T) => React.ReactNode }) {
    if (!items || items.length === 0) {
        return <div className="text-muted-foreground text-sm">No data found.</div>;
    }
    return (
        <SortableContext items={items.map((i) => String(getId(i)))} strategy={verticalListSortingStrategy}>
            <ul className="pl-0">
                {items.map((item) => {
                    const children = getChildren(item);
                    return (
                        <React.Fragment key={getId(item)}>
                            <DefaultTreeItem item={item} getId={getId} renderItem={renderItem}>
                                {children && children.length > 0 && (
                                    <div className="ml-3 sm:ml-6 mt-1">
                                        <Tree items={children} getId={getId} getChildren={getChildren} setChildren={setChildren} renderItem={renderItem} />
                                    </div>
                                )}
                            </DefaultTreeItem>
                        </React.Fragment>
                    );
                })}
            </ul>
        </SortableContext>
    );
}

function removeNode<T>(items: T[], id: string, getId: (item: T) => string | number, getChildren: (item: T) => T[] | undefined, setChildren: (item: T, children: T[]) => T): [T | null, T[]] {
    let removed: T | null = null;
    function walk(list: T[]): T[] {
        return list.reduce<T[]>((acc, item) => {
            if (String(getId(item)) === id) {
                removed = item;
                return acc;
            }
            const children = getChildren(item);
            if (Array.isArray(children) && children.length > 0) {
                const newChildren = walk(children);
                acc.push(setChildren(item, newChildren));
                return acc;
            }
            acc.push(item);
            return acc;
        }, []);
    }
    const newTree = walk(items);
    return [removed, newTree];
}

function insertNode<T>(items: T[], node: T, parentId: string | null, atIndex: number, getId: (item: T) => string | number, getChildren: (item: T) => T[] | undefined, setChildren: (item: T, children: T[]) => T): T[] {
    if (parentId == null) {
        const newTree = [...items];
        newTree.splice(atIndex, 0, node);
        return newTree;
    }
    return items.map(item => {
        if (String(getId(item)) === parentId) {
            const children = Array.isArray(getChildren(item)) ? [...(getChildren(item) as T[])] : [];
            children.splice(atIndex, 0, node);
            return setChildren(item, children);
        }
        const children = getChildren(item);
        if (Array.isArray(children) && children.length > 0) {
            return setChildren(item, insertNode(children, node, parentId, atIndex, getId, getChildren, setChildren));
        }
        return item;
    });
}

function findParentAndIndex<T>(items: T[], id: string, getId: (item: T) => string | number, getChildren: (item: T) => T[] | undefined, parentId: string | null = null): { parentId: string | null, index: number } | null {
    for (let i = 0; i < items.length; i++) {
        if (String(getId(items[i])) === id) return { parentId, index: i };
        const children = getChildren(items[i]);
        if (Array.isArray(children) && children.length > 0) {
            const found = findParentAndIndex(children, id, getId, getChildren, String(getId(items[i])));
            if (found) return found;
        }
    }
    return null;
}

export default function TreeDnD<T>({ items, onChange, getId, getChildren, setChildren, renderItem }: TreeDnDProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || String(active.id) === String(over.id)) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const from = findParentAndIndex(items, activeId, getId, getChildren);
        const to = findParentAndIndex(items, overId, getId, getChildren);
        if (!from || !to) return;

        const [removedNode, treeWithoutNode] = removeNode(items, activeId, getId, getChildren, setChildren);
        if (!removedNode) return;

        let targetIndex = to.index;
        if (from.parentId === to.parentId && from.index < to.index) {
            targetIndex = to.index;
        }

        const newTree = insertNode(
            treeWithoutNode,
            removedNode,
            to.parentId,
            targetIndex,
            getId,
            getChildren,
            setChildren
        );
        onChange(newTree);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <Tree items={items} getId={getId} getChildren={getChildren} setChildren={setChildren} renderItem={renderItem} />
        </DndContext>
    );
}
