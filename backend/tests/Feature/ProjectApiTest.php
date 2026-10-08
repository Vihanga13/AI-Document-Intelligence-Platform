<?php

namespace Tests\Feature;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_empty_projects(): void
    {
        $response = $this->getJson('/api/projects');

        $response->assertOk()
            ->assertJson([
                'data' => [],
            ]);
    }

    public function test_can_create_a_project_with_valid_data(): void
    {
        $payload = [
            'name' => 'E-Commerce Core',
            'description' => 'Main payment and order processing repository',
            'repository_name' => 'ecommerce-backend',
            'status' => ProjectStatus::PENDING->value,
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'E-Commerce Core')
            ->assertJsonPath('data.repository_name', 'ecommerce-backend')
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('projects', [
            'name' => 'E-Commerce Core',
            'repository_name' => 'ecommerce-backend',
            'status' => 'pending',
        ]);
    }

    public function test_create_project_validation_fails_when_name_is_missing(): void
    {
        $response = $this->postJson('/api/projects', [
            'description' => 'Missing name attribute',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_create_project_validation_fails_with_invalid_status(): void
    {
        $response = $this->postJson('/api/projects', [
            'name' => 'Sample Repo',
            'status' => 'unknown_status',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['status']);
    }

    public function test_can_fetch_single_project(): void
    {
        $project = Project::create([
            'name' => 'Auth Service',
            'description' => 'OAuth provider microservice',
            'repository_name' => 'auth-service',
            'status' => ProjectStatus::READY,
        ]);

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $project->id)
            ->assertJsonPath('data.name', 'Auth Service')
            ->assertJsonPath('data.status', 'ready');
    }

    public function test_can_update_a_project(): void
    {
        $project = Project::create([
            'name' => 'Original Name',
            'description' => 'Original description',
            'repository_name' => 'orig-repo',
            'status' => ProjectStatus::PENDING,
        ]);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'name' => 'Updated Name',
            'status' => ProjectStatus::PROCESSING->value,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.status', 'processing');

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Name',
            'status' => 'processing',
        ]);
    }

    public function test_can_delete_a_project(): void
    {
        $project = Project::create([
            'name' => 'To Be Deleted',
            'description' => 'Temp project',
            'repository_name' => 'temp-repo',
            'status' => ProjectStatus::PENDING,
        ]);

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'Project deleted successfully',
            ]);

        $this->assertDatabaseMissing('projects', [
            'id' => $project->id,
        ]);
    }

    public function test_returns_404_when_project_not_found(): void
    {
        $response = $this->getJson('/api/projects/999999');

        $response->assertNotFound();
    }
}
