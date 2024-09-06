<?php


use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LoginRegisterController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{id}', [UserController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{id}', [PostController::class, 'show']);

Route::get('/comments', [CommentController::class, 'index']);
Route::get('/comments/{id}', [CommentController::class, 'show']);

Route::post('/register', [LoginRegisterController::class, 'register']);
Route::post('/login', [LoginRegisterController::class, 'login']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function (Request $request) {
        return auth()->user();
    });

    Route::resource('/categories', CategoryController::class)
        ->only(['store', 'update', 'destroy']);

    Route::resource('/posts', PostController::class)
        ->only(['store', 'update', 'destroy']);

    Route::resource('/comments', CommentController::class)
        ->only(['store', 'update', 'destroy']);


    Route::post('/logout', [LoginRegisterController::class, 'logout']);
});

