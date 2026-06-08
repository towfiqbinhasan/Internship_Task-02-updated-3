<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    
    public function index()
    {
        $students = Student::latest()->paginate(10)->through(function ($student) {
           
            $student->gender = ($student->gender === 'M' || $student->gender === 'Male') ? 'Male' : 'Female';
            
          
            $student->date_of_birth = $student->dob; 
            return $student;
        });

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

      
        $data = [
            'name'   => $validated['name'],
            'email'  => $validated['email'],
            'age'    => $validated['age'],
            'dob'    => $validated['date_of_birth'], 
            'gender' => ($validated['gender'] === 'Male') ? 'M' : 'F',
            'score'  => $validated['score'],
        ];

      
        Student::create($data);

        return redirect()->back()->with('success', 'Student added successfully!'); 
    }

        public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|unique:students,email,' . $student->id,
            'age'           => 'required|integer',
            'date_of_birth' => 'required|date',
            'gender'        => 'required|string',
            'score'         => 'required|numeric',
        ]);

       
        $data = [
            'name'   => $validated['name'],
            'email'  => $validated['email'],
            'age'    => $validated['age'],
            'dob'    => $validated['date_of_birth'],
            'gender' => ($validated['gender'] === 'Male') ? 'M' : 'F',
            'score'  => $validated['score'],
        ];

        $student->update($data);

        return redirect()->back()->with('success', 'Student updated successfully!');
    }

    
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return redirect()->back()->with('success', 'Student deleted successfully!');
    }
}