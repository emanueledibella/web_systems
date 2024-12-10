package com.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.services.PostsService;


@RestController
public class PostController {

    PostsService postsService = new PostsService();
    
    @PostMapping("post")
    public String createPost(
        @RequestParam(value = "user_id") int userId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content,
        @RequestParam(value = "image") String image
    ) {
        return this.postsService.createPost(userId, title, content, image);
    }

    @GetMapping("posts")
    public String getPosts(@RequestParam(value = "offset") int offset) {
        return this.postsService.getPosts(offset, null);
    }

    @GetMapping("search")
    public String searchPosts(@RequestParam(value = "search") String search) {
        return this.postsService.getPosts(0, search);
    }

}
