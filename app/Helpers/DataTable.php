<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataTable {
    public static function paginate(Builder $query, Request $request)
    {
        $length = $request->length;
        $start = $request->start;

        return [
            'recordsTotal' => $query->count(),
            'recordsFiltered' => $query->count(),
            'data' => $query
                ->offset($start)
                ->limit($length)
                ->get(),
            'draw' => $request->draw,
        ];
    }
}