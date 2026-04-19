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
        // 1. Total records before filtering
        $recordsTotal = (clone $query)->count();

        // 2. Apply Global Search (from TanStack Table or DataTables.net)
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

        // 3. Records total after filtering
        $recordsFiltered = (clone $query)->count();

        // 4. Apply Sorting (from TanStack Table or DataTables.net)
        if ($request->filled('sort')) { // TanStack Table
            $query->orderBy($request->input('sort'), $request->input('direction', 'asc'));
        } elseif ($request->filled('order')) { // DataTables.net
            $order = $request->input('order.0');
            $columnIndex = $order['column'];
            $direction = $order['dir'];
            $columnName = $orderableColumns[$columnIndex] ?? null;

            if ($columnName && !str_contains($columnName, '.')) {
                $query->orderBy($columnName, $direction);
            }
        } else {
            // Default sort: newest first
            $query->latest();
        }

        // 5. Handle Pagination
        // This is now handled by Laravel's paginate() method, returning a LengthAwarePaginator
        $perPage = $request->input('per_page', 10);
        $paginator = $query->paginate($perPage);

        return $paginator;
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
