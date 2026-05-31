<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;

class ChatController extends Controller
{
    /**
     * Display the chat page with all users.
     */
    public function index()
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

                $user->latest_message = $latestMessage ? [
                    'content' => $latestMessage->message,
                    'type' => $latestMessage->type,
                    'time' => $latestMessage->created_at,
                    'is_me' => $latestMessage->sender_id === $authId,
                    'is_read' => $latestMessage->is_read
                ] : null;

                $user->unread_count = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $authId)
                    ->where('is_read', false)
                    ->count();
                
                $user->is_online = $user->isOnline();
                $user->last_seen_formatted = $user->last_seen ? $user->last_seen->diffForHumans() : 'Never';
                $user->is_typing = Cache::has("user-typing-{$user->id}-to-{$authId}");
                
                return $user;
            })
            ->sortByDesc(function($user) {
                return $user->latest_message ? $user->latest_message['time']->timestamp : 0;
            })
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
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

        return response()->json($messages);
    }

    /**
     * Store a new message.
     */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'message' => 'nullable|string',
            'file' => 'nullable|file|max:10240', // 10MB
            'type' => 'required|in:text,image,file'
        ]);

        $data = [
            'sender_id' => Auth::id(),
            'receiver_id' => $user->id,
            'message' => $request->message,
            'type' => $request->type,
            'is_read' => false,
            'delivered_at' => now() // Assuming immediate delivery for this simple implementation
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('chat_attachments', 'public');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
            if (!$data['message']) {
                $data['message'] = $data['file_name'];
            }
        }

        $message = Message::create($data);

        Activity::log('Message Sent', "Sent {$request->type} to: {$user->name}");

        $user->notify(new \App\Notifications\MessageReceived($message));

        return response()->json($message);
    }

    /**
     * Set typing status.
     */
    public function setTyping(Request $request, User $user)
    {
        $authId = Auth::id();
        if ($request->is_typing) {
            Cache::put("user-typing-{$authId}-to-{$user->id}", true, now()->addSeconds(5));
        } else {
            Cache::forget("user-typing-{$authId}-to-{$user->id}");
        }

        return response()->json(['status' => 'success']);
    }

    /**
     * Mark all messages from a specific user as read.
     */
    public function markAsRead(User $user)
    {
        Message::where('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);

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

                $user->latest_message = $latestMessage ? [
                    'content' => $latestMessage->message,
                    'type' => $latestMessage->type,
                    'time' => $latestMessage->created_at,
                    'is_me' => $latestMessage->sender_id === $authId,
                    'is_read' => $latestMessage->is_read
                ] : null;

                $user->unread_count = Message::where('sender_id', $user->id)
                    ->where('receiver_id', $authId)
                    ->where('is_read', false)
                    ->count();

                $user->is_online = $user->isOnline();
                $user->last_seen_formatted = $user->last_seen ? $user->last_seen->diffForHumans() : 'Never';
                $user->is_typing = Cache::has("user-typing-{$user->id}-to-{$authId}");

                return $user;
            })
            ->sortByDesc(function($user) {
                return $user->latest_message ? $user->latest_message['time']->timestamp : 0;
            })
            ->values();

        return response()->json($users);
    }
}
