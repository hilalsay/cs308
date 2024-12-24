package edu.sabanciuniv.cs308.service;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// The @ResponseStatus annotation ensures that a 404 Not Found status is returned when this exception is thrown
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Constructor that accepts a message and passes it to the superclass (RuntimeException)
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
