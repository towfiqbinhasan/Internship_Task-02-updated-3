<?php

namespace App\Http\Controllers;

use App\Services\StudentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $studentService;

  
    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index()
    {
        $students = $this->studentService->getStudentsForDashboard();

        return Inertia::render('Dashboard', [
            'students' => $students
        ]);
    }

    public function store(Request $request)
    {
       
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:students,email',
            'age'           => 'required|integer',
            'date_of_birth' => 'required|date', 
            'gender'        => 'required|string',
            'score'         => 'required|numeric',
        ]);

        $this->studentService->registerStudent($validated);

        return redirect()->back()->with('success', 'Student added successfully!'); 
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:students,email,' . $id,
            'age'           => 'required|integer',
            'date_of_birth' => 'required|date',
            'gender'        => 'required|string',
            'score'         => 'required|numeric',
        ]);

        $this->studentService->updateStudent($id, $validated);

        return redirect()->back()->with('success', 'Student updated successfully!');
    }

    public function destroy($id)
    {
        $this->studentService->deleteStudent($id);

        return redirect()->back()->with('success', 'Student deleted successfully!');
    }
}