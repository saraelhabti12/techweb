<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Auth::user()->clients()->latest()->get();

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
            'phone' => 'required|string|max:20',
            'city' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,interested,not_interested',
            'contact_method' => 'required|in:whatsapp,call,meeting',
            'contact_date' => 'nullable|date',
        ]);

        Auth::user()->clients()->create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'city' => $validated['city'],
            'notes' => $validated['notes'],
            'status' => $validated['status'],
            'contact_method' => $validated['contact_method'],
            'contact_date' => $validated['contact_date'],
        ]);

        return redirect()->route('member.clients.index')->with('success', 'Client added successfully to your CRM!');
    }

    public function edit(Client $client)
    {
        $this->authorize('update', $client);

        return Inertia::render('Member/Clients/Edit', [
            'client' => (new ClientResource($client))->resolve(),
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $this->authorize('update', $client);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'city' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,interested,not_interested',
            'contact_method' => 'required|in:whatsapp,call,meeting',
            'contact_date' => 'nullable|date',
        ]);

        $client->update($validated);

        return redirect()->route('member.clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);

        $client->delete();

        return redirect()->route('member.clients.index')->with('success', 'Client deleted.');
    }
}
