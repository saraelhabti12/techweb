<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TaskAiController extends Controller
{
    public function analyze(Task $task)
    {
        Log::info('AI Task Analysis started', ['task_id' => $task->id]);

        $apiKey = config('services.gemini.api_key');
        if (!$apiKey) {
            Log::error('Gemini API key missing in configuration');
            return response()->json([
                'error' => 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.'
            ], 500);
        }

        // Load relations for deep context
        $task->load(['project.client', 'user', 'members']);

        $data = [
            'title' => $task->title,
            'description' => $task->description,
            'project' => $task->project?->name ?? 'Internal Project',
            'client' => $task->project?->client?->name ?? 'N/A',
            'assigned_user' => $task->user?->name ?? 'Unassigned',
            'team_members' => $task->members->pluck('name')->toArray(),
            'due_date' => $task->due_date ? \Carbon\Carbon::parse($task->due_date)->format('Y-m-d') : null,
            'deadline' => $task->deadline ? \Carbon\Carbon::parse($task->deadline)->format('Y-m-d') : null,
            'status' => $task->status,
        ];

        $prompt = "As a senior technical project lead, analyze the following task context and provide a detailed analysis.
        
        Task Dataset:
        " . json_encode($data, JSON_PRETTY_PRINT) . "
        
        Please provide the response in the following JSON format ONLY. Do NOT wrap the JSON in markdown blocks. Ensure all string values in the JSON (especially the email and slack drafts) use '\\n' for newlines and NEVER contain literal raw newlines inside the quotes. The output must be valid, standard RFC 8259 JSON.
        
        JSON Structure:
        {
            \"summary\": \"A clear, professional, and concise 2-3 sentence overview of what the task aims to accomplish and its strategic value.\",
            \"next_steps\": [
                \"Specific technical or operational action step 1\",
                \"Specific technical or operational action step 2\",
                \"Specific technical or operational action step 3\"
            ],
            \"checklist\": [
                \"Sub-task checklist item 1 (e.g. Initialize repository/schema)\",
                \"Sub-task checklist item 2\",
                \"Sub-task checklist item 3\",
                \"Sub-task checklist item 4\"
            ],
            \"communication_drafts\": {
                \"client_email\": \"Subject: Update on [Task Title]\\n\\nDear [Client Name],\\n\\n[Professional and friendly email draft explaining the progress, milestones, or current stage of this task...]\",
                \"internal_slack\": \"*Task Status Update: [Task Title]*\\n\\nHey team! Quick update on the task: ...\"
            },
            \"estimated_completion_time\": \"e.g., 6-8 hours\"
        }";

        Log::info('Sending request to Gemini API for Task AI with JSON Mode');

        try {
            $response = Http::timeout(30)
                ->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json'
                    ]
                ]);

            if (!$response->successful()) {
                Log::error('Gemini API failed for Task AI', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Gemini API request failed',
                    'details' => $response->json()['error']['message'] ?? 'Unknown error from AI service.'
                ], 500);
            }

            $result = $response->json();
            $aiText = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$aiText) {
                Log::error('Invalid response structure from Gemini', ['response' => $result]);
                return response()->json([
                    'error' => 'Invalid response from AI service structure.',
                    'details' => json_encode($result)
                ], 500);
            }

            // Fallback backtick cleaning (though not needed when responseMimeType is application/json)
            $cleanJson = trim($aiText);
            if (str_starts_with($cleanJson, '```json')) {
                $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', $cleanJson);
            }

            // Defensively clean any unescaped control characters/newlines
            $aiData = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to decode AI JSON', ['raw_text' => $aiText, 'error' => json_last_error_msg()]);
                
                // If it fails with control character error, try cleaning raw newlines
                if (json_last_error() === JSON_ERROR_CTRL_CHAR) {
                    $escapedJson = preg_replace('/(?<!\\\\)\n/', '\\n', $cleanJson);
                    $escapedJson = preg_replace('/(?<!\\\\)\r/', '\\r', $escapedJson);
                    $aiData = json_decode($escapedJson, true);
                }
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return response()->json([
                        'error' => 'AI returned malformed data: ' . json_last_error_msg(),
                        'details' => $aiText
                    ], 500);
                }
            }

            return response()->json([
                'success' => true,
                'analysis' => $aiData
            ]);

        } catch (\Exception $e) {
            Log::error('AI Task Analysis Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An internal error occurred during task analysis.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
