<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendContactNotification;
use App\Mail\SendReplyToCustomer;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Quand un visiteur envoie un message
        $data = $request->validate([
            'full_name'      => 'required|string|max:255',
            'contact_number' => 'required|string|max:255',
            'company_name'   => 'nullable|string|max:255',
            'email'          => 'required|email',
            'services'       => 'nullable|array',
            'message'        => 'nullable|string',
            'needs_creator'  => 'boolean',
            'selected_creators' => 'nullable|array',
        ]);

         $contact = Contact::create($data);

         // Envoi vers un email externe (Gmail par ex.)
        try {
            Mail::to('techweb.ma@gmail.com')->send(new SendContactNotification($contact));
        } catch (\Exception $e) {
            // Log or ignore
        }

        return redirect()->back()->with('success', 'Your message has been sent!');
    }

     // Liste des messages pour l'admin
     // Admin: liste des messages pour le bell
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        // Build query
        $query = Contact::orderBy('is_read')->latest();
        
        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }
        
        $messages = $query->get();
        $unreadCount = Contact::where('is_read', false)->count();

        return Inertia::render('Admin/Customer/Index', [
            'messages' => $messages,
            'unreadCount' => $unreadCount,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }


    // Voir un message et le marquer comme lu
    public function show($id)
    {
        $message = Contact::findOrFail($id);

        if (!$message->is_read) {
            $message->update(['is_read' => true]);
        }

        // Fetch creators if they were selected
        $selectedCreators = [];
        if ($message->needs_creator && $message->selected_creators) {
            $selectedCreators = \App\Models\Creator::whereIn('id', $message->selected_creators)->get();
        }

        return Inertia::render('Admin/Customer/Show', [
            'message' => $message,
            'selectedCreators' => $selectedCreators
        ]);
    }

    // Marquer un message comme lu via POST
    public function markRead($id)
    {
        $message = Contact::findOrFail($id);
        if (!$message->is_read) {
            $message->update(['is_read' => true]);
         }

        return redirect()->back();
    }

    // Envoyer une réponse au client
    public function sendReply(Request $request)
{
    $data = $request->validate([
        'to' => 'required|email',
        'body' => 'required|string',
    ]);

    Mail::to($data['to'])->send(new SendReplyToCustomer($data['body']));

    return redirect()->back()->with('success', 'Message envoyé !');
}

    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }


}
