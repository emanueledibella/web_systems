package com.web_systems.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web_systems.repository.PostsRepository;

@Controller
public class PostController {

    PostsRepository postsRepository = new PostsRepository();

    @GetMapping("/")
    public String index(Model model) {
		return "index";
    }
    
    @PostMapping("post/")
    public String createPost(
        @RequestParam(value = "user_id") int userId,
        @RequestParam(value = "title") String title,
        @RequestParam(value = "content") String content,
        @RequestParam(value = "image") String image
    ) {
        return this.postsRepository.createPost(userId, title, content, image);
    }

    @GetMapping("post/")
    public String getPosts(@RequestParam(value = "offset") int offset) {
        return this.postsRepository.getPosts(offset, null);
    }

    @GetMapping("search")
    public String searchPosts(@RequestParam(value = "search") String search) {
        return this.postsRepository.getPosts(0, search);
    }

    @GetMapping("post/{postId}")
    public String getPost(@RequestParam(value = "postId") int postId) {
        return this.postsRepository.getPost(postId);
    }

    // @PostMapping("/{postId}/like")
    // public String likePost(
    //     @RequestParam(value = "postId") int postId
    // ) {
    //     return this.postsRepository.likePost(postId);
    // }


}
