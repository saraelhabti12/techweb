<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamHubActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\TeamHubFile;
use Illuminate\Support\Facades\Storage;
use App\Models\TeamHubMessage;
use App\Mail\ImportantNotificationMail;
use Illuminate\Support\Facades\Mail;


class TeamHubController extends Controller
{
    public function index() 
    {
        $activities = TeamHubActivity::with([
            'files',
            'messages.user',   
            'members'
        ])->get();

        return Inertia::render('Admin/TeamHub/Index', [
            'activities' => $activities,
        ]);
    }


    public function store(Request $request) 
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'comment' => 'nullable|string',
            'members' => 'required|array',
            'members.*' => 'exists:users,id',
            'files.*' => 'file|max:10240', // 10MB max
        ]);

         // Crée l'activité
        $activity = TeamHubActivity::create([
            'title' => $request->title,
            'content' => $request->comment,
            'admin_id' => Auth::id(),
        ]);

       
        if ($request->members) {
            $activity->members()->attach($request->members);
            
            // Notify members about new activity
            $members = User::whereIn('id', $request->members)->get();
            $notificationData = [
                'title' => 'New Activity: ' . $activity->title,
                'message' => 'A new activity has been created in Team Hub.',
                'type' => 'teamhub',
                'id' => $activity->id
            ];
            \Illuminate\Support\Facades\Notification::send($members, new \App\Notifications\GenericNotification($notificationData));

            // Send Email to Admin (Requirement)
            try {
                Mail::to('techweb.ma@gmail.com')->send(new ImportantNotificationMail($notificationData));
            } catch (\Exception $e) {
                \Log::error('Failed to send important notification mail to admin: ' . $e->getMessage());
            }
        }

        // Gère les fichiers
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('activities', 'public'); // stocke dans storage/app/public/activities
                $activity->files()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }


       return redirect()->route('admin.teamhub.index')
        ->with('success', 'Activity created successfully');
    }



    public function storeMessage(Request $request, TeamHubActivity $activity)
    {
        $message = $activity->messages()->create([
            'user_id' => Auth::id(),       // ✅ correction
            'message' => $request->message, // ✅ correction
        ]);

        return back();
    }

    // public function destroyMessage($id)
    // {
    //     $message = TeamHubMessage::findOrFail($id);
    //     $message->delete();

    //     return response()->json(['success' => true]);
    // }
    public function destroyMessage($id)
{
    $message = \App\Models\TeamHubMessage::find($id);

    if (!$message) {
        return response()->json(['error' => 'Message not found'], 404);
    }

    $message->delete();

    return response()->json(['success' => true]);
}



    public function uploadFile(Request $request, TeamHubActivity $activity) 
    {
        $request->validate([
            'file' => 'required|file|max:10240',
            'visibility' => 'required|in:all,selected',
            'members' => 'array', // si visibilité = selected
        ]);

        $file = $request->file('file');
        $path = $file->store('teamhub_files', 'public');

        $activity->files()->create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'uploaded_by' => Auth::id(),
            'visibility'  => $request->visibility,
        ]);

        // Associer les membres si visibilité = selected
        if ($request->visibility === 'selected' && $request->members) {
            $file->authorizedMembers()->sync($request->members);
        }

        return back();
    }


    public function create() 
    {
        // Récupérer tous les utilisateurs dont le rôle est 'member'
        $members = User::where('role', 'member')->get();

        return Inertia::render('Admin/TeamHub/AddActivity', [
            'members' => $members
        ]);
    }



    public function chatPage() 
    {
        $members = User::where('role', 'member')->get(); // tous les membres
        return Inertia::render('Admin/TeamHub/Chat', [
            'members' => $members,
        ]);
        
    }

    public function chatWithUser (User $user)
    {
        $members = User::where('role', 'member')->get();
        $messages = \App\Models\TeamHubMessage::with('user')
            ->where(function($q) use ($user) {
                $q->where('user_id', Auth::id())->where('receiver_id', $user->id);
            })
            ->orWhere(function($q) use ($user) {
                $q->where('user_id', $user->id)->where('receiver_id', Auth::id());
            })
            ->orderBy('created_at', 'asc')
            ->get();
        return Inertia::render('Admin/TeamHub/Chat', [
            'members' => $members,
            'messages' => $messages,
            'user' => $user,
        ]);
    }

   
    public function sendMessageToUser(Request $request, User $user)
    {
        $request->validate(['message' => 'required|string']);

        $message = \App\Models\TeamHubMessage::create([
            'user_id'     => Auth::id(),
            'receiver_id' => $user->id,
            'message'     => $request->message,
            'activity_id' => null, // toujours null en privé
        ]);

        // Send notification
        $user->notify(new \App\Notifications\MessageReceived($message));

    if ($request->wantsJson()) {
        return response()->json([
            'id'          => $message->id,
            'message'     => $message->message,
            'user_id'     => $message->user_id,
            'receiver_id' => $message->receiver_id,
            'created_at'  => $message->created_at->toISOString(), // ✅ FIX
            'user'        => [
                'id'     => Auth::id(),
                'name'   => Auth::user()->name,
                'avatar' => Auth::user()->avatar 
                    ? asset('storage/avatars/' . Auth::user()->avatar) 
                    : null, // ✅ FIX
            ],
        ]);
    }

    return redirect()->route('admin.teamhub.chat.user', $user->id);
}


    public function show(TeamHubActivity $activity)
    {
        $activity->load(['files', 'messages.user', 'members']);
        return Inertia::render('Admin/TeamHub/Show', ['item' => $activity]);
    }

    // Affiche le formulaire d'édition avec l'activité existante
    public function edit(TeamHubActivity $activity)
    {
        $members = User::where('role', 'member')->get();
        $activity->load(['files', 'members']); // charger fichiers et membres

        return Inertia::render('Admin/TeamHub/EditActivity', [
            'activity' => $activity,
            'members' => $members,
        ]);
    }


    // Met à jour l'activité
    public function update(Request $request, TeamHubActivity $activity)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'comment' => 'nullable|string',
            'members' => 'required|array',
            'members.*' => 'exists:users,id',
            'files.*' => 'file|max:10240',
        ]);

        // Mettre à jour titre et contenu
        $activity->update([
            'title' => $request->title,
            'content' => $request->comment,
        ]);

        // Synchroniser les membres
        $activity->members()->sync($request->members);

        // Ajouter de nouveaux fichiers si upload
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('activities', 'public');
                $activity->files()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }
        }

        return redirect()->route('admin.teamhub.index')
                        ->with('success', 'Activity updated successfully');
    }


    // Supprime une activité et ses relations
    public function destroy(TeamHubActivity $activity)
    {
        // Supprimer les fichiers physiques et enregistrements liés
        foreach ($activity->files as $file) {
            if ($file->file_path && Storage::disk('public')->exists($file->file_path)) {
                Storage::disk('public')->delete($file->file_path);
            }
            $file->delete();
        }

        // Supprimer les messages liés (si relation existe)
        if (method_exists($activity, 'messages')) {
            $activity->messages()->delete();
        }

        // Détacher les membres
        if (method_exists($activity, 'members')) {
            $activity->members()->detach();
        }

        // Supprimer l'activité
        $activity->delete();

        return redirect()->route('admin.teamhub.index')
            ->with('success', 'Activity deleted successfully');
    }


    public function destroyFile($fileId)
    {
        // Récupère le fichier depuis le modèle
        $file = \App\Models\TeamHubFile::findOrFail($fileId);

        // Supprime le fichier physique si il existe
        if ($file->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($file->file_path)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($file->file_path);
        }

        // Supprime l'enregistrement dans la base
        $file->delete();

        return back()->with('success', 'File deleted successfully');
    }

    public function unreadCountForAdmin()
    {
        $admin = Auth::user();

        $counts = User::where('role', 'member')->get()->mapWithKeys(function($member) use ($admin) {
            $count = TeamHubMessage::where('user_id', $member->id)
                ->where('receiver_id', $admin->id)
                ->where('is_read', false)
                ->count();

            return [$member->id => $count];
        });

        return response()->json($counts);
    }

    public function markAsRead($userId)
{
    $adminId = Auth::id();

    TeamHubMessage::where('user_id', $userId)
        ->where('receiver_id', $adminId)
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return response()->json(['status' => 'ok']);
}


}


