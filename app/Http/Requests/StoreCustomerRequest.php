<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|max:255',
            'phone_code'   => 'required|string|max:10',
            'phone_number' => 'required|string|max:20',
            'villa_ids'    => 'nullable|array',
            'villa_ids.*'  => 'exists:villas,id',
        ];
    }
}
