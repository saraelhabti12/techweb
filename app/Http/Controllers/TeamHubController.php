<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TeamHubItem;
use App\Models\TeamHubMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TeamHubController extends Controller
{
    public function index()
    {
        // Admin: voir tout
        $items = TeamHubItem::with(['users:id,name','messages.user:id,name','admin:id,name'])
                 ->latest()
                 ->get();

        $members = User::where('role','member')->select('id','name')->get();

        return Inertia::render('Admin/TeamHub/Index', [
            'items' => $items,
            'members' => $members,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
            'users' => 'required|array',
            'users.*' => 'exists:users,id',
        ]);

        $path = null;
        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('teamhub', 'public');
        }

        $item = TeamHubItem::create([
            'title' => $request->title,
            'content' => $request->content,
            'file_path' => $path,
            'admin_id' => Auth::id(),
        ]);

        $item->users()->attach($request->users);

        return redirect()->back()->with('success', 'Item shared successfully.');
    }

    public function show(TeamHubItem $teamhubItem)
    {
        $teamhubItem->load(['users:id,name','messages.user:id,name','admin:id,name']);
        return Inertia::render('Admin/TeamHub/Show', [
            'item' => $teamhubItem
        ]);
    }

    public function storeMessage(Request $request, TeamHubItem $teamhubItem)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $message = TeamHubMessage::create([
            'teamhub_item_id' => $teamhubItem->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        // Retour simple (Inertia/redirect). Tu peux retourner JSON si tu veux fetch via AJAX.
        return redirect()->back();
    }

    public function download(TeamHubItem $teamhubItem)
    {
        if (!$teamhubItem->file_path) abort(404);
        return Storage::disk('public')->download($teamhubItem->file_path);
    }
}
