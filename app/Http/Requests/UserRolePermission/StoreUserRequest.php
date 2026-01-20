<?php

namespace App\Http\Requests\UserRolePermission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
        ];
    }

    /**
     * Get validated data with password hashed
     */
    public function validated($key = null, $default = null): array
    {
        $data = parent::validated($key, $default);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        return $data;
    }
}
