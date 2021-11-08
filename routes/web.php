<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\PickerController;
use App\Http\Controllers\VerkoperController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::get('/', [IndexController::class, 'Index']);
Route::get('picker/{id}', [PickerController::class, 'GetOrderRows']);
Route::post('updatepickproduct', [PickerController::class, 'PickProduct']);
Route::post('pickercompleteorder', [PickerController::class, 'CompleteOrder']);

Route::get('verkoper/{id}', [VerkoperController::class, 'GetOrderRows']);

Auth::routes();
