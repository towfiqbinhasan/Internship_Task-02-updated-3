<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {
    
   
    Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');
    
   
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');
    Route::put('/students/{id}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/students/{id}', [StudentController::class, 'destroy'])->name('students.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/send-notification', function () {
    
    $user = User::first(); 
    
    $message = "হ্যালো! এটি একটি লারাভেল রিয়েল-টাইম নোটিফিকেশন।";
    
    
    $user->notify(new RealTimeNotification($message));

    return "Notification Sent Successfully!";
});
Broadcast::channel('student-tracker', function () {
    return true; // Public channel, সবাই শুনতে পারবে
});

require __DIR__.'/auth.php';