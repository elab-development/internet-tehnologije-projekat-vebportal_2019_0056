<?php

namespace App\Http\Controllers;

use App\Exports\PostExport;
use App\Http\Resources\Post\PostCollection;
use App\Http\Resources\Post\PostResource;
use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CSV;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $posts = Post::all();
        if (is_null($posts) || count($posts) === 0) {
            return response()->json('No posts found!', 404);
        }
        return response()->json([
            'posts' => new PostCollection($posts)
        ]);
    }

    public function csvExport()
    {
        return CSV::download(new PostExport, 'posts.csv');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' =>  'required|string|max:255|unique:posts',
            'content' =>  'required|string|max:255',
            'category_id' =>  'required|integer|max:255',
            'user_id' =>  'required|integer|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $category = Category::find($request->category_id);
        if (is_null($category)) {
            return response()->json('Category not found', 404);
        }

        $user = User::find($request->user_id);
        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'category_id' => $request->category_id,
            'user_id' => $request->user_id
        ]);

        return response()->json([
            'Post created' => new PostResource($post)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function show($post_id)
    {
        $post = Post::find($post_id);
        if (is_null($post)) {
            return response()->json('Post not found', 404);
        }
        return response()->json(new PostResource($post));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        $validator = Validator::make($request->all(), [
            'title' =>  'required|string|max:255',
            'content' =>  'required|string|max:255',
            'category_id' =>  'required|integer|max:255',
            'user_id' =>  'required|integer|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $category = Category::find($request->category_id);
        if (is_null($category)) {
            return response()->json('Category not found', 404);
        }

        $user = User::find($request->user_id);
        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $post->title = $request->title;
        $post->content = $request->content;
        $post->category_id = $request->category_id;
        $post->user_id = $request->user_id;

        $post->save();

        return response()->json([
            'Post updated' => new PostResource($post)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Post  $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json('Post deleted');
    }
}
