package edu.sabanciuniv.cs308.service;

import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;

import java.io.File;
import java.util.Properties;

public class EmailSender {

    public static void sendEmailWithPdf(File pdfFile) {

        final String username = "jewelryshop308@gmail.com";
        final String password = "omcm vnot cykr uvjf"; // App-specific password

        // Email configuration properties
        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "465");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.socketFactory.port", "465");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        // Create session
        Session session = Session.getInstance(prop, new jakarta.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // Create a MimeMessage
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse("jewelryshop308@gmail.com, jewelryshop308@outlook.com") //test gmails
            );
            message.setSubject("Test Email with Generated PDF Attachment");

            // Create a multipart message
            Multipart multipart = new MimeMultipart();

            // Text part
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("Please find the attached PDF file.");
            multipart.addBodyPart(textPart);

            // File part
            MimeBodyPart filePart = new MimeBodyPart();
            DataSource source = new FileDataSource(pdfFile);
            filePart.setDataHandler(new DataHandler(source));
            filePart.setFileName(pdfFile.getName());
            multipart.addBodyPart(filePart);

            // Attach multipart to the message
            message.setContent(multipart);

            // Send the message
            Transport.send(message);

            System.out.println("Email with PDF sent successfully!");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // Path to save the generated PDF
        String pdfPath = "C:\\Users\\Hilal\\Documents\\generated_pdf.pdf";

        // Generate the PDF
        File pdfFile = PdfCreator.createPdf(pdfPath);

        // Send the email with the generated PDF
        if (pdfFile != null && pdfFile.exists()) {
            sendEmailWithPdf(pdfFile);
        } else {
            System.out.println("Failed to generate PDF. Email not sent.");
        }
    }
}
