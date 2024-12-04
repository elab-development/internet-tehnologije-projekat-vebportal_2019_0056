<?php

namespace App\Http\Controllers;

use App\Http\Resources\Comment\CommentCollection;
use App\Http\Resources\Comment\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $comments = Comment::all();
        if (is_null($comments) || count($comments) === 0) {
            return response()->json('No comments found!', 404);
        }
        return response()->json([
            'comments' => new CommentCollection($comments)
        ]);
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
            'content' =>  'required|string|max:255',
            'user_id' =>  'required|integer|max:255',
            'post_id' =>  'required|integer|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $user = User::find($request->user_id);
        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $post = Post::find($request->post_id);
        if (is_null($post)) {
            return response()->json('Post not found', 404);
        }

        $comment = Comment::create([
            'content' => $request->content,
            'user_id' => $request->user_id,
            'post_id' => $request->post_id,
        ]);

        return response()->json([
            'Comment created' => new CommentResource($comment)
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function show($comment_id)
    {
        $comment = Comment::find($comment_id);
        if (is_null($comment)) {
            return response()->json('Comment not found', 404);
        }
        return response()->json(new CommentResource($comment));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Comment $comment)
    {
        $validator = Validator::make($request->all(), [
            'content' =>  'required|string|max:255',
            'user_id' =>  'required|integer|max:255',
            'post_id' =>  'required|integer|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $user = User::find($request->user_id);
        if (is_null($user)) {
            return response()->json('User not found', 404);
        }

        $post = Post::find($request->post_id);
        if (is_null($post)) {
            return response()->json('Post not found', 404);
        }

        $comment->content = $request->content;
        $comment->user_id = $request->user_id;
        $comment->post_id = $request->post_id;

        $comment->save();

        return response()->json([
            'Comment updated' => new CommentResource($comment)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Comment  $comment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();
        return response()->json('Comment deleted');
    }
}
