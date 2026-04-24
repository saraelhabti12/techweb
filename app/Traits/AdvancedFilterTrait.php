<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

trait AdvancedFilterTrait
{
    /**
     * Apply advanced filters (year, month, week, day) to the query.
     */
    protected function applyAdvancedFilters(Builder $query, array $filters, string $column = 'created_at'): Builder
    {
        $year = $filters['year'] ?? null;
        $month = $filters['month'] ?? null;
        $week = $filters['week'] ?? null;
        $day = $filters['day'] ?? null;
        $period = $filters['period'] ?? 'all'; // 'today', 'this_week', 'this_month', 'this_year', 'all'

        // Direct Period filters
        if ($period !== 'all') {
            switch ($period) {
                case 'today':
                    $query->whereDate($column, Carbon::today());
                    break;
                case 'this_week':
                    $query->whereBetween($column, [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereMonth($column, Carbon::now()->month)
                          ->whereYear($column, Carbon::now()->year);
                    break;
                case 'this_year':
                    $query->whereYear($column, Carbon::now()->year);
                    break;
            }
        }

        // Specific filters (if period is all or as additions)
        if ($year && $year !== 'all') {
            $query->whereYear($column, $year);
        }

        if ($month && $month !== 'all') {
            $query->whereMonth($column, $month);
        }

        if ($week && $week !== 'all') {
            // week of year
            $query->whereRaw("WEEK($column) = ?", [$week]);
        }

        if ($day && $day !== 'all') {
            // Day of week (1-7) or specific date? 
            // The prompt says "Day filter" and "Today = today's tasks only".
            // Let's support both specific day of week and potentially specific date if needed.
            if (is_numeric($day)) {
                $query->whereRaw("DAYOFWEEK($column) = ?", [$day]);
            } else {
                // assume string like '2023-10-27'
                try {
                    $query->whereDate($column, Carbon::parse($day));
                } catch (\Exception $e) {
                    // ignore invalid date
                }
            }
        }

        return $query;
    }

    /**
     * Get common filter options for the frontend.
     */
    protected function getFilterOptions(): array
    {
        return [
            'years' => range(date('Y'), date('Y') - 5),
            'months' => [
                ['id' => 1, 'name' => 'January'],
                ['id' => 2, 'name' => 'February'],
                ['id' => 3, 'name' => 'March'],
                ['id' => 4, 'name' => 'April'],
                ['id' => 5, 'name' => 'May'],
                ['id' => 6, 'name' => 'June'],
                ['id' => 7, 'name' => 'July'],
                ['id' => 8, 'name' => 'August'],
                ['id' => 9, 'name' => 'September'],
                ['id' => 10, 'name' => 'October'],
                ['id' => 11, 'name' => 'November'],
                ['id' => 12, 'name' => 'December'],
            ],
            'daysOfWeek' => [
                ['id' => 2, 'name' => 'Monday'],
                ['id' => 3, 'name' => 'Tuesday'],
                ['id' => 4, 'name' => 'Wednesday'],
                ['id' => 5, 'name' => 'Thursday'],
                ['id' => 6, 'name' => 'Friday'],
                ['id' => 7, 'name' => 'Saturday'],
                ['id' => 1, 'name' => 'Sunday'],
            ],
            'periods' => [
                ['id' => 'all', 'name' => 'All Time'],
                ['id' => 'today', 'name' => 'Today'],
                ['id' => 'this_week', 'name' => 'This Week'],
                ['id' => 'this_month', 'name' => 'This Month'],
                ['id' => 'this_year', 'name' => 'This Year'],
            ]
        ];
    }
}
