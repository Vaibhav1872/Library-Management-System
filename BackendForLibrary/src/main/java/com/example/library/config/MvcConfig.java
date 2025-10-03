package com.example.library.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    /**
     * This method configures Spring to serve static files (like images)
     * from a specific directory.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This rule maps the public URL path "/images/**" to the
        // "static/images/" folder inside the classpath (your resources folder).
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
    }
}
