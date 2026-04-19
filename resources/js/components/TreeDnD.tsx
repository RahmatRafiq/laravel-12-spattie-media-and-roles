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
import { findParentAndIndex, insertNode, removeNode } from '@/lib/utils/tree';

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
