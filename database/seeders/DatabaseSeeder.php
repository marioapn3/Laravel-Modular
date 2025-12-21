<?php

namespace Database\Seeders;

use Database\Seeders\AppSettingSeeder\AppSettingSeeder;
use Database\Seeders\Role\RolePermissionSeeder;
use Database\Seeders\User\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            RolePermissionSeeder::class,
            AppSettingSeeder::class,
        ]);
    }
}
