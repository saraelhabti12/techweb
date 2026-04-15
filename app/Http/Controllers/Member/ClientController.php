<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'admin' || $user->role === 'project_manager') {
            $clients = Client::latest()->get();
        } else {
            $clients = $user->clients()->latest()->get();
        }

        return Inertia::render('Member/Clients/Index', [
            'clients' => ClientResource::collection($clients)->resolve(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Member/Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'whatsapp' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // max 2MB
            'notes' => 'nullable|string',
            'status' => 'required|in:prospect,interested,client,not_interested,pending',
            'contact_method' => 'required|in:whatsapp,call,meeting',
            'contact_date' => 'nullable|date',
            'files.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,png,jpeg|max:10240', // max 10MB per file
        ]);

        $data = $validated;
        unset($data['files']); // remove files from client data

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
        }

        $client = Auth::user()->clients()->create($data);

        // Handle multiple file uploads
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
}
