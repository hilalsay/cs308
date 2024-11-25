package edu.sabanciuniv.cs308.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;

@Service
public class PdfService {

    @Autowired
    private OrderRepo repo;

    public String createPdf(Order order) {
        try {
            // Directory and file path
            String directoryPath = "invoices";
            File directory = new File(directoryPath);

            // Ensure directory exists
            if (!directory.exists()) {
                boolean dirCreated = directory.mkdirs(); // Create directory
                if (!dirCreated) {
                    throw new RuntimeException("Failed to create directory: " + directoryPath);
                }
            }

            // File path for the PDF
            String filePath = directoryPath + "/invoice_" + order.getId() + ".pdf";

            // Create the PDF file
            PdfWriter writer = new PdfWriter(new FileOutputStream(filePath));
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            // Add content to the document
            document.add(new Paragraph("Invoice").setBold().setFontSize(14));

            // Add table with order details
            Table table = new Table(new float[]{1, 2, 3, 4});
            table.addCell("User Name");
            table.addCell("Total Amount");
            table.addCell("Date");
            table.addCell("Payment Method");

            table.addCell(order.getUser().getName());
            table.addCell(order.getTotalAmount().toString());
            table.addCell(order.getCreatedAt().toString());
            table.addCell(order.getPaymentMethod());

            document.add(table);
            document.close();

            return filePath; // Return the path to the created PDF
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}
