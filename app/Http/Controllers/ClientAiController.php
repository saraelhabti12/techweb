<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class ClientAiController extends Controller
{
    public function analyze(Client $client)
    {
        Log::info('AI Client Analysis started', ['client_id' => $client->id]);

        $apiKey = config('services.gemini.api_key');

        if (!$apiKey) {
            Log::error('Gemini API key missing in configuration');
            return response()->json([
                'error' => 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.'
            ], 500);
        }

        // Load relationships for comprehensive analysis
        $client->load(['contacts', 'appointments', 'files', 'projects']);

        $data = [
            'name' => $client->name,
            'company' => $client->company_name,
            'status' => $client->status,
            'notes' => $client->notes,
            'contacts' => $client->contacts->map(fn($c) => [
                'date' => $c->created_at?->format('Y-m-d'),
                'message' => $c->message,
                'services' => $c->services,
            ]),
            'appointments' => $client->appointments->map(fn($a) => [
                'date' => $a->appointment_date?->format('Y-m-d'),
                'title' => $a->title,
                'notes' => $a->notes,
                'status' => $a->status,
            ]),
            'files' => $client->files->pluck('original_name'),
            'projects' => $client->projects->map(fn($p) => [
                'name' => $p->name,
                'status' => $p->status,
            ]),
        ];

        $prompt = "As a senior CRM analyst, analyze the following client data and provide a strategic summary.
        
        Client Data:
        " . json_encode($data, JSON_PRETTY_PRINT) . "
        
        Please provide the analysis in the following JSON format ONLY:
        {
            \"summary\": \"A concise 3-4 sentence summary of the client relationship and current situation.\",
            \"lead_score\": \"hot\" | \"warm\" | \"cold\",
            \"suggested_action\": \"The single most important next step to take with this client.\",
            \"recommended_follow_up\": \"YYYY-MM-DD\"
        }";

        Log::info('AI request started');
        Log::info('Prompt:', ['prompt' => $prompt]);

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
                    ]
                ]);

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

            $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', trim($aiText));
            $aiData = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to decode AI JSON', ['raw_text' => $aiText, 'error' => json_last_error_msg()]);
                return response()->json([
                    'error' => 'AI returned malformed data.',
                    'details' => $aiText
                ], 500);
            }

            return response()->json($aiData);

        } catch (\Exception $e) {
            Log::error('AI Analysis Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An internal error occurred during AI analysis.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
