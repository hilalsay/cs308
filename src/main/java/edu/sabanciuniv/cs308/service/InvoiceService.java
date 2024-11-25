package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InvoiceService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private PdfService pdfService;
    @Autowired
    private EmailSender emailService;
    public void generateInvoiceAndSendEmail(UUID orderId) throws Exception {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String pdfPath = pdfService.createPdf(order);
        emailService.sendEmailWithPdf(pdfPath);
    }
}
