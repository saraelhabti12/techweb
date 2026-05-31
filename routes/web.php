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
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\PersonalTodoController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\QuotationController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Member\ClientController;
use App\Http\Controllers\Member\AppointmentController;
use App\Http\Controllers\ClientAiController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\SharedFileController;
use App\Http\Controllers\GroupController;
use App\Models\Blog;
use App\Models\Template;


// Public Routes
Route::get('/', function () {
    $blogs = \App\Models\Blog::latest()->take(3)->get();
    $templates = \App\Models\Template::all();
    $creators = \App\Models\Creator::where('active', true)->where('visible_on_homepage', true)->latest()->get();
    $team = \App\Models\User::where('show_on_homepage', true)->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'blogs' => $blogs,
        'templates' => $templates,
        'creators' => $creators,
        'team' => \App\Http\Resources\UserResource::collection($team)->resolve(),
    ]);
});

Route::get('/AboutUs', fn() => Inertia::render('AboutUs', [
    'creators' => \App\Models\Creator::where('active', true)->get()
]))->name('AboutUs');
Route::get('/ContactUs', fn() => Inertia::render('ContactUs', [
    'creators' => \App\Models\Creator::where('active', true)->get()
]))->name('ContactUs');
Route::get('/Services', fn() => Inertia::render('Services'))->name('Services');
Route::get('/Projects', function () {
    return Inertia::render('Projects', ['templates' => Template::all()]);
})->name('Projects');

// Fallback Dashboard Redirect
Route::get('/dashboard', function () {
    $role = auth()->user()->role;
    if (in_array($role, ['admin', 'project_manager'])) {
        return redirect()->route('admin.dashboard');
    }
    
    // Default to member dashboard for all other roles for now, 
    // ensuring they have access in RoleMiddleware
    return redirect()->route('member.dashboard');
})->middleware(['auth'])->name('dashboard');

use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\ExpenseCategoryController;
use App\Http\Controllers\Admin\SalaryController;
use App\Http\Controllers\Admin\IncomeController;

use App\Http\Controllers\Admin\LeaveController as AdminLeaveController;
use App\Http\Controllers\Member\LeaveController as MemberLeaveController;

// Admin and Project Manager routes
Route::middleware(['auth', 'role:admin,project_manager'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');
   

    // Content Management
    Route::middleware(['permission:view blogs'])->resource('blogs', BlogController::class);
    Route::middleware(['permission:view templates'])->resource('templates', TemplateController::class);
    Route::middleware(['permission:view categories'])->resource('categories', CategoryController::class)->except(['show']);
    
    Route::middleware(['permission:view projects'])->group(function() {
        Route::resource('projects', ProjectController::class);
        Route::get('projects/client-history/{client}', [ProjectController::class, 'clientHistory'])->name('projects.clientHistory');
        Route::post('projects/{project}/status', [ProjectController::class, 'updateStatus'])->name('projects.updateStatus');
        
        // AI Project Advisor (Moved inside for consistency)
        Route::post('projects/{project}/ai-analyze', [\App\Http\Controllers\ProjectAiController::class, 'analyze'])->name('projects.ai-analyze');
        Route::get('projects/{project}/ai-latest', [\App\Http\Controllers\ProjectAiController::class, 'getLatest'])->name('projects.ai-latest');
    });

    Route::middleware(['permission:view tasks'])->resource('tasks', TaskController::class);
    
    // Shared Files
    Route::get('/shared-files', [SharedFileController::class, 'adminIndex'])->name('shared-files.index');
    Route::post('/shared-files', [SharedFileController::class, 'store'])->name('shared-files.store');
    Route::delete('/shared-files/{sharedFile}', [SharedFileController::class, 'destroy'])->name('shared-files.destroy');
    Route::get('/shared-files/{sharedFile}/download', [SharedFileController::class, 'download'])->name('shared-files.download');

    // Appointments
    Route::middleware(['permission:view appointments'])->group(function() {
        Route::get('/appointments', [AdminAppointmentController::class, 'index'])->name('appointments.index');
        Route::post('/appointments', [AdminAppointmentController::class, 'store'])->name('appointments.store');
        Route::post('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus'])->name('appointments.updateStatus');
        Route::get('/appointments/calendar', [AdminAppointmentController::class, 'calendar'])->name('appointments.calendar');
    });

    // CRM / Clients
    Route::middleware(['permission:view clients'])->group(function() {
        Route::get('clients/blacklist', [ClientController::class, 'blacklistIndex'])->name('clients.blacklist');
        Route::post('clients/{client}/add-to-contacts', [ClientController::class, 'addToContacts'])->name('clients.addToContacts');
        Route::post('clients/{client}/blacklist', [ClientController::class, 'blacklist'])->name('clients.blacklist.store');
        Route::post('clients/{client}/unblock', [ClientController::class, 'unblock'])->name('clients.unblock');
        Route::resource('clients', ClientController::class);
    });

    Route::middleware(['permission:view commercials'])->group(function() {
        Route::resource('commercials', \App\Http\Controllers\Admin\CommercialController::class);
    });

    // Creators Management
    Route::middleware(['permission:view creators'])->resource('creators', \App\Http\Controllers\Admin\CreatorController::class);


    // Financial Management
    Route::middleware(['permission:view quotes'])->group(function() {
        Route::resource('quotations', QuotationController::class);
        Route::post('quotations/{quotation}/duplicate', [QuotationController::class, 'duplicate'])->name('quotations.duplicate');
        Route::post('quotations/{quotation}/send-email', [QuotationController::class, 'sendEmail'])->name('quotations.send-email');
        Route::get('quotations/{quotation}/download-pdf', [QuotationController::class, 'downloadPdf'])->name('quotations.download-pdf');
        Route::post('quotations/{quotation}/convert-to-invoice', [QuotationController::class, 'convert-to-invoice']);
    });

    Route::middleware(['permission:view invoices'])->group(function() {
        Route::resource('invoices', InvoiceController::class);
        Route::post('invoices/{invoice}/send-email', [InvoiceController::class, 'sendEmail'])->name('invoices.send-email');
        Route::get('invoices/{invoice}/download-pdf', [InvoiceController::class, 'downloadPdf'])->name('invoices.download-pdf');
        Route::post('invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid'])->name('invoices.mark-paid');
    });

    // Finance Management (New)
    Route::middleware(['permission:edit finance'])->group(function() {
        Route::get('/finance/dashboard', [FinanceController::class, 'dashboard'])->name('finance.dashboard');
        Route::post('/finance/ai-analyze', [\App\Http\Controllers\Admin\FinanceAiController::class, 'analyze'])->name('finance.ai-analyze');
        Route::get('/finance/export-pdf', [FinanceController::class, 'exportPdf'])->name('finance.export-pdf');
        Route::get('/finance/export-excel', [FinanceController::class, 'exportExcel'])->name('finance.export-excel');
        
        Route::resource('expenses', ExpenseController::class);
        Route::resource('expense-categories', ExpenseCategoryController::class);
        Route::resource('salaries', SalaryController::class);
        Route::resource('incomes', IncomeController::class);
        Route::resource('leaves', AdminLeaveController::class)->only(['index', 'update']);
    });

    Route::middleware(['permission:edit finance'])->resource('payments', PaymentController::class)->only(['store', 'destroy']);

    // Customers / CRM (Contacts)
    Route::middleware(['permission:view contacts'])->group(function() {
        Route::get('/customers', [ContactController::class, 'index'])->name('customers.index');
        Route::get('/customers/{id}', [ContactController::class, 'show'])->name('customers.show');
        Route::post('/customers/{id}/mark-read', [ContactController::class, 'markRead'])->name('customers.markRead');
        Route::post('/customers/send-reply', [ContactController::class, 'sendReply'])->name('customers.sendReply');
        Route::delete('/customers/{id}', [ContactController::class, 'destroy'])->name('customers.destroy');
    });



    // Team Hub
    Route::middleware(['permission:view history'])->group(function() {
        Route::get('/teamhub', [TeamHubController::class, 'index'])->name('teamhub.index');
        Route::get('/teamhub/create', [TeamHubController::class, 'create'])->name('teamhub.create');
        Route::post('/teamhub', [TeamHubController::class, 'store'])->name('teamhub.store');
        Route::get('/teamhub/{id}', [TeamHubController::class, 'show'])->name('teamhub.show');
        Route::get('/teamhub/{id}/edit', [TeamHubController::class, 'edit'])->name('teamhub.edit');
        Route::delete('/teamhub/chat/delete/{id}', [TeamHubController::class, 'destroyMessage'])->name('teamhub.chat.delete');
    });

    Route::middleware(['permission:view chat'])->group(function() {
        Route::get('/teamhub/chat', [TeamHubController::class, 'chatPage'])->name('teamhub.chat');
        Route::get('/teamhub/chat/{user}', [TeamHubController::class, 'chatWithUser'])->name('teamhub.chat.user');
        Route::post('/teamhub/chat/{user}', [TeamHubController::class, 'sendMessageToUser'])->name('teamhub.chat.send');
    });

    // Schedule
    Route::middleware(['permission:view calendar'])->group(function() {
        Route::get('schedule/calendar', [ScheduleController::class, 'calendar'])->name('schedule.calendar');
        Route::resource('schedule', ScheduleController::class);
    });

    Route::get('/progress-updates', [ProgressUpdateController::class, 'adminIndex'])->name('progress.index');

    // Profile
    Route::get('/profile', [ProfileController::class, 'editAdmin'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'updateAdmin'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroyAdmin'])->name('profile.destroy');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');

    // Admin ONLY routes moved inside the admin prefix but wrapped in an additional role check if needed
    // However, since this group allows PMs, we might want to nest Admin-only stuff
    Route::middleware(['role:admin'])->group(function() {
        Route::resource('members', MemberController::class);
        Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
        Route::get('/attendance-dashboard', [AttendanceController::class, 'adminDashboard'])->name('members.attendance');
        Route::post('/members/{user}/avatar', [MemberController::class, 'updateAvatar'])->name('members.avatar');
    });
});

// Member routes
Route::middleware(['auth', 'role:member'])->prefix('member')->name('member.')->group(function () {
    Route::get('/dashboard', [MemberController::class, 'dashboard'])->name('dashboard');

    // Shared Files
    Route::get('/shared-files', [SharedFileController::class, 'memberIndex'])->name('shared-files.index');
    Route::get('/shared-files/{sharedFile}/download', [SharedFileController::class, 'download'])->name('shared-files.download');

    // CRM
    Route::resource('clients', ClientController::class);
    
    // Appointments
    Route::resource('appointments', AppointmentController::class)->only(['index', 'create', 'store']);

    // Tasks & Progress
    Route::get('/tasks', [TaskController::class, 'tasksIndex'])->name('tasks.index');
    Route::get('/tasks/{task}/progress', [TaskController::class, 'showTaskProgress'])->name('tasks.progress');
    Route::patch('/tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
    Route::resource('progress', ProgressUpdateController::class)->only(['index', 'create', 'store', 'destroy']);

    // Leave Management
    Route::get('/leaves', [MemberLeaveController::class, 'index'])->name('leaves.index');
    Route::post('/leaves', [MemberLeaveController::class, 'store'])->name('leaves.store');

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/qr', [AttendanceController::class, 'getQrCode'])->name('attendance.qr');
    Route::get('/my-attendance', [AttendanceController::class, 'myAttendance'])->name('myAttendance');
    Route::get('/attendance/scan/{token}', [AttendanceController::class, 'scan'])->name('attendance.scan');

    // Salary
    Route::get('/salary', [\App\Http\Controllers\Member\SalaryController::class, 'index'])->name('salary.index');
    Route::get('/salary/{salary}/download-payslip', [\App\Http\Controllers\Member\SalaryController::class, 'downloadPayslip'])->name('salary.download-payslip');

    // TeamHub
    Route::get('/teamhub', [\App\Http\Controllers\Member\TeamHubController::class, 'index'])->name('teamhub.index');
    Route::get('/teamhub/{id}', [TeamHubController::class, 'show'])
    ->name('teamhub.show');
    Route::get('/teamhub/{id}/edit', [TeamHubController::class, 'edit'])
    ->name('teamhub.edit');
    Route::get('/teamhub/chat', [\App\Http\Controllers\Member\TeamHubController::class, 'chat'])->name('teamhub.chat');
    Route::get('/teamhub/chat/{admin}', [\App\Http\Controllers\Member\TeamHubController::class, 'chatWithAdmin'])->name('teamhub.chat.admin');
    Route::post('/teamhub/chat/{admin}', [\App\Http\Controllers\Member\TeamHubController::class, 'sendMessageToAdmin'])->name('teamhub.chat.send');
    Route::get('/teamhub/{activity}', [\App\Http\Controllers\Member\TeamHubController::class, 'show'])->name('teamhub.show');
    Route::delete('/teamhub/chat/{message}', [TeamHubController::class, 'destroyMessage'])->name('teamhub.chat.delete');
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
});

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/blogs', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{id}', [BlogController::class, 'show'])->name('blogs.show');

// Public Creator Routes
Route::get('/creators', [\App\Http\Controllers\Admin\CreatorController::class, 'publicIndex'])->name('creators.index');
Route::get('/creators/{id}', [\App\Http\Controllers\Admin\CreatorController::class, 'publicShow'])->name('creators.show');

// Chat routes
Route::middleware(['auth'])->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/users', [ChatController::class, 'usersWithUnreadCount'])->name('chat.users');
    Route::get('/chat/messages/{user}', [ChatController::class, 'messages'])->name('chat.messages');
    Route::post('/chat/messages/{user}', [ChatController::class, 'store'])->name('chat.store');
    Route::post('/chat/mark-as-read/{user}', [ChatController::class, 'markAsRead'])->name('chat.markAsRead');
    Route::post('/chat/set-typing/{user}', [ChatController::class, 'setTyping'])->name('chat.setTyping');
});

use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ActivityController;

// Notification routes
Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount'])->name('notifications.unreadCount');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

Route::middleware(['auth'])->group(function () {
    // Activity History
    Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');

    // Heartbeat
    Route::post('/heartbeat', [ProfileController::class, 'heartbeat'])->name('heartbeat');

    // Personal Todo routes
    Route::get('/personal-todos', [PersonalTodoController::class, 'index'])->name('personal-todos.index');
    Route::post('/personal-todos', [PersonalTodoController::class, 'store'])->name('personal-todos.store');
    Route::patch('/personal-todos/{personalTodo}', [PersonalTodoController::class, 'update'])->name('personal-todos.update');
    Route::delete('/personal-todos/{personalTodo}', [PersonalTodoController::class, 'destroy'])->name('personal-todos.destroy');

    // Client File deletion
    Route::delete('/clients/files/{clientFile}', [ClientController::class, 'destroyFile'])->name('clients.files.destroy');

    // AI Client Assistant
    Route::post('/clients/{client}/ai-analyze', [ClientAiController::class, 'analyze'])->name('clients.ai-analyze');

    // AI Task Assistant
    Route::post('/tasks/{task}/ai-analyze', [\App\Http\Controllers\TaskAiController::class, 'analyze'])->name('tasks.ai-analyze');
});

// Group Chat routes
Route::middleware(['auth'])->group(function () {
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::get('/groups/{group}/messages', [GroupController::class, 'messages'])->name('groups.messages');
    Route::post('/groups/{group}/messages', [GroupController::class, 'sendMessage'])->name('groups.sendMessage');
});


require __DIR__.'/auth.php';
