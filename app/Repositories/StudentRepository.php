<?php

namespace App\Repositories;

use App\Models\Student;

class StudentRepository implements StudentRepositoryInterface
{
    protected $model;

    public function __construct(Student $student)
    {
        $this->model = $student;
    }

    public function getAllPaginated(int $perPage = 10)
    {
        return $this->model->latest()->paginate($perPage);
    }

    public function findById(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $student = $this->findById($id);
        $student->update($data);
        return $student;
    }

    public function delete(int $id)
    {
        $student = $this->findById($id);
        return $student->delete();
    }
}