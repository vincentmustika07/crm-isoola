<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login()
    {
        // Route [home] tidak pernah ada di app ini; '/' cuma redirect ke /villas
        // di balik middleware admin. Jadi tamu harus dilempar ke /login.
        $this->get('/')->assertRedirect('/login');
    }

    public function test_login_is_rate_limited()
    {
        // Melindungi throttle:5,1 di routes/web.php. Tanpa ini, satu password
        // admin tunggal bisa dibrute force ribuan kali per menit.
        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['username' => 'x', 'password' => 'y']);
        }

        $this->post('/login', ['username' => 'x', 'password' => 'y'])
            ->assertStatus(429);
    }
}
