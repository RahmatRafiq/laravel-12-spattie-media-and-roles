<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataTable {
    public static function paginate(Builder $query, Request $request, callable $recordsTotalCallback = null)
    {
        $length = $request->input('length', 10);
        $start = $request->input('start', 0);

        if ($recordsTotalCallback) {
            $recordsTotal = $recordsTotalCallback();
        } else {
            $recordsTotal = $query->count();
        }
        
        $recordsFiltered = $query->count();

        return [
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data' => $query
                ->offset($start)
                ->limit($length)
                ->get(),
            'draw' => $request->input('draw', 1),
        ];
    }
}