<?php

namespace App\Http\Controllers;

use App\Services\StudentService;
use App\Events\StudentChanged;
use App\Mail\StudentDeleted;
use Illuminate\Support\Facades\Mail;
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

        $validated['dob'] = $validated['date_of_birth'];
        unset($validated['date_of_birth']);

        $student = $this->studentService->registerStudent($validated);

        event(new StudentChanged("New student '{$validated['name']}' has been added successfully!", 'success', $student));

        return redirect()->back()->with('success', "Student '{$validated['name']}' added successfully!");
    }

    public function update(Request $request, $id)
    {
        $isQuickEdit = $request->input('formMode') === 'quick-edit';

        $rules = [
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
            'age'   => 'required|integer',
        ];

        if (!$isQuickEdit) {
            $rules['date_of_birth'] = 'required|date';
            $rules['gender']        = 'required|string';
            $rules['score']         = 'required|numeric';
        }

        $validated = $request->validate($rules);

        if (!$isQuickEdit && isset($validated['date_of_birth'])) {
            $validated['dob'] = $validated['date_of_birth'];
            unset($validated['date_of_birth']);
        }

        $student = $this->studentService->updateStudent($id, $validated);

        event(new StudentChanged("✅ Student '{$student->name}' edited successfully!", 'info', $student));

        return redirect()->back()->with('success', 'Student updated successfully!');
    }

    public function destroy($id)
    {
        // Delete করার আগে student data নিয়ে রাখো
        $student = $this->studentService->getStudentById($id);

        $this->studentService->deleteStudent($id);

        // Admin কে email পাঠাও
        Mail::to('towfiqtkg94@gmail.com')->send(new StudentDeleted($student));

        // Real-time notification
        event(new StudentChanged("A student record was deleted from the database.", 'error'));

        return redirect()->back()->with('success', 'Student deleted successfully!');
    }
}