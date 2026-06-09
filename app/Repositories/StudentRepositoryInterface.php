<?php

namespace App\Repositories;

interface StudentRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}