package edu.baylor.cs.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/login",
            "/register",
            "/rooms",
            "/reservations",
            "/store",
            "/clerk",
            "/admin"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
