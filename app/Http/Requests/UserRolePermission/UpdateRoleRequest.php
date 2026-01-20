<?php

namespace App\Http\Requests\UserRolePermission;

use App\Helpers\Guards;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoleRequest extends FormRequest
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
        $roleId = $this->route('role');

        return [
            'name' => 'required|string|max:255|unique:roles,name,'.$roleId,
            'guard_name' => ['required', 'string', 'max:255', Rule::in(Guards::list())],
            'permissions' => 'required|array',
        ];
    }
}
