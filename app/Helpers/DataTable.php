<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataTable
{
    /**
     * Handle DataTable server-side logic: Search, Sort, and Pagination.
     * 
     * @param Builder $query The Eloquent query builder
     * @param Request $request The incoming DataTable request
     * @param array $searchableColumns Columns to be searched (supports dot notation)
     * @param array $orderableColumns Mapping of index to column name for sorting
     * @return array
     */
    public static function process(Builder $query, Request $request, array $searchableColumns = [], array $orderableColumns = [])
    {
        // 1. Total records before filtering (Optional, but useful for DataTables.net compatibility)
        // $recordsTotal = (clone $query)->count();

        // 2. Apply Global Search
        $searchValue = $request->input('filter.global', $request->input('search.value'));
        if (!empty($searchValue) && !empty($searchableColumns)) {
            $query->where(function ($q) use ($searchValue, $searchableColumns) {
                foreach ($searchableColumns as $index => $column) {
                    $method = $index === 0 ? 'where' : 'orWhere';
                    
                    if (str_contains($column, '.')) {
                        [$relation, $relColumn] = explode('.', $column);
                        $q->{$method . 'Has'}($relation, function ($relQ) use ($relColumn, $searchValue) {
                            $relQ->where($relColumn, 'like', "%{$searchValue}%");
                        });
                    } else {
                        $q->{$method}($column, 'like', "%{$searchValue}%");
                    }
                }
            });
        }

        // 3. Apply Sorting
        $sort = null;
        $direction = 'asc';

        if ($request->filled('sort')) { // TanStack Table
            $sort = $request->input('sort');
            $direction = $request->input('direction', 'asc');
        } elseif ($request->filled('order')) { // DataTables.net
            $order = $request->input('order.0');
            $columnIndex = $order['column'];
            $direction = $order['dir'] ?? 'asc';
            $sort = $orderableColumns[$columnIndex] ?? null;
        }

        if ($sort) {
            // Validation: Only allow sorting if column is in $orderableColumns (if provided)
            // or if it's a simple alphanumeric string (basic protection)
            $isAllowed = empty($orderableColumns) || in_array($sort, $orderableColumns);
            
            if ($isAllowed && preg_match('/^[a-zA-Z0-9_\.]+$/', $sort)) {
                if (str_contains($sort, '.')) {
                    // Handle sorting by relationship (basic implementation)
                    // Note: This usually requires joins which we might not want to automate here
                    // For now, we only support direct columns or let the developer handle complex sorts
                } else {
                    $query->orderBy($sort, $direction === 'desc' ? 'desc' : 'asc');
                }
            } else {
                $query->latest();
            }
        } else {
            // Default sort
            $query->latest();
        }

        // 4. Handle Pagination
        $perPage = $request->input('per_page', $request->input('length', 10));
        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Legacy support for paginate method
     * @deprecated Use process() instead
     */
    public static function paginate(Builder $query, Request $request, ?callable $recordsTotalCallback = null)
    {
        $length = $request->input('length', 10);
        $start = $request->input('start', 0);

        $recordsTotal = $recordsTotalCallback ? $recordsTotalCallback() : $query->count();
        $recordsFiltered = $query->count();

        return [
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data' => $query->offset($start)->limit($length)->get(),
            'draw' => $request->input('draw', 1),
        ];
    }
}
