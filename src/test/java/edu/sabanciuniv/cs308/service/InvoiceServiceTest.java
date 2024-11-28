package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class InvoiceServiceTest {

    @Mock
    private OrderRepo orderRepoMock;

    @Mock
    private PdfService pdfServiceMock;

    @Mock
    private EmailSender emailServiceMock;

    @InjectMocks
    private InvoiceService invoiceService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGenerateInvoiceAndSendEmail_Success() throws Exception {
        // Arrange
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();
        String mockPdfPath = "path/to/generated/invoice.pdf";
        String mockEmail = "mockEmail";
        when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(pdfServiceMock.createPdf(mockOrder)).thenReturn(mockPdfPath);

        // Act
        invoiceService.generateInvoiceAndSendEmail(orderId);

        // Assert
        verify(orderRepoMock, times(1)).findById(orderId);
        verify(pdfServiceMock, times(1)).createPdf(mockOrder);
        verify(emailServiceMock, times(1)).sendEmailWithPdf(mockEmail,mockPdfPath);
    }

    @Test
    void testGenerateInvoiceAndSendEmail_OrderNotFound() {
        // Arrange
        UUID orderId = UUID.randomUUID();
        when(orderRepoMock.findById(orderId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                invoiceService.generateInvoiceAndSendEmail(orderId));
        assertEquals("Order not found", exception.getMessage());

        verify(orderRepoMock, times(1)).findById(orderId);
        verifyNoInteractions(pdfServiceMock);
        verifyNoInteractions(emailServiceMock);
    }

    @Test
    void testGenerateInvoiceAndSendEmail_PdfCreationFailure() {
        // Arrange
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();

        when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(pdfServiceMock.createPdf(mockOrder)).thenThrow(new RuntimeException("PDF generation failed"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                invoiceService.generateInvoiceAndSendEmail(orderId));
        assertEquals("PDF generation failed", exception.getMessage());

        verify(orderRepoMock, times(1)).findById(orderId);
        verify(pdfServiceMock, times(1)).createPdf(mockOrder);
        verifyNoInteractions(emailServiceMock);
    }


    @Test
    void testGenerateInvoiceAndSendEmail_EmailSendingFailure() throws Exception {
        // Arrange
        UUID orderId = UUID.randomUUID();
        Order mockOrder = new Order();
        String mockPdfPath = "path/to/generated/invoice.pdf";
        String mockEmail = "email";

        when(orderRepoMock.findById(orderId)).thenReturn(Optional.of(mockOrder));
        when(pdfServiceMock.createPdf(mockOrder)).thenReturn(mockEmail,mockPdfPath);
        doThrow(new RuntimeException("Email sending failed")).when(emailServiceMock).sendEmailWithPdf(mockEmail,mockPdfPath);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                invoiceService.generateInvoiceAndSendEmail(orderId));
        assertEquals("Email sending failed", exception.getMessage());

        verify(orderRepoMock, times(1)).findById(orderId);
        verify(pdfServiceMock, times(1)).createPdf(mockOrder);
        verify(emailServiceMock, times(1)).sendEmailWithPdf(mockEmail,mockPdfPath);
    }
}
