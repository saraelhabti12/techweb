<?php

namespace App\Http\Controllers;

use App\Models\ProgressUpdate;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProgressUpdateController extends Controller
{
    public function index()
    {
        $progressUpdates = ProgressUpdate::where('user_id', auth()->id())
            ->with('task')
            ->latest()
            ->get();

        return Inertia::render('Member/ProgressUpdates/Index', [
            'progressUpdates' => $progressUpdates,
            'status' => session('status'),
        ]);
    }

    public function adminIndex()
{
    $progressUpdates = ProgressUpdate::with(['task', 'user']) // Make sure `user()` is defined in the model
        ->latest()
        ->get();

    return Inertia::render('Admin/ProgressUpdates/Index', [
        'auth' => [
        'user' => auth()->user(),
    ],
        'progressUpdates' => $progressUpdates,
    ]);
}


    public function create()
    {
        $tasks = Task::where('assigned_to', auth()->id())->get();
        return inertia('Member/ProgressUpdates/Create', compact('tasks'));
    }


    public function store(Request $request)
    {

        \Log::info($request->all());
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'type' => 'required|in:text,file,link',
            'content' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpg,jpeg,png,pdf,docx',
            'url' => 'nullable|url',
        ]);

        $progress = new ProgressUpdate();
        $progress->task_id = $request->task_id;
        $progress->user_id = auth()->id();
        $progress->type = $request->type;
        $progress->content = $request->content;
        $progress->url = $request->url;

        // Handle file upload
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('progress', 'public');
            $progress->file_path = $filePath;

        }

        $progress->save();

        return redirect()->route('member.progress.index')->with('status', 'Progress added!');

    }



    public function destroy(ProgressUpdate $progress)
    {
        $progress->delete();

        return back()->with('success', 'Progress deleted successfully!');
    }
}

