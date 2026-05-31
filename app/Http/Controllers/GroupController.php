<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\GroupMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GroupController extends Controller
{
    /**
     * Display the group chat list.
     */
    public function index()
    {
        $groups = Auth::user()->groups()->with(['users', 'creator'])->get();
        $users = User::where('id', '!=', Auth::id())->orderBy('name', 'asc')->get();

        return Inertia::render('Chat/Groups', [
            'groups' => $groups,
            'allUsers' => $users
        ]);
    }

    /**
     * Create a new group.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $group = Group::create([
            'name' => $request->name,
            'description' => $request->description,
            'creator_id' => Auth::id(),
        ]);

        // Attach selected users + the creator
        $userIds = array_unique(array_merge($request->user_ids, [Auth::id()]));
        $group->users()->attach($userIds);

        return response()->json($group->load('users'));
    }

    /**
     * Get messages for a specific group.
     */
    public function messages(Group $group)
    {
        // Ensure user belongs to the group
        if (!$group->users()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $messages = $group->messages()->with('user')->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    /**
     * Store a new group message.
     */
    public function sendMessage(Request $request, Group $group)
    {
        $request->validate([
            'message' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB
            'type' => 'required|in:text,image,file'
        ]);

        // Ensure user belongs to the group
        if (!$group->users()->where('user_id', Auth::id())->exists()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'user_id' => Auth::id(),
            'message' => $request->message,
            'type' => $request->type,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('group_chat_attachments', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            if (!$data['message']) {
                $data['message'] = $data['file_name'];
            }
        }

        $message = $group->messages()->create($data);

        return response()->json($message->load('user'));
    }
}
