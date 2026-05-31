<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\TeamHubActivity;
use App\Models\TeamHubMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TeamHubController extends Controller
{
    // Liste toutes les activités autorisées pour le membre
    public function index()
    {
        $member = Auth::user();

        $activities = $member->teamHubActivities()
                             ->with(['files', 'messages.user', 'admin'])
                             ->get();

        return Inertia::render('Member/TeamHub/Index', [
            'activities' => $activities
        ]);
    }

    // Affiche le détail d'une activité
    public function show(TeamHubActivity $activity)
    {
        $member = Auth::user();

        // Vérifie que le membre est autorisé
        if (! $activity->members->contains($member->id)) {
            abort(403, 'Vous n’êtes pas autorisé à voir cette activité.');
        }

        $activity->load(['files', 'messages.user', 'admin']);

        return Inertia::render('Member/TeamHub/Show', [
            'activity' => $activity
        ]);
    }

    // Page de chat pour les membres
    // public function chat()
    // {
    //     $member = Auth::user();
        
    //     // Récupérer tous les admins pour le chat
    //     $admins = User::where('role', 'admin')->get();
        
    //     return Inertia::render('Member/TeamHub/Chat', [
    //         'admins' => $admins
    //     ]);
    // }

    // public function chat()
    // {
    //     $member = Auth::user();

    //     // Récupérer tous les admins
    //     $admins = User::where('role', 'admin')->get();

    //     // Calculer le nombre de messages non lus pour chaque admin
    //     $unreadCounts = [];
    //     foreach ($admins as $admin) {
    //         $count = \App\Models\TeamHubMessage::where('receiver_id', $member->id)
    //                     ->where('user_id', $admin->id)
    //                     ->where('is_read', false)
    //                     ->count();

    //         $unreadCounts[$admin->id] = $count;
    //     }

    //     return Inertia::render('Member/TeamHub/Chat', [
    //         'admins' => $admins,
    //         'unreadCounts' => $unreadCounts
    //     ]);
    // }

    public function chat()
{
    $member = Auth::user();
    $admins = User::where('role', 'admin')->get()->unique('name')->values();

    $unreadCounts = [];
    foreach ($admins as $admin) {
        $unreadCounts[$admin->id] = TeamHubMessage::where('user_id', $admin->id)
            ->where('receiver_id', $member->id)
            ->where('is_read', false)
            ->count();
    }

    return Inertia::render('Member/TeamHub/Chat', [
        'admins' => $admins,
        'unreadCounts' => $unreadCounts
    ]);
}



    


    // public function chatWithAdmin(User $admin)
    // {
    //     $member = Auth::user();

    //     $messages = \App\Models\TeamHubMessage::with('user')
    //         ->where(function($q) use ($admin, $member) {
    //             $q->where('user_id', $member->id)->where('receiver_id', $admin->id);
    //         })
    //         ->orWhere(function($q) use ($admin, $member) {
    //             $q->where('user_id', $admin->id)->where('receiver_id', $member->id);
    //         })
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     if (request()->wantsJson()) {
    //         return response()->json([
    //             'messages' => $messages
    //         ]);
    //     }

    //     return Inertia::render('Member/TeamHub/Chat', [
    //         'messages' => $messages,
    //         'admin' => $admin
    //     ]);
    // }

    // public function chatWithAdmin(User $admin)
    // {
    //     $member = Auth::user();

    //     // Récupérer tous les messages entre le membre et cet admin
    //     $messages = \App\Models\TeamHubMessage::with('user')
    //         ->where(function ($q) use ($admin, $member) {
    //             $q->where('user_id', $member->id)
    //             ->where('receiver_id', $admin->id);
    //         })
    //         ->orWhere(function ($q) use ($admin, $member) {
    //             $q->where('user_id', $admin->id)
    //             ->where('receiver_id', $member->id);
    //         })
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     // ✅ Compter les messages non lus de l'admin
    //     $unreadCount = \App\Models\TeamHubMessage::where('user_id', $admin->id)
    //         ->where('receiver_id', $member->id)
    //         ->where('is_read', false)
    //         ->count();

    //     // ✅ Marquer les messages de l’admin comme lus
    //     \App\Models\TeamHubMessage::where('user_id', $admin->id)
    //         ->where('receiver_id', $member->id)
    //         ->where('is_read', false)
    //         ->update(['is_read' => true]);

    //     if (request()->wantsJson()) {
    //         return response()->json([
    //             'messages' => $messages,
    //             'unread_count' => $unreadCount,
    //         ]);
    //     }

    //     return Inertia::render('Member/TeamHub/Chat', [
    //         'messages' => $messages,
    //         'admin' => $admin,
    //         'unreadCount' => $unreadCount,
    //     ]);
    // }

    public function chatWithAdmin(User $admin)
{
    $member = Auth::user();

    // Tous les messages entre le membre et l'admin
    $messages = TeamHubMessage::with('user')
        ->where(function ($q) use ($admin, $member) {
            $q->where('user_id', $member->id)
              ->where('receiver_id', $admin->id);
        })
        ->orWhere(function ($q) use ($admin, $member) {
            $q->where('user_id', $admin->id)
              ->where('receiver_id', $member->id);
        })
        ->orderBy('created_at', 'asc')
        ->get();

    // Compter messages non lus de l'admin
    $unreadCount = TeamHubMessage::where('user_id', $admin->id)
        ->where('receiver_id', $member->id)
        ->where('is_read', false)
        ->count();

    // Marquer comme lus
    TeamHubMessage::where('user_id', $admin->id)
        ->where('receiver_id', $member->id)
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return response()->json([
        'messages' => $messages,
        'unread_count' => $unreadCount,
    ]);
}


    public function markAsRead(User $admin)
{
    $member = Auth::user();

    // Mettre à jour tous les messages non lus de cet admin vers ce membre
    \App\Models\TeamHubMessage::where('user_id', $admin->id)
        ->where('receiver_id', $member->id)
        ->where('is_read', false) // assure-toi d'avoir un champ `read` booléen
        ->update(['is_read' => true]);

    return response()->json(['success' => true]);
}


    // Envoyer un message à un admin
    public function sendMessageToAdmin(Request $request, User $admin)
    {
        $request->validate(['message' => 'required|string']);

        $message = \App\Models\TeamHubMessage::create([
            'user_id'     => Auth::id(),
            'receiver_id' => $admin->id,
            'message'     => $request->message,
            'activity_id' => null,
            'is_read'     => false,
        ]);

        // Notify admin
        $admin->notify(new \App\Notifications\MessageReceived($message));

        return response()->json($message->load('user'));
    }

    public function destroyMessage($id)
    {
        $message = TeamHubMessage::findOrFail($id);
        $message->delete();

        return response()->json(['success' => true]);
    }

    public function unreadCount()
    {
        $member = Auth::user();

        // Compter tous les messages non lus envoyés par les admins à ce membre
        $count = \App\Models\TeamHubMessage::where('receiver_id', $member->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }


}
