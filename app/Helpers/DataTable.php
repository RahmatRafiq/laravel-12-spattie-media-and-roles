<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataTable {
    public static function paginate(Builder $query, Request $request)
    {
        $length = $request->length;
        $start = $request->start;

        // Clone query untuk menghitung total records tanpa filter search
        $totalQuery = clone $query;
        
        // Hitung total records tanpa filter search
        $recordsTotal = $totalQuery->count();
        
        // Hitung filtered records (dengan search jika ada)
        $recordsFiltered = $query->count();

        return [
            'recordsTotal' => $recordsTotal,
            'recordsFiltered' => $recordsFiltered,
            'data' => $query
                ->offset($start)
                ->limit($length)
                ->get(),
            'draw' => $request->draw,
        ];
    }
}