<?php

namespace Tests\Feature;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_health_and_admin_login_redirect(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJson(['status' => 'ok']);

        $this->get('/admin')
            ->assertRedirect(route('admin.login'));
    }

    public function test_user_can_register_submit_listing_and_admin_can_moderate(): void
    {
        $register = $this->postJson('/api/auth/register', [
            'name' => 'Jean Test',
            'email' => 'jean@test.cm',
            'password' => 'Secret123!',
            'accountType' => 'particulier',
        ])->assertCreated();

        $token = $register->json('token');

        $create = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/listings', [
                'title' => 'Villa Test Bonapriso',
                'transaction' => 'vente',
                'type' => 'villa',
                'city' => 'Douala',
                'neighborhood' => 'Bonapriso',
                'price' => 120000000,
                'surface' => 250,
                'rooms' => 5,
                'features' => ['Jardin', 'Parking'],
                'description' => 'Belle villa de test.',
            ])->assertCreated();

        $slug = $create->json('listing.id');
        $this->assertSame('pending', $create->json('listing.status'));

        // Non visible publiquement tant que non validée
        $this->getJson('/api/listings')
            ->assertOk()
            ->assertJsonMissing(['id' => $slug]);

        // Un admin valide l'annonce via le back-office
        $admin = User::create([
            'name' => 'Admin Test',
            'email' => 'admin@test.cm',
            'password' => 'Admin1234!',
            'role' => 'admin',
            'is_active' => true,
        ]);

        $listing = Listing::where('slug', $slug)->firstOrFail();

        $this->actingAs($admin)
            ->patch(route('admin.listings.moderate', $listing), [
                'status' => 'approved',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('listings', [
            'slug' => $slug,
            'status' => 'approved',
        ]);

        // Désormais visible sur l'API publique
        $this->getJson('/api/listings')
            ->assertOk()
            ->assertJsonFragment(['id' => $slug]);
    }
}
