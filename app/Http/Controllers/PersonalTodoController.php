<?php

namespace App\Http\Controllers;

use App\Models\PersonalTodo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PersonalTodoController extends Controller
{
    public function index()
    {
        return Auth::user()->personalTodos()->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'task' => 'required|string|max:255',
        ]);

        $todo = Auth::user()->personalTodos()->create([
            'task' => $request->task,
            'is_completed' => false,
        ]);

        return response()->json($todo, 201);
    }

    public function update(Request $request, PersonalTodo $personalTodo)
    {
        if ($personalTodo->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'task' => 'sometimes|string|max:255',
            'is_completed' => 'sometimes|boolean',
        ]);

        $personalTodo->update($request->only(['task', 'is_completed']));

        return response()->json($personalTodo);
    }

    public function destroy(PersonalTodo $personalTodo)
    {
        if ($personalTodo->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $personalTodo->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
