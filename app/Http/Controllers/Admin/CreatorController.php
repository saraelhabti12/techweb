<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Creator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CreatorController extends Controller
{
    public function index(Request $request)
    {
        $query = Creator::query();

        if ($request->search) {
            $query->where('full_name', 'like', "%{$request->search}%")
                  ->orWhere('display_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        return Inertia::render('Admin/Creators/Index', [
            'creators' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Creators/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'profile_photo' => 'nullable|image|max:2048',
            'gallery_images.*' => 'nullable|image|max:5120',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'city' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'height_cm' => 'nullable|integer',
            'weight_kg' => 'nullable|integer',
            'clothing_size' => 'nullable|string',
            'shoe_size' => 'nullable|string',
            'languages' => 'nullable|array',
            'skills' => 'nullable|string',
            'experience_notes' => 'nullable|string',
            'availability_status' => 'required|in:available,busy,on_shoot,vacation',
            'daily_rate' => 'nullable|numeric',
            'visible_on_homepage' => 'boolean',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')->store('creators/profiles', 'public');
        }

        if ($request->hasFile('gallery_images')) {
            $gallery = [];
            foreach ($request->file('gallery_images') as $image) {
                $gallery[] = $image->store('creators/gallery', 'public');
            }
            $validated['gallery_images'] = $gallery;
        }

        Creator::create($validated);

        return redirect()->route('admin.creators.index')->with('success', 'Creator created successfully.');
    }

    public function show(Creator $creator)
    {
        return Inertia::render('Admin/Creators/Show', [
            'creator' => $creator
        ]);
    }

    public function edit(Creator $creator)
    {
        return Inertia::render('Admin/Creators/Edit', [
            'creator' => $creator
        ]);
    }

    public function update(Request $request, Creator $creator)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'profile_photo' => 'nullable', // Can be a string (existing path) or a file
            'gallery_images' => 'nullable|array',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'city' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'height_cm' => 'nullable|integer',
            'weight_kg' => 'nullable|integer',
            'clothing_size' => 'nullable|string',
            'shoe_size' => 'nullable|string',
            'languages' => 'nullable|array',
            'skills' => 'nullable|string',
            'experience_notes' => 'nullable|string',
            'availability_status' => 'required|in:available,busy,on_shoot,vacation',
            'daily_rate' => 'nullable|numeric',
            'visible_on_homepage' => 'boolean',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('profile_photo_upload')) {
            if ($creator->profile_photo) {
                Storage::disk('public')->delete($creator->profile_photo);
            }
            $validated['profile_photo'] = $request->file('profile_photo_upload')->store('creators/profiles', 'public');
        } else {
            unset($validated['profile_photo']);
        }

        // Handle gallery images - this can be complex if we want to add/remove specific ones.
        // For now, let's assume if gallery_images_upload is provided, we ADD them.
        // And if gallery_images is provided, it's the FULL list of remaining images.
        
        $currentGallery = $creator->gallery_images ?? [];
        
        if ($request->has('gallery_images')) {
            $currentGallery = $request->gallery_images; // List of existing images to keep
        }

        if ($request->hasFile('gallery_images_upload')) {
            foreach ($request->file('gallery_images_upload') as $image) {
                $currentGallery[] = $image->store('creators/gallery', 'public');
            }
        }
        
        $validated['gallery_images'] = $currentGallery;

        $creator->update($validated);

        return redirect()->route('admin.creators.index')->with('success', 'Creator updated successfully.');
    }

    public function destroy(Creator $creator)
    {
        if ($creator->profile_photo) {
            Storage::disk('public')->delete($creator->profile_photo);
        }
        
        if ($creator->gallery_images) {
            foreach ($creator->gallery_images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $creator->delete();

        return redirect()->route('admin.creators.index')->with('success', 'Creator deleted successfully.');
    }

    // Public methods
    public function publicIndex()
    {
        $creators = Creator::where('active', true)->where('visible_on_homepage', true)->get();
        return Inertia::render('Creators/Index', [
            'creators' => $creators
        ]);
    }

    public function publicShow($id)
    {
        $creator = Creator::where('active', true)->findOrFail($id);
        return Inertia::render('Creators/Show', [
            'creator' => $creator
        ]);
    }
}
