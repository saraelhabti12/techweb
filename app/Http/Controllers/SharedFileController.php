<?php

namespace App\Http\Controllers;

use App\Models\SharedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SharedFileController extends Controller
{
    public function adminIndex()
    {
        return Inertia::render('Admin/SharedFiles/Index', [
            'files' => SharedFile::with('uploader')->latest()->get()
        ]);
    }

    public function memberIndex()
    {
        return Inertia::render('Member/SharedFiles/Index', [
            'files' => SharedFile::with('uploader')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:51200', // 50MB limit
        ]);

        $file = $request->file('file');
        $path = $file->store('shared_files', 'public');

        SharedFile::create([
            'name' => $file->getClientOriginalName(),
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
        ]);

        return back()->with('success', 'File uploaded successfully.');
    }

    public function destroy(SharedFile $sharedFile)
    {
        Storage::disk('public')->delete($sharedFile->file_path);
        $sharedFile->delete();

        return back()->with('success', 'File deleted successfully.');
    }

    public function download(SharedFile $sharedFile)
    {
        return Storage::disk('public')->download($sharedFile->file_path, $sharedFile->original_name);
    }
}
