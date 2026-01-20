<?php

namespace App\DataTransferObjects;

use Illuminate\Http\Request;

class UserData
{
    /**
     * UserData constructor
     *
     * @param  int|null  $id
     * @param  string  $name
     * @param  string  $email
     * @param  string|null  $password
     * @param  int|null  $roleId
     * @param  array  $permissions
     */
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $password,
        public readonly ?int $roleId,
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
            email: $request->string('email')->toString(),
            password: $request->filled('password')
                ? $request->string('password')->toString()
                : null,
            roleId: $request->integer('role_id') ?: null,
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
            email: $data['email'],
            password: $data['password'] ?? null,
            roleId: $data['role_id'] ?? null,
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
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role_id' => $this->roleId,
            'permissions' => $this->permissions,
        ], fn ($value) => $value !== null);
    }

    /**
     * Get data for create operation (without ID)
     *
     * @return array
     */
    public function forCreate(): array
    {
        $data = $this->toArray();
        unset($data['id']);

        return $data;
    }

    /**
     * Get data for update operation (without ID and null password)
     *
     * @return array
     */
    public function forUpdate(): array
    {
        $data = $this->toArray();
        unset($data['id']);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        return $data;
    }
}
