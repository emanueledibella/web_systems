package com.web_systems.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web_systems.repository.PostsRepository;


@RequestMapping("post")
public class PostController {

    PostsRepository postsRepository = new PostsRepository();
    
    @PostMapping("/")
    public String createPost(
        @RequestParam(value = "user_id") int userId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content,
        @RequestParam(value = "image") String image
    ) {
        return this.postsRepository.createPost(userId, title, content, image);
    }

    @GetMapping("/")
    public String getPosts(@RequestParam(value = "offset") int offset) {
        return this.postsRepository.getPosts(offset, null);
    }

    @GetMapping("search")
    public String searchPosts(@RequestParam(value = "search") String search) {
        return this.postsRepository.getPosts(0, search);
    }

    @GetMapping("/{postId}")
    public String getPost(@RequestParam(value = "postId") int postId) {
        return this.postsRepository.getPost(postId);
    }

}
