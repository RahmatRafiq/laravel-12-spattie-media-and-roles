<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class MenuData
{
    /**
     * MenuData constructor
     */
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly ?string $route,
        public readonly ?string $icon,
        public readonly ?string $permission,
        public readonly ?int $parentId,
        public readonly int $order = 0,
    ) {}

    /**
     * Create DTO from HTTP request
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            id: $request->integer('id') ?: null,
            title: $request->string('title')->toString(),
            route: $request->string('route')->toString() ?: null,
            icon: $request->string('icon')->toString() ?: null,
            permission: $request->string('permission')->toString() ?: null,
            parentId: $request->integer('parent_id') ?: null,
            order: $request->integer('order', 0),
        );
    }

    /**
     * Create DTO from array
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            title: $data['title'],
            route: $data['route'] ?? null,
            icon: $data['icon'] ?? null,
            permission: $data['permission'] ?? null,
            parentId: $data['parent_id'] ?? null,
            order: $data['order'] ?? 0,
        );
    }

    /**
     * Convert DTO to array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'route' => $this->route,
            'icon' => $this->icon,
            'permission' => $this->permission,
            'parent_id' => $this->parentId,
            'order' => $this->order,
        ];
    }

    /**
     * Get data for create/update operation
     */
    public function forSave(): array
    {
        $data = $this->toArray();
        unset($data['id']);

        return $data;
    }

    /**
     * Check if menu is root level
     */
    public function isRoot(): bool
    {
        return $this->parentId === null;
    }

    /**
     * Check if menu has permission
     */
    public function hasPermission(): bool
    {
        return $this->permission !== null;
    }
}
