package edu.sabanciuniv.cs308.service;

import edu.sabanciuniv.cs308.model.RefundRequest;
import edu.sabanciuniv.cs308.repo.RefundRequestRepo;
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

    private final String username = "jewelryshop308@gmail.com";
    private final String password = "omcm vnot cykr uvjf"; // App-specific password

    private Session createEmailSession() {
        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "465");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.socketFactory.port", "465");
        prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

        return Session.getInstance(prop, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void sendEmailWithPdf(String recipientEmail, String pdfFilePath) {
        try {
            Session session = createEmailSession();
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("Thank you for shopping from us! Hope to see you again.");

            Multipart multipart = new MimeMultipart();

            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("Please find your invoice in the attached PDF file.");
            multipart.addBodyPart(textPart);

            MimeBodyPart filePart = new MimeBodyPart();
            DataSource source = new FileDataSource(new File(pdfFilePath));
            filePart.setDataHandler(new DataHandler(source));
            filePart.setFileName(new File(pdfFilePath).getName());
            multipart.addBodyPart(filePart);

            message.setContent(multipart);

            Transport.send(message);
            System.out.println("Email with PDF sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendEmailForRefund(String recipientEmail, UUID refundId) {
        try {
            RefundRequest refundRequest = refundRequestRepo.findById(refundId).orElseThrow(() -> new IllegalArgumentException("Refund request not found"));

            String subject = "Your Refund Request Has Been Successfully Processed";
            String body = "Your refund request has been successfully processed and approved. A refund of "
                    + refundRequest.getRefundAmount() + " has been credited to your original payment account for the product "
                    + refundRequest.getProduct().getName() + ".";

            sendSimpleEmail(recipientEmail, subject, body);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendEmailForRefundReject(String recipientEmail, UUID refundId) {
        try {
            RefundRequest refundRequest = refundRequestRepo.findById(refundId).orElseThrow(() -> new IllegalArgumentException("Refund request not found"));

            String subject = "Your Refund Request Has Been Rejected";
            String body = "We have reviewed your refund request for the product "
                    + refundRequest.getProduct().getName() + " from your order placed on "
                    + refundRequest.getOrder().getPaymentDate() + ". Unfortunately, we are unable to process your request.";

            sendSimpleEmail(recipientEmail, subject, body);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendSimpleEmail(String recipientEmail, String subject, String body) {
        try {
            Session session = createEmailSession();
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject(subject);
            message.setText(body);

            Transport.send(message);
            System.out.println("Simple email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}