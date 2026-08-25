<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVillaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'position' => 'required|string|max:50',
            // status ada di $fillable Villa, jadi tanpa aturan ini nilai
            // sembarang bisa lolos ke kolom enum dan bikin MySQL error 500.
            'status'   => 'required|in:available,pending,sold',
        ];
    }
}
