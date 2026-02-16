package com.ainan.ecommforallbackend.domain.test;

import org.springframework.stereotype.Service;

/**
 * Test service to demonstrate formatting workflow
 */
@Service
public class TestFormattingService {
    
    // Intentional formatting issues below
    public String formatTest( ){
    String message="Hello World";
        return message;
    }
    
    public int calculate(int a,int b) {
return a+b;
    }
}
