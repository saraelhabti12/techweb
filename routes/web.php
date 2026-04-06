<?php

use App\Http\Controllers\Admin\TeamHubController;
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
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Models\Blog;
use App\Models\Template;


Route::get('/', function () {

  
    $blogs = Blog::latest()->take(3)->get();
    $templates = \App\Models\Template::all();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'blogs' => $blogs,
        'templates' => $templates,
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

Route::get('/Projects', function () {
    // Récupérer tous les templates depuis la DB
    $templates = Template::all();

    return Inertia::render('Projects', [
        'templates' => $templates
    ]);
})->name('Projects');



Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Route::middleware(['auth', 'role:admin'])->group(function () {
//     Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
//     // Liste des blogs pour admin
//     Route::get('/admin/blogs', [BlogController::class, 'indexAdmin'])->name('admin.blogs.index');
    
//     // Détail d’un blog pour admin
//     Route::get('/admin/blogs/{id}', [BlogController::class, 'showAdmin'])->name('admin.blogs.show');
    
//     // Création d’un blog
//     Route::get('/admin/blogs/create', [BlogController::class, 'create'])->name('admin.blogs.create');
//     Route::post('/admin/blogs', [BlogController::class, 'store'])->name('admin.blogs.store');
// });


Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

    // Blogs Admin
    Route::get('/blogs', [BlogController::class, 'indexAdmin'])->name('blogs.index');
    Route::get('/blogs/create', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/blogs/{id}', [BlogController::class, 'showAdmin'])->name('blogs.show');

    // templates admin
    Route::get('/templates', [TemplateController::class, 'adminIndex'])->name('templates');
    Route::get('/templates/create', [TemplateController::class, 'create'])->name('templates.create');
    Route::post('/templates', [TemplateController::class, 'store'])->name('templates.store');
    // Éditer un template
    Route::get('/templates/{template}/edit', [TemplateController::class, 'edit'])->name('templates.edit');

    // Mettre à jour un template
    Route::put('/templates/{template}', [TemplateController::class, 'update'])->name('templates.update');


    // pour les customers
    Route::get('/customers', [ContactController::class, 'index'])->name('customers.index');
    Route::get('/customers/{id}', [ContactController::class, 'show'])->name('customers.show');
    Route::post('/customers/{id}/mark-read', [ContactController::class, 'markRead'])->name('customers.markRead');
    Route::post('/customers/send-reply', [ContactController::class, 'sendReply'])->name('customers.sendReply');

    // pour team hub

    Route::get('/teamhub', [TeamHubController::class, 'index'])->name('teamhub.index'); // Liste des activités
    Route::get('/teamhub/create', [TeamHubController::class, 'create'])->name('teamhub.create'); // Ajouter une activité
    Route::post('/teamhub', [TeamHubController::class, 'store'])->name('teamhub.store'); // Sauvegarde
    
    // Chat routes - must come before generic {activity} routes
    Route::get('/teamhub/chat', [TeamHubController::class, 'chatPage'])->name('teamhub.chat'); // Chat
    Route::get('/teamhub/chat/{user}', [TeamHubController::class, 'chatWithUser'])->name('teamhub.chat.user');
    Route::post('/teamhub/chat/{user}', [TeamHubController::class, 'sendMessageToUser'])->name('teamhub.chat.send');
    Route::delete('/teamhub/chat/delete/{id}', [TeamHubController::class, 'destroyMessage'])
    ->name('teamhub.chat.delete');


    // Activity-specific routes
    Route::post('/teamhub/{activity}/message', [TeamHubController::class, 'storeMessage'])->name('teamhub.message'); 
    Route::post('/teamhub/{activity}/file', [TeamHubController::class, 'uploadFile'])->name('teamhub.file');
    Route::get('/teamhub/{activity}', [TeamHubController::class, 'show'])->name('teamhub.show');
    Route::get('/teamhub/{activity}/edit', [TeamHubController::class, 'edit'])->name('teamhub.edit');
    Route::put('/teamhub/{activity}', [TeamHubController::class, 'update'])->name('teamhub.update');
    Route::delete('/teamhub/{activity}', [TeamHubController::class, 'destroy'])->name('teamhub.destroy');
    Route::delete('/teamhub/file/{fileId}', [TeamHubController::class, 'destroyFile'])->name('teamhub.file.destroy');

    Route::get('/unread-count', [TeamHubController::class, 'unreadCountForAdmin'])->name('unreadCount');
    Route::post('/mark-as-read/{user}', [TeamHubController::class, 'markAsRead'])->name('markAsRead');

    // Route::resource('schedule', ScheduleController::class);
    // Route::get('schedule/calendar', [ScheduleController::class, 'calendar'])->name('schedule.calendar');

    // Schedule routes (sans Route::resource)
    // Route::get('schedule', [ScheduleController::class, 'index'])->name('schedule.index');          // Liste des plannings
    // Route::get('schedule/create', [ScheduleController::class, 'create'])->name('schedule.create'); // Formulaire création
    // Route::post('schedule', [ScheduleController::class, 'store'])->name('schedule.store');         // Sauvegarde nouveau planning
    // Route::get('schedule/{schedule}', [ScheduleController::class, 'show'])->name('schedule.show'); // Afficher un planning
    // Route::get('schedule/{schedule}/edit', [ScheduleController::class, 'edit'])->name('schedule.edit'); // Formulaire édition
    // Route::put('schedule/{schedule}', [ScheduleController::class, 'update'])->name('schedule.update');  // Mise à jour
    // Route::delete('schedule/{schedule}', [ScheduleController::class, 'destroy'])->name('schedule.destroy'); // Suppression
    // Route pour le calendrier
    // Route::get('schedule/calendar', [ScheduleController::class, 'calendar'])->name('schedule.calendar');

    // Schedule routes (sans Route::resource)

    // ✅ Toujours d'abord les routes statiques
    Route::get('schedule/calendar', [ScheduleController::class, 'calendar'])->name('schedule.calendar');
    Route::get('/schedule/day', [ScheduleController::class, 'dayView'])->name('schedule.day');

    // Ensuite les autres
    Route::get('schedule', [ScheduleController::class, 'index'])->name('schedule.index');          // Liste des plannings
    Route::get('schedule/create', [ScheduleController::class, 'create'])->name('schedule.create'); // Formulaire création
    Route::post('schedule', [ScheduleController::class, 'store'])->name('schedule.store');         // Sauvegarde nouveau planning

    // Ces routes dynamiques doivent être après, sinon elles capturent tout
    Route::get('schedule/{schedule}', [ScheduleController::class, 'show'])->name('schedule.show'); // Afficher un planning
    Route::get('schedule/{schedule}/edit', [ScheduleController::class, 'edit'])->name('schedule.edit'); // Formulaire édition
    Route::put('schedule/{schedule}', [ScheduleController::class, 'update'])->name('schedule.update');  // Mise à jour
    Route::delete('schedule/{schedule}', [ScheduleController::class, 'destroy'])->name('schedule.destroy'); // Suppression

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

// Upload avatar
Route::post('/members/{user}/avatar', [MemberController::class, 'updateAvatar'])->name('members.avatar');


Route::get('/admin/progress-updates', [ProgressUpdateController::class, 'adminIndex'])->name('admin.progress.index');

    // Projects Routes
    Route::resource('projects', ProjectController::class);

    // Tasks Routes
    Route::resource('tasks', TaskController::class);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');
    // Affichage du détail d'une tâche pour admin
    Route::get('/tasks/{task}', [TaskController::class, 'showAdmin'])->name('tasks.show');


    // Progress Updates Routes
    Route::resource('progress-updates', ProgressUpdateController::class);

    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

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

     //les routespour teamhub
    Route::get('member/teamhub', [\App\Http\Controllers\Member\TeamHubController::class, 'index'])
         ->name('member.teamhub.index');

    Route::get('member/teamhub/chat', [\App\Http\Controllers\Member\TeamHubController::class, 'chat'])
         ->name('member.teamhub.chat');

    Route::get('member/teamhub/chat/{admin}', [\App\Http\Controllers\Member\TeamHubController::class, 'chatWithAdmin'])
         ->name('member.teamhub.chat.admin');

    Route::post('member/teamhub/chat/{admin}', [\App\Http\Controllers\Member\TeamHubController::class, 'sendMessageToAdmin'])
         ->name('member.teamhub.chat.send');

    Route::get('member/teamhub/{activity}', [\App\Http\Controllers\Member\TeamHubController::class, 'show'])
         ->name('member.teamhub.show');

    Route::delete('/member/teamhub/chat/{message}', [TeamHubController::class, 'destroyMessage'])
    ->name('member.teamhub.chat.delete');

    Route::post('/member/teamhub/chat/{admin}/mark-as-read', [TeamHubController::class, 'markAsRead'])
    ->name('member.teamhub.chat.markAsRead');

    Route::get('/member/unread-count', [\App\Http\Controllers\Member\TeamHubController::class, 'unreadCount'])
    ->middleware('auth')
    ->name('member.unreadCount');


});

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// pour blogs

Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{id}', [BlogController::class, 'show'])->name('blogs.show');


// Profile Routes for all authenticated users


require __DIR__.'/auth.php';
