<?php 

namespace App\Helpers;

class Guards {
  public static function list()
  {
    return [
      'web',
      'api',
    ];
  }
}