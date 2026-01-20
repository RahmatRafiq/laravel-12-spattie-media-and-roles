<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class RoleData
{
    /**
     * RoleData constructor
     *
     * @param  int|null  $id
     * @param  string  $name
     * @param  string  $guardName
     * @param  array  $permissions
     */
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $guardName,
        public readonly array $permissions = [],
    ) {}

    /**
     * Create DTO from HTTP request
     *
     * @param  Request  $request
     * @return self
     */
    public static function fromRequest(Request $request): self
    {
        return new self(
            id: $request->integer('id') ?: null,
            name: $request->string('name')->toString(),
            guardName: $request->string('guard_name', 'web')->toString(),
            permissions: $request->array('permissions'),
        );
    }

    /**
     * Create DTO from array
     *
     * @param  array  $data
     * @return self
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            name: $data['name'],
            guardName: $data['guard_name'] ?? 'web',
            permissions: $data['permissions'] ?? [],
        );
    }

    /**
     * Convert DTO to array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'guard_name' => $this->guardName,
            'permissions' => $this->permissions,
        ];
    }

    /**
     * Get data for create/update operation
     *
     * @return array
     */
    public function forSave(): array
    {
        return [
            'name' => $this->name,
            'guard_name' => $this->guardName,
            'permissions' => $this->permissions,
        ];
    }
}
