<?php

namespace Database\Seeders\User;

use App\Modules\User\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Test User',
            'email' => 'mario.aprilnino27@gmail.com',
            'password' => bcrypt('password'),
        ]);
    }
}
