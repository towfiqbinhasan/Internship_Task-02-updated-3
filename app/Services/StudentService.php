<?php

namespace App\Services;

use App\Repositories\StudentRepositoryInterface;

class StudentService
{
    protected $studentRepo;

   
    public function __construct(StudentRepositoryInterface $studentRepo)
    {
        $this->studentRepo = $studentRepo;
    }

    public function getStudentsForDashboard()
    {
        $students = $this->studentRepo->getAllPaginated(10);

       
        return $students->through(function ($student) {
            $student->gender = ($student->gender === 'M' || $student->gender === 'Male') ? 'Male' : 'Female';
            $student->date_of_birth = $student->dob; 
            return $student;
        });
    }

    public function registerStudent(array $validatedData)
    {
        $data = $this->formatData($validatedData);
        return $this->studentRepo->create($data);
    }

    public function updateStudent(int $id, array $validatedData)
    {
        $data = $this->formatData($validatedData);
        return $this->studentRepo->update($id, $data);
    }

    public function deleteStudent(int $id)
    {
        return $this->studentRepo->delete($id);
    }

    /**
     * 
     */
    private function formatData(array $validatedData): array
    {
        return [
            'name'   => $validatedData['name'],
            'email'  => $validatedData['email'],
            'age'    => $validatedData['age'],
            'dob'    => $validatedData['date_of_birth'],
            'gender' => ($validatedData['gender'] === 'Male') ? 'M' : 'F',
            'score'  => $validatedData['score'],
        ];
    }
}