<?php

namespace App\Http\Resources\Post;

use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = 'post';

    public function toArray($request)
    {
        return [
            'title' => $this->resource->title,
            'content' => $this->resource->content,
            'category' => new CategoryResource($this->resource->category),
            'author' => new UserResource($this->resource->user),
        ];
    }
}
