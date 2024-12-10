package com.web_systems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;


@SpringBootApplication
public class WebSystemsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebSystemsApplication.class, args);
	}

	@GetMapping("/")
    public ModelAndView index() {
		ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index.html");
        return modelAndView;
    }

	@GetMapping("login")
    public ModelAndView login() {
		ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("login.html");
        return modelAndView;
    }

	@GetMapping("signup")
    public ModelAndView signup() {
		ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("signup.html");
        return modelAndView;
    }

	@GetMapping("profile")
    public ModelAndView profile() {
		ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("profile.html");
        return modelAndView;
    }

	@GetMapping("create_post")
    public ModelAndView createPosts() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("create_post.html");
        return modelAndView;
    }

}
