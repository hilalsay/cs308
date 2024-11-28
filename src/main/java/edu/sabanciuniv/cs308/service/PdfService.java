package edu.sabanciuniv.cs308.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.Product;
import edu.sabanciuniv.cs308.repo.OrderRepo;
import edu.sabanciuniv.cs308.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PdfService {

    @Autowired
    private OrderRepo repo;

    public String createPdf(Order order) {
        try {
            String filePath = "invoices/invoice_" + order.getId() + ".pdf";
            PdfWriter writer = new PdfWriter(new FileOutputStream(filePath));
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);

            document.add(new Paragraph("Invoice").setBold().setFontSize(14));

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
            return filePath;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}
