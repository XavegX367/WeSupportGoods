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
Route::post('verkopersaveproduct', [VerkoperController::class, 'SaveProduct']);
Route::post('verkoperremoveproduct', [VerkoperController::class, 'RemoveProduct']);
Route::post('savenewcustomer', [VerkoperController::class, 'SaveNewCustomer']);
Route::post('saveneworder', [VerkoperController::class, 'SaveNewOrder']);
Route::post('savenewproductline', [VerkoperController::class, 'SaveNewProductLine']);
Route::get('getcustomers', [VerkoperController::class, 'GetCustomers']);
Route::get('getproducts', [VerkoperController::class, 'Getproducts']);
Route::get('getproductdetails/{id}', [VerkoperController::class, 'GetProductDetails']);
Route::get('loadproductlocation/{artikelnummer}/{eenheid}', [VerkoperController::class, 'LoadProductLocation']);
Route::get('refreshsellertable', [VerkoperController::class, 'RefreshSellerTable']);

Auth::routes();
