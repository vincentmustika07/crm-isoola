<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone_code',
        'phone_number',
    ];

    public function villas(): BelongsToMany
    {
        return $this->belongsToMany(Villa::class, 'customer_villa');
    }
}
