<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendCredentials;

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProgressUpdateController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/AboutUs',function () {
    return Inertia::render('AboutUs');
} )->name('AboutUs');

Route::get('/ContactUs',function () {
    return Inertia::render('ContactUs');
} )->name('ContactUs');

Route::get('/Services',function () {
    return Inertia::render('Services');
} )->name('Services');

Route::get('/Projects',function () {
    return Inertia::render('Projects');
} )->name('Projects');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
});

Route::middleware(['auth', 'role:member'])->group(function () {
    Route::get('/member/dashboard', [MemberController::class, 'index'])->name('member.dashboard');
});

Route::get('/test-email', function () {
    $user = \App\Models\User::first(); // Choose a user or create one for testing
    $password = 'TestPassword123';  // Use a test password

    // Send the test email
    Mail::to($user->email)->send(new SendCredentials($user, $password));

    return 'Test email sent!';
});


// Admin routes - accessible only by users with the 'admin' role
Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    // Admin dashboard, categories, projects, tasks management
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    // Categories Routes
    Route::resource('categories', CategoryController::class);

    //members
    Route::get('/members', [MemberController::class, 'indexAdmin'])->name('members.index');
    Route::get('/members/create', [MemberController::class, 'createAdmin'])->name('members.create');
    Route::get('/members/attendance', [AttendanceController::class, 'showMemberAttendance'])->name('member.attendance');
    Route::post('/members', [MemberController::class, 'storeAdmin'])->name('members.store');
// Show the member details (GET request)
Route::get('/members/{id}', [MemberController::class, 'show'])->name('members.show');


Route::get('/admin/profile', [ProfileController::class, 'editAdmin'])->name('profile.edit');
Route::patch('/admin/profile', [ProfileController::class, 'updateAdmin'])->name('profile.update');
Route::delete('/admin/profile', [ProfileController::class, 'destroyAdmin'])->name('profile.destroy');


// Edit member details (GET request)
Route::get('/members/{member}/edit', [MemberController::class, 'edit'])->name('members.edit');

// Update the member details (PUT request)
Route::put('/members/{member}', [MemberController::class, 'update'])->name('members.update');

// Delete the member (DELETE request)
Route::delete('/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');

Route::get('/admin/progress-updates', [ProgressUpdateController::class, 'adminIndex'])->name('admin.progress.index');

    // Projects Routes
    Route::resource('projects', ProjectController::class);

    // Tasks Routes
    Route::resource('tasks', TaskController::class);

    // Progress Updates Routes
    Route::resource('progress-updates', ProgressUpdateController::class);
});

// Member routes - accessible only by users with the 'member' role
Route::middleware(['auth', 'verified', 'role:member'])->group(function () {
    // Member dashboard (tasks and updates)
    Route::get('/member/dashboard', [MemberController::class, 'index'])->name('member.dashboard');


    Route::get('/member/tasks', [TaskController::class, 'tasksIndex'])->name('member.tasks.index');
    Route::get('/member/tasks/{task}/progress', [TaskController::class, 'showTaskProgress'])->name('member.tasks.progress');


    Route::get('/attendance/qr', [MemberController::class, 'showQrCode'])->name('attendance.qr');
    Route::get('/attendance/mark/{token}', [MemberController::class, 'showMarkPage'])->name('attendance.mark.page'); // New route for showing the page
    Route::post('/attendance/mark/{token}', [MemberController::class, 'mark'])->name('attendance.mark');
    Route::get('/member/attendance/myattendance', [AttendanceController::class, 'myAttendance'])->name('member.myAttendance');

    Route::get('/progress-updates', [ProgressUpdateController::class, 'index'])->name('member.progress.index');
    Route::get('/progress-updates/create', [ProgressUpdateController::class, 'create'])->name('member.progress.create');
    Route::post('/progress-updates', [ProgressUpdateController::class, 'store'])->name('member.progress.store');
    Route::delete('/progress-updates/{progress}', [ProgressUpdateController::class, 'destroy'])->name('member.progress.destroy');


});





// Profile Routes for all authenticated users


require __DIR__.'/auth.php';
