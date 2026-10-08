<?php

namespace App\Services;

use App\Enums\ProjectStatus;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService
{
    /**
     * Get all projects ordered by newest first.
     *
     * @return Collection<int, Project>
     */
    public function getAllProjects(): Collection
    {
        return Project::query()
            ->latest()
            ->get();
    }

    /**
     * Create a new project.
     *
     * @param array{name: string, description?: string|null, repository_name?: string|null, status?: string|null} $data
     */
    public function createProject(array $data): Project
    {
        if (empty($data['status'])) {
            $data['status'] = ProjectStatus::PENDING->value;
        }

        return Project::create($data);
    }

    /**
     * Update an existing project.
     *
     * @param array{name?: string, description?: string|null, repository_name?: string|null, status?: string} $data
     */
    public function updateProject(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }

    /**
     * Delete a project.
     */
    public function deleteProject(Project $project): bool
    {
        return (bool) $project->delete();
    }
}
