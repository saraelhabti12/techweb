<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectAiSuggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class ProjectAiController extends Controller
{
    public function generateContent(string $prompt)
    {
        $apiKey = config('services.gemini.api_key');

        if (!$apiKey) {
            Log::error('Gemini API key missing in configuration');
            throw new \Exception('Gemini API key not configured.');
        }

        return Http::timeout(30)
            ->withoutVerifying()
            ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);
    }

    public function analyze(Project $project)
    {
        Log::info('AI Project Analysis started', ['project_id' => $project->id]);

        // Load comprehensive project data
        $project->load(['category', 'client', 'members', 'creators', 'projectManager']);

        $data = [
            'title' => $project->name,
            'description' => $project->description,
            'category' => $project->category?->name,
            'client' => $project->client?->name,
            'client_history' => $project->client?->projects()->count() ?? 0,
            'team_members' => $project->members->pluck('name')->toArray(),
            'creators' => $project->creators->pluck('name')->toArray(),
            'deadline' => $project->end_date,
            'budget' => $project->commercial_commission,
        ];

        $prompt = "As a senior AI Project Manager Advisor, analyze the following project data and generate a strategic execution plan.
        
        Project Data:
        " . json_encode($data, JSON_PRETTY_PRINT) . "
        
        Provide the analysis in the following JSON format ONLY:
        {
            \"suggested_tasks\": [
                {\"title\": \"Task Title\", \"description\": \"Short task description\", \"priority\": \"high|medium|low\"}
            ],
            \"risk_level\": \"High\" | \"Medium\" | \"Low\",
            \"ai_timeline\": [
                {\"phase\": \"Phase Name\", \"duration\": \"Estimated duration\", \"milestone\": \"Key milestone\"}
            ],
            \"recommendations\": \"A detailed string of recommendations for project success, bottleneck prediction, and workload balancing.\",
            \"bottlenecks\": \"Predicted potential bottlenecks.\",
            \"completion_probability\": \"e.g., 85%\"
        }
        
        Ensure the tasks are relevant to the project category and team members/creators listed.";

        Log::info('AI request started');
        Log::info('Prompt:', ['prompt' => $prompt]);

        try {
            $response = $this->generateContent($prompt);

            if (!$response->successful()) {
                Log::error('Gemini API failed', [
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

            // The model might wrap the JSON in markdown blocks
            $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', trim($aiText));
            $aiData = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to decode AI JSON', ['raw_text' => $aiText, 'error' => json_last_error_msg()]);
                return response()->json([
                    'error' => 'AI returned malformed data.',
                    'details' => $aiText
                ], 500);
            }

            // Save to database
            $suggestion = ProjectAiSuggestion::create([
                'project_id' => $project->id,
                'suggested_tasks' => $aiData['suggested_tasks'] ?? [],
                'risk_level' => $aiData['risk_level'] ?? 'Medium',
                'ai_timeline' => $aiData['ai_timeline'] ?? [],
                'recommendations' => ($aiData['recommendations'] ?? '') . "\n\nBottlenecks: " . ($aiData['bottlenecks'] ?? '') . "\nCompletion Probability: " . ($aiData['completion_probability'] ?? ''),
                'raw_ai_output' => $aiData,
            ]);

            Log::info('AI Analysis completed successfully', ['suggestion_id' => $suggestion->id]);

            return response()->json([
                'suggestion' => $suggestion,
                'ai_data' => $aiData
            ]);

        } catch (\Exception $e) {
            Log::error('AI Project Analysis Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An internal error occurred during AI analysis.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function getLatest(Project $project)
    {
        $latest = $project->aiSuggestions()->latest()->first();
        return response()->json($latest);
    }
}
