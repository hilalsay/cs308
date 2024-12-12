package edu.sabanciuniv.cs308.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import java.io.File;

public class PdfCreator {

    public static File createPdf(String outputPath) {
        try {
            // Initialize the PDF writer
            PdfWriter writer = new PdfWriter(outputPath);

            // Initialize the PDF document
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Add content to the document
            document.add(new Paragraph("Hello! Thank you for shopping from us."));

            // Close the document
            document.close();

            System.out.println("PDF created at: " + outputPath);
            return new File(outputPath);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

