package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired
    private  PdfService service;

//    @GetMapping("/create-pdf/{orderId}")
//    public String createPdf(@PathVariable UUID orderId) {
//        String filePath = "C:\\Users\\sudel\\OneDrive\\Masaüstü\\products.pdf";
//        service.createPdf(filePath, orderId);
//        return "PDF created successfully: " + filePath;
//    }
}
