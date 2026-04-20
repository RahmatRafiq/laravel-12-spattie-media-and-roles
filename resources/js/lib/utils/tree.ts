/**
 * Utility functions for tree structure manipulation (used by TreeDnD and Menu management)
 */

export function removeNode<T>(
    items: T[],
    id: string,
    getId: (item: T) => string | number,
    getChildren: (item: T) => T[] | undefined,
    setChildren: (item: T, children: T[]) => T,
): [T | null, T[]] {
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

export function insertNode<T>(
    items: T[],
    node: T,
    parentId: string | null,
    atIndex: number,
    getId: (item: T) => string | number,
    getChildren: (item: T) => T[] | undefined,
    setChildren: (item: T, children: T[]) => T,
): T[] {
    if (parentId == null) {
        const newTree = [...items];
        newTree.splice(atIndex, 0, node);
        return newTree;
    }

    return items.map((item) => {
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

export function findParentAndIndex<T>(
    items: T[],
    id: string,
    getId: (item: T) => string | number,
    getChildren: (item: T) => T[] | undefined,
    parentId: string | null = null,
): { parentId: string | null; index: number } | null {
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
