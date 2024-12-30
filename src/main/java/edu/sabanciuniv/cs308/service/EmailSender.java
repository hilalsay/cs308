package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.*;
import edu.sabanciuniv.cs308.repo.*;
import jakarta.activation.DataHandler;
import jakarta.activation.DataSource;
import jakarta.activation.FileDataSource;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Properties;
import java.util.UUID;

@Service
public class EmailSender {

    @Autowired
    private RefundRequestRepo refundRequestRepo;


    public void sendEmailWithPdf(String recipientEmail ,String pdfFilePath) {
        System.out.println(recipientEmail);
        File pdfFile = new File(pdfFilePath);
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
        Session session = Session.getInstance(prop, new Authenticator() {
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
                    InternetAddress.parse(recipientEmail) //test gmails
            );
            message.setSubject("Thank you for shopping from us! Hope to see you again.");

            // Create a multipart message
            Multipart multipart = new MimeMultipart();

            // Text part
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("Please find your invoice in the attached PDF file.");
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

<<<<<<< Updated upstream
    public void sendEmailForRefund(String recipientEmail, UUID refundId) {
        System.out.println(recipientEmail);
=======
    public void sendSimpleEmail(String recipientEmail, String subject, String body) {
>>>>>>> Stashed changes
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
        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
<<<<<<< Updated upstream
            RefundRequest refundRequest = refundRequestRepo.findById(refundId).get();


=======
>>>>>>> Stashed changes
            // Create a MimeMessage
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
<<<<<<< Updated upstream
                    InternetAddress.parse(recipientEmail) //test gmails
            );
            message.setSubject("Your Refund Request Has Been Successfully Processed");

            // Create a multipart message
            Multipart multipart = new MimeMultipart();

            // Text part
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("Our refund request has been successfully processed and approved. A refund of " + refundRequest.getRefundAmount() + " has been credited to your original payment account for the product " + refundRequest.getProduct().getName());
            multipart.addBodyPart(textPart);



            // Attach multipart to the message
            message.setContent(multipart);
=======
                    InternetAddress.parse(recipientEmail)
            );
            message.setSubject(subject);
            message.setText(body);
>>>>>>> Stashed changes

            // Send the message
            Transport.send(message);

<<<<<<< Updated upstream
            System.out.println("Email with PDF sent successfully!");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    public void sendEmailForRefundReject(String recipientEmail, UUID refundId) {
        System.out.println(recipientEmail);
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
        Session session = Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            RefundRequest refundRequest = refundRequestRepo.findById(refundId).get();


            // Create a MimeMessage
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipientEmail) //test gmails
            );
            message.setSubject("Your Refund Request Has Been Rejected");

            // Create a multipart message
            Multipart multipart = new MimeMultipart();

            // Text part
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("We have reviewed your refund request for the product " + refundRequest.getProduct().getName() + " from your order placed on "+ refundRequest.getOrder().getPaymentDate()+". Unfortunately, we are unable to process your request");
            multipart.addBodyPart(textPart);



            // Attach multipart to the message
            message.setContent(multipart);

            // Send the message
            Transport.send(message);

            System.out.println("Email with PDF sent successfully!");
=======
            System.out.println("Simple email sent successfully!");
>>>>>>> Stashed changes

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
