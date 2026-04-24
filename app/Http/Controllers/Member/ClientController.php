<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Models\ClientFile;
use App\Models\Activity;
use App\Models\Quotation;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $search = $request->input('search');

        $query = Client::with('files')->where('is_blacklisted', false);
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($user->role === 'admin' || $user->role === 'project_manager') {
            $clients = $query->latest()->get();
        } else {
            $clients = $user->clients()->with('files')
                ->where('is_blacklisted', false)
                ->when($search, function($q) use ($search) {
                    $q->where(function($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                          ->orWhere('company_name', 'like', "%{$search}%")
                          ->orWhere('phone', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->latest()->get();
        }

        return Inertia::render('Member/Clients/Index', [
            'clients' => ClientResource::collection($clients)->resolve(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function blacklistIndex(Request $request)
    {
        Gate::authorize('viewAny', Client::class);

        $search = $request->input('search');
        $query = Client::where('is_blacklisted', true);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $clients = $query->latest()->get();

        return Inertia::render('Admin/Clients/Blacklist', [
            'clients' => ClientResource::collection($clients)->resolve(),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function addToContacts(Client $client)
    {
        // Prevent duplicate contacts for the same client
        if (\App\Models\Contact::where('client_id', $client->id)->exists()) {
            return back()->with('error', 'Client is already in contacts.');
        }

        \App\Models\Contact::create([
            'client_id' => $client->id,
            'full_name' => $client->name,
            'contact_number' => $client->phone,
            'company_name' => $client->company_name,
            'email' => $client->email ?? 'no-email@example.com',
            'message' => "Automatically added from CRM clients. Notes: {$client->notes}",
            'is_read' => true,
        ]);

        Activity::log('Client Exported', "Exported client {$client->name} to Contacts");

        return back()->with('success', 'Client added to contacts successfully!');
    }

    public function blacklist(Request $request, Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('update', $client);
        }

        $request->validate([
            'reason' => 'required|string|max:1000',
        ]);

        $client->update([
            'is_blacklisted' => true,
            'blacklist_reason' => $request->reason,
        ]);

        Activity::log('Client Blacklisted', "Blacklisted client: {$client->name}. Reason: {$request->reason}");

        return back()->with('success', 'Client added to blacklist.');
    }

    public function unblock(Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('update', $client);
        }

        $client->update([
            'is_blacklisted' => false,
            'blacklist_reason' => null,
        ]);

        Activity::log('Client Unblocked', "Unblocked client: {$client->name}");

        return back()->with('success', 'Client unblocked successfully.');
    }

    public function show(Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('view', $client);
        }

        $client->load(['user', 'files', 'projects.category', 'appointments.user', 'quotations', 'invoices.payments']);

        return Inertia::render('Member/Clients/Show', [
            'client' => (new ClientResource($client))->resolve(),
            // Manual injection of projects and appointments since resource might not have them
            'projects' => $client->projects,
            'appointments' => $client->appointments,
            'quotations' => $client->quotations,
            'invoices' => $client->invoices,
            'financials' => [
                'total_quotations' => $client->quotations()->count(),
                'accepted_quotations' => $client->quotations()->where('status', 'accepted')->count(),
                'invoices_count' => $client->invoices()->count(),
                'total_revenue' => $client->invoices()->sum('amount_paid'),
                'unpaid_amount' => $client->invoices()->where('status', '!=', 'paid')->sum(DB::raw('total - amount_paid')),
                'payment_history' => Payment::whereIn('invoice_id', $client->invoices()->pluck('id'))->with('invoice')->latest()->get(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Member/Clients/Create');
    }

    public function store(Request $request)
    {
        \Log::info('Client Store Request received', $request->except(['logo', 'files']));

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|string|max:50',
            'social_links.*.url' => 'required|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'notes' => 'nullable|string',
            'status' => 'required|in:prospect,interested,client,not_interested,pending',
            'contact_method' => 'required|in:whatsapp,call,meeting',
            'contact_date' => 'nullable|date',
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240',
        ]);

        $data = $validated;
        unset($data['files']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
            \Log::info('Logo stored at: ' . $data['logo']);
        }

        $client = Auth::user()->clients()->create($data);
        Activity::log('Client Added', "Added client: {$client->name}");
        \Log::info('Client created with ID: ' . $client->id);

        // Handle multiple file uploads
        if ($request->hasFile('files')) {
            $uploadedFiles = $request->file('files');
            // Ensure $uploadedFiles is an array if multiple=true
            if (!is_array($uploadedFiles)) {
                $uploadedFiles = [$uploadedFiles];
            }
            
            \Log::info('Files found in request: ' . count($uploadedFiles));
            foreach ($uploadedFiles as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('clients/files', 'public');
                    $client->files()->create([
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'type' => $file->getClientMimeType(),
                    ]);
                    \Log::info('File stored at: ' . $path);
                }
            }
        }

        $isAdmin = Auth::user()->role === 'admin' || Auth::user()->role === 'project_manager';
        $redirectRoute = $isAdmin ? 'admin.clients.index' : 'member.clients.index';
        
        return redirect()->route($redirectRoute)->with('success', 'Client added successfully!');
    }

    public function edit(Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('update', $client);
        }

        return Inertia::render('Member/Clients/Edit', [
            'client' => (new ClientResource($client))->resolve(),
        ]);
    }

    public function update(Request $request, Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('update', $client);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required|string|max:50',
            'social_links.*.url' => 'required|url|max:255',
            'logo' => 'nullable|image|max:2048',
            'notes' => 'nullable|string',
            'status' => 'required|in:prospect,interested,client,not_interested,pending',
            'contact_method' => 'required|in:whatsapp,call,meeting',
            'contact_date' => 'nullable|date',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $data = $validated;
        unset($data['files']);

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
        }

        $client->update($data);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('clients/files', 'public');
                $client->files()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'type' => $file->getClientMimeType(),
                ]);
            }
        }

        $redirectRoute = Auth::user()->role === 'admin' || Auth::user()->role === 'project_manager' ? 'admin.clients.index' : 'member.clients.index';
        
        try {
            return redirect()->route($redirectRoute)->with('success', 'Client updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('success', 'Client updated successfully.');
        }
    }

    public function destroy(Client $client)
    {
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('delete', $client);
        }

        $client->delete();

        $redirectRoute = Auth::user()->role === 'admin' || Auth::user()->role === 'project_manager' ? 'admin.clients.index' : 'member.clients.index';
        
        try {
            return redirect()->route($redirectRoute)->with('success', 'Client deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('success', 'Client deleted.');
        }
    }

    public function destroyFile(ClientFile $clientFile)
    {
        // Authorization (using the client's update policy)
        if (Auth::user()->role !== 'admin' && Auth::user()->role !== 'project_manager') {
            Gate::authorize('update', $clientFile->client);
        }

        // Delete from storage
        if (Storage::disk('public')->exists($clientFile->file_path)) {
            Storage::disk('public')->delete($clientFile->file_path);
        }

        // Delete record
        $clientFile->delete();

        return back()->with('success', 'File deleted successfully.');
    }
}
