package com.web_systems.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web_systems.repository.PostsRepository;


@RestController
public class PostController {

    PostsRepository postsRepository = new PostsRepository();
    
    @PostMapping("post")
    public String createPost(
        @RequestParam(value = "user_id") int userId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content,
        @RequestParam(value = "image") String image
    ) {
        return this.postsRepository.createPost(userId, title, content, image);
    }

    @GetMapping("posts")
    public String getPosts(@RequestParam(value = "offset") int offset) {
        return this.postsRepository.getPosts(offset, null);
    }

    @GetMapping("search")
    public String searchPosts(@RequestParam(value = "search") String search) {
        return this.postsRepository.getPosts(0, search);
    }

}
