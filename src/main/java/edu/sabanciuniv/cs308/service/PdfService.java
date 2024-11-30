package edu.sabanciuniv.cs308.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import edu.sabanciuniv.cs308.repo.CartItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Optional;

@Service
public class PdfService {

    @Autowired
    private ShoppingCartRepo shoppingCartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

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

            // Add title to the document
            document.add(new Paragraph("Invoice").setBold().setFontSize(14));

            // Add order details (User, Total, Date, Payment Method)
            document.add(new Paragraph("Order ID: " + order.getId()));
            document.add(new Paragraph("User: " + order.getUser().getName()));
            document.add(new Paragraph("Username: " + order.getUser().getUsername()));
            document.add(new Paragraph("User Address: " + order.getUser().getHomeAddress()));
            document.add(new Paragraph("Tax ID: " + order.getUser().getTaxId()));
            document.add(new Paragraph("Total Amount: " + order.getTotalAmount()));
            document.add(new Paragraph("Order Date: " + order.getCreatedAt()));
            document.add(new Paragraph("Payment Method: " + order.getPaymentMethod()));

            // Fetch the shopping cart using shop_id from the order
            Optional<ShoppingCart> shoppingCartOptional = shoppingCartRepo.findById(order.getShop_id());
            if (shoppingCartOptional.isPresent()) {
                ShoppingCart shoppingCart = shoppingCartOptional.get();

                // Add a space
                document.add(new Paragraph("\n"));

                // Add table header for the shopping cart items
                Table table = new Table(new float[]{1, 3, 2, 2});
                table.addCell("Item ID");
                table.addCell("Product Name");
                table.addCell("Quantity");
                table.addCell("Price");

                // Fetch the cart items for the shopping cart
                List<CartItem> cartItems = shoppingCart.getItems();  // Get items in the shopping cart

                // Add each cart item to the table
                for (CartItem item : cartItems) {
                    table.addCell(item.getProduct().getId().toString());  // Assuming CartItem has Product and Product has ID
                    table.addCell(item.getProduct().getName());  // Assuming Product has Name
                    table.addCell(String.valueOf(item.getQuantity()));
                    table.addCell(String.valueOf(item.getProduct().getPrice()));  // Assuming Product has Price
                }

                // Add the table to the document
                document.add(table);
            } else {
                document.add(new Paragraph("No items found for this shopping cart."));
            }

            // Close the document
            document.close();

            return filePath; // Return the path to the created PDF
        } catch (Exception e) {
            e.printStackTrace();
            return ""; // If something goes wrong, return empty string
        }
    }
}