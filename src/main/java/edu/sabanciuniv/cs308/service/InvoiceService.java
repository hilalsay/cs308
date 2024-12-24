package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Service
public class InvoiceService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private PdfService pdfService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private EmailSender emailService;

    @Autowired
    private UserRepo userRepo;
    public void generateInvoiceAndSendEmail(UUID orderId) throws Exception {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        String recipientEmail = getLoggedInUserEmail();
        String pdfPath = pdfService.createPdf(order);
        emailService.sendEmailWithPdf(recipientEmail,pdfPath);
    }
    /**
     * Retrieve the logged-in user's email address.
     *
     * @return The email address of the logged-in user.
     */
    private String getLoggedInUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();

            // Get user ID by username

            UUID userId = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                    .getId();

            // Get user email by user ID
            return userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId))
                    .getEmail();
        } else {
            throw new RuntimeException("User not authenticated");
        }
    }

    public String generateInvoice(UUID orderId) throws Exception {
        // Fetch the order by ID using the getOrderById method
        Order order = orderService.getOrderById(orderId);  // Assuming orderService is injected and available

        // Generate the PDF file using the PdfService
        String pdfPath = pdfService.createPdf(order);

        // Return the path to the generated PDF file
        return pdfPath;
    }


}
