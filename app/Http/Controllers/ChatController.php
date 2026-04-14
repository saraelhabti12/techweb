<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    /**
     * Display the chat page with all users.
     */
    public function index()
    {
        // Fetch ALL users except the current authenticated user
        $users = User::where('id', '!=', Auth::id())
            ->orderBy('name', 'asc')
            ->get();
        
        // Add unread count for each user to show in the sidebar
        $users->map(function ($user) {
            $user->unread_count = Message::where('sender_id', $user->id)
                ->where('receiver_id', Auth::id())
                ->where('is_read', false)
                ->count();
            return $user;
        });

        return Inertia::render('Chat/Index', [
            'users' => $users
        ]);
    }

    /**
     * Get messages between the authenticated user and another user.
     */
    public function messages(User $user)
    {
        $messages = Message::where(function ($query) use ($user) {
            $query->where('sender_id', Auth::id())
                ->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($user) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', Auth::id());
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    /**
     * Store a new message.
     */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'message' => $request->message,
            'is_read' => false
        ]);

        // Send notification to the receiver
        $user->notify(new \App\Notifications\MessageReceived($message));

        return response()->json($message);
    }

    /**
     * Mark all messages from a specific user as read.
     */
    public function markAsRead(User $user)
    {
        Message::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['status' => 'success']);
    }

    /**
     * Fetch all users with their unread message counts (for polling).
     */
    public function usersWithUnreadCount()
    {
        $users = User::where('id', '!=', Auth::id())
            ->orderBy('name', 'asc')
            ->get();
        
        $users->map(function ($user) {
            $user->unread_count = Message::where('sender_id', $user->id)
                ->where('receiver_id', Auth::id())
                ->where('is_read', false)
                ->count();
            return $user;
        });

        return response()->json($users);
    }
}
