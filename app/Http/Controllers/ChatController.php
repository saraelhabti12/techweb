<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Activity;
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
        $authId = Auth::id();

        // Fetch ALL users except the current authenticated user
        // Order by latest interaction
        $users = User::where('id', '!=', $authId)
            ->get()
            ->map(function ($user) use ($authId) {
                // Get latest message with this user
                $latestMessage = Message::where(function ($query) use ($user, $authId) {
                    $query->where('sender_id', $authId)->where('receiver_id', $user->id);
                })->orWhere(function ($query) use ($user, $authId) {
                    $query->where('sender_id', $user->id)->where('receiver_id', $authId);
                })->latest()->first();

                $user->latest_message_time = $latestMessage ? $latestMessage->created_at : null;
                $user->unread_count = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $authId)
                    ->where('is_read', false)
                    ->count();
                
                // Add online status
                $user->is_online = $user->isOnline();
                
                return $user;
            })
            ->sortByDesc('latest_message_time')
            ->values();

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

        // Also mark messages as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

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

        Activity::log('Message Sent', "Sent message to: {$user->name}");

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
        $authId = Auth::id();

        $users = User::where('id', '!=', $authId)
            ->get()
            ->map(function ($user) use ($authId) {
                // Get latest message with this user
                $latestMessage = Message::where(function ($query) use ($user, $authId) {
                    $query->where('sender_id', $authId)->where('receiver_id', $user->id);
                })->orWhere(function ($query) use ($user, $authId) {
                    $query->where('sender_id', $user->id)->where('receiver_id', $authId);
                })->latest()->first();

                $user->latest_message_time = $latestMessage ? $latestMessage->created_at : null;
                $user->unread_count = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $authId)
                    ->where('is_read', false)
                    ->count();

                $user->is_online = $user->isOnline();

                return $user;
            })
            ->sortByDesc('latest_message_time')
            ->values();

        return response()->json($users);
    }
}
