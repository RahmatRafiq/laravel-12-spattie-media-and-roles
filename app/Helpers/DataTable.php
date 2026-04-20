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
     * @param array $params parameters for filtering, sorting, etc.
     * @param array $searchableColumns Columns to be searched (supports dot notation)
     * @param array $orderableColumns Mapping of index to column name for sorting
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public static function process(Builder $query, array $params, array $searchableColumns = [], array $orderableColumns = [])
    {
        // 1. Total records before filtering (Optional, but useful for DataTables.net compatibility)
        // $recordsTotal = (clone $query)->count();

        // 2. Apply Global Search
        $searchValue = $params['filter']['global'] ?? $params['search']['value'] ?? null;
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
        $sort = $params['sort'] ?? null;
        $direction = $params['direction'] ?? 'asc';

        // Check for DataTables.net format
        if (!$sort && isset($params['order'][0])) {
            $order = $params['order'][0];
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
        $perPage = $params['per_page'] ?? $params['length'] ?? 10;
        return $query->paginate($perPage)->withQueryString();
    }
}
