<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JsonEditorController;
use App\Http\Controllers\HtpasswdController;


Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/json-editor', [JsonEditorController::class, 'index']);
Route::post('/json-editor/validate', [JsonEditorController::class, 'validateJSON']);
Route::post('/json-editor/beautify', [JsonEditorController::class, 'beautifyJSON']);
Route::post('/json-editor/minify', [JsonEditorController::class, 'minifyJSON']);
Route::post('/json-editor/xml', [JsonEditorController::class, 'convertToXML']);
Route::post('/json-editor/csv', [JsonEditorController::class, 'convertToCSV']);
Route::post('/json-editor/yaml', [JsonEditorController::class, 'convertToYAML']);
Route::post('/json-editor/download', [JsonEditorController::class, 'downloadJSON']);


Route::get('/htpasswd', [HtpasswdController::class, 'index'])->name('htpasswd.index');
Route::post('/htpasswd', [HtpasswdController::class, 'generate'])->name('htpasswd.generate');