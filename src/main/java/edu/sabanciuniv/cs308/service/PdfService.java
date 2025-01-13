package edu.sabanciuniv.cs308.service;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import edu.sabanciuniv.cs308.model.Order;
import edu.sabanciuniv.cs308.model.ShoppingCart;
import edu.sabanciuniv.cs308.model.CartItem;
import edu.sabanciuniv.cs308.repo.ShoppingCartRepo;
import edu.sabanciuniv.cs308.repo.CartItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.math.BigDecimal;
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

            // Fetch the shopping cart using shop_id from the order
            Optional<ShoppingCart> shoppingCartOptional = shoppingCartRepo.findById(order.getShop_id());
            if (shoppingCartOptional.isPresent()) {
                ShoppingCart shoppingCart = shoppingCartOptional.get();

                // Add a space
                Paragraph orderDetails = new Paragraph()
                        .add("Order ID: " + order.getId() + "\n")
                        .add("Orderer Name: " + order.getOrdererName() + "\n")
                        .add("Date: " + order.getCreatedAt().toString() + "\n")
                        .add("Address: " + order.getOrderAddress() + "\n")
                        .add("Total Amount: " + order.getTotalAmount()+ "\n")
                        .add("Payment Method: " + order.getPaymentMethod() + "\n\n")
                        .setTextAlignment(TextAlignment.LEFT)
                        .setFontSize(12);
                document.add(orderDetails);

                // Add table header for the shopping cart items
                Table table = new Table(new float[]{2, 5, 2, 2, 3}); // Add an extra column for the image
                table.addCell("Product Name");
                table.addCell("Quantity");
                table.addCell("Unit Price");
                table.addCell("Total Price");
                table.addCell("Image");

                // Fetch the cart items for the shopping cart
                List<CartItem> cartItems = shoppingCart.getItems();  // Get items in the shopping cart

                // Add each cart item to the table
                for (CartItem item : cartItems) {
                    table.addCell(item.getProduct().getName());  // Assuming Product has Name
                    table.addCell(String.valueOf(item.getQuantity()));
                    BigDecimal price;
                    if (item.getProduct().getDiscountedPrice() != null && item.getProduct().getDiscountedPrice().compareTo(BigDecimal.ZERO) > 0) {
                        price = item.getProduct().getDiscountedPrice();  // Use discounted price if available
                    } else {
                        price = item.getProduct().getPrice();  // Otherwise, use normal price
                    }

                    table.addCell(String.valueOf(price));  // Add the determined price to the cell

                    int quantity = item.getQuantity(); // Get the quantity as int

                    // Convert int quantity to BigDecimal
                    BigDecimal quantityAsBigDecimal = BigDecimal.valueOf(quantity);

                    // Perform multiplication
                    BigDecimal totalPrice = price.multiply(quantityAsBigDecimal);

                    // Add the result to the table
                    table.addCell(totalPrice.toString());
                    byte[] imageData = item.getProduct().getImageData(); // Assuming Product has ImageData
                    if (imageData != null && imageData.length > 0) {
                        try {
                            ImageData imageDataObj = ImageDataFactory.create(imageData); // Create image from raw data
                            Image image = new Image(imageDataObj).scaleToFit(50, 50); // Scale the image
                            table.addCell(new Cell().add(image)); // Add image to the table
                        } catch (Exception e) {
                            table.addCell("Image Error"); // Placeholder for errors
                        }
                    } else {
                        table.addCell("No Image"); // Placeholder for missing images
                    }
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
    public String createPdfOrder(Order order) {
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

            // Fetch the shopping cart using shop_id from the order
            Optional<ShoppingCart> shoppingCartOptional = shoppingCartRepo.findById(order.getShop_id());
            if (shoppingCartOptional.isPresent()) {
                ShoppingCart shoppingCart = shoppingCartOptional.get();

                // Add a space
                Paragraph orderDetails = new Paragraph()
                        .add("Order ID: " + order.getId() + "\n")
                        .add("Orderer Name: " + order.getOrdererName() + "\n")
                        .add("Date: " + order.getCreatedAt().toString() + "\n")
                        .add("Address: " + order.getOrderAddress() + "\n")
                        .add("Total Amount: " + order.getTotalAmount()+ "\n")
                        .add("Payment Method: " + order.getPaymentMethod() + "\n\n")
                        .setTextAlignment(TextAlignment.LEFT)
                        .setFontSize(12);
                document.add(orderDetails);

                // Add table header for the shopping cart items
                Table table = new Table(new float[]{2, 5, 2, 2, 3}); // Add an extra column for the image
                table.addCell("Product Name");
                table.addCell("Quantity");
                table.addCell("Unit Price");
                table.addCell("Total Price");
                table.addCell("Image");

                // Fetch the cart items for the shopping cart
                List<CartItem> cartItems = shoppingCart.getItems();  // Get items in the shopping cart

                // Add each cart item to the table
                for (CartItem item : cartItems) {
                    table.addCell(item.getProduct().getName());  // Assuming Product has Name
                    table.addCell(String.valueOf(item.getQuantity()));
                    BigDecimal price;

                    price = item.getPrice();  // Otherwise, use normal price


                    table.addCell(String.valueOf(price));  // Add the determined price to the cell

                    int quantity = item.getQuantity(); // Get the quantity as int

                    // Convert int quantity to BigDecimal
                    BigDecimal quantityAsBigDecimal = BigDecimal.valueOf(quantity);

                    // Perform multiplication
                    BigDecimal totalPrice = price.multiply(quantityAsBigDecimal);

                    // Add the result to the table
                    table.addCell(totalPrice.toString());
                    byte[] imageData = item.getProduct().getImageData(); // Assuming Product has ImageData
                    if (imageData != null && imageData.length > 0) {
                        try {
                            ImageData imageDataObj = ImageDataFactory.create(imageData); // Create image from raw data
                            Image image = new Image(imageDataObj).scaleToFit(50, 50); // Scale the image
                            table.addCell(new Cell().add(image)); // Add image to the table
                        } catch (Exception e) {
                            table.addCell("Image Error"); // Placeholder for errors
                        }
                    } else {
                        table.addCell("No Image"); // Placeholder for missing images
                    }
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