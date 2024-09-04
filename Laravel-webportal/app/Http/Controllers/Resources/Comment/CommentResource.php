<?php

namespace App\Http\Resources\Comment;

use App\Http\Resources\Post\PostNameResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = 'comment';

    public function toArray($request)
    {
        return [
            'content' => $this->resource->content,
            'user' => new UserResource($this->resource->user),
            'post' => new PostNameResource($this->resource->post)
        ];
    }
}
