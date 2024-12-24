package edu.sabanciuniv.cs308.service;
/*
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.User;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.UserRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InvoiceServiceTest {

    private InvoiceService invoiceService;

    @Mock
    private OrderRepo orderRepo;
    @Mock
    private PdfService pdfService;
    @Mock
    private EmailSender emailService;
    @Mock
    private UserRepo userRepo;
    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;
    @Mock
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        invoiceService = new InvoiceService(orderRepo, pdfService ,emailService, userRepo );

        // Set up mock SecurityContext
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testGenerateInvoiceAndSendEmail_Success() throws Exception {
        // Arrange
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();
        String mockEmail = "testuser@example.com";
        String mockUsername = "testuser";
        String mockPdfPath = "/path/to/generated.pdf";

        // Mock SecurityContextHolder behavior
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn(mockUsername);

        // Mock userRepo behavior
        UUID userId = UUID.randomUUID();
        User mockUser = new User("Test User", mockEmail, "securepassword");
        mockUser.setId(userId);

        when(userRepo.findByUsername(mockUsername)).thenReturn(Optional.of(mockUser));
        when(userRepo.findById(userId)).thenReturn(Optional.of(mockUser));

        // Mock orderRepo behavior
        when(orderRepo.findById(orderId)).thenReturn(Optional.of(mockOrder));

        // Mock PdfService and EmailSender
        when(pdfService.createPdf(mockOrder)).thenReturn(mockPdfPath);

        // Act
        invoiceService.generateInvoiceAndSendEmail(orderId);

        // Assert
        verify(orderRepo).findById(orderId);
        verify(pdfService).createPdf(mockOrder);
        verify(emailService).sendEmailWithPdf(mockEmail, mockPdfPath);
    }

    @Test
    void testGenerateInvoiceAndSendEmail_OrderNotFound() {
        // Arrange
        UUID orderId = UUID.randomUUID();
        when(orderRepo.findById(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> invoiceService.generateInvoiceAndSendEmail(orderId));
        verify(orderRepo).findById(orderId);
        verifyNoInteractions(pdfService, emailService);
    }
}
*/