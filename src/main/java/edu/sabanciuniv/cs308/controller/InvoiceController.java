package edu.sabanciuniv.cs308.controller;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.service.InvoiceService;
import edu.sabanciuniv.cs308.service.OrderService;
import edu.sabanciuniv.cs308.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.nio.file.Files;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private OrderRepo orderRepo;

    @GetMapping("/{orderId}")
    public ResponseEntity<byte[]> generateInvoice(@PathVariable UUID orderId) {
        try {
            // Fetch the order using its ID
            Order order = orderRepo.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            // Generate the invoice PDF file path
            String pdfPath = invoiceService.generateInvoice(orderId); // Returns the file path now

            // Read the PDF file content into a byte array
            File pdfFile = new File(pdfPath);
            byte[] pdfContent = Files.readAllBytes(pdfFile.toPath());

            // Set headers and return the PDF as a downloadable file
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + orderId + ".pdf");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfContent);

        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
            // Return error message as byte[] to match expected response type
            String errorMessage = "Error generating invoice: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorMessage.getBytes());
        }
    }

}
