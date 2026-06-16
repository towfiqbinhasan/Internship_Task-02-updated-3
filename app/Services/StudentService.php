<?php

namespace App\Services;

use App\Repositories\StudentRepository;

class StudentService
{
    protected $studentRepository;

    public function __construct(StudentRepository $studentRepository)
    {
        $this->studentRepository = $studentRepository;
    }

    public function getStudentsForDashboard()
    {
        return $this->studentRepository->paginate(10);
    }

    public function registerStudent(array $data)
    {
        // কন্ট্রোলার থেকে অলরেডি 'dob' হয়ে আসছে, তাই সরাসরি ফরম্যাট করা হলো
        $formattedData = $this->formatData($data);
        return $this->studentRepository->create($formattedData);
    }

    public function updateStudent(int $id, array $data)
    {
        $formattedData = $this->formatData($data);
        return $this->studentRepository->update($id, $formattedData);
    }

    public function deleteStudent(int $id)
    {
        return $this->studentRepository->delete($id);
    }
    public function getStudentById($id)
{
    return $this->studentRepository->findById($id);
}


    protected function formatData(array $validatedData)
    {
        $formatted = [
            'name'   => $validatedData['name'],
            'email'  => $validatedData['email'],
            'age'    => $validatedData['age'],
        ];

       
        if (isset($validatedData['dob'])) {
            $formatted['dob'] = $validatedData['dob'];
        } 
       
        config(['app.timezone' => 'Asia/Dhaka']);
        if (isset($validatedData['date_of_birth'])) {
            $formatted['dob'] = $validatedData['date_of_birth'];
        }

        if (isset($validatedData['gender'])) {
            $formatted['gender'] = ($validatedData['gender'] === 'Male' || $validatedData['gender'] === 'M') ? 'M' : 'F';
        }

        if (isset($validatedData['score'])) {
            $formatted['score'] = $validatedData['score'];
        }

        return $formatted;
    }
}