package com.exam.service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.exam.entity.Payment;
import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;

import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PdfService {

    @org.springframework.transaction.annotation.Transactional
    public byte[] generateReceipt(Payment payment) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font Styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            // Title
            Paragraph title = new Paragraph("Prime Properties - Payment Receipt", titleFont);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Payment Details
            addDetail(document, "Transaction ID:",
                    (payment.getTransactionId() != null) ? payment.getTransactionId() : "N/A", headerFont, bodyFont);
            addDetail(document, "Payment Date:",
                    (payment.getPaymentTime() != null)
                            ? payment.getPaymentTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                            : "N/A",
                    headerFont, bodyFont);
            addDetail(document, "Payment Method:", (payment.getMethod() != null) ? payment.getMethod().name() : "N/A",
                    headerFont, bodyFont);
            addDetail(document, "Payment Status:", (payment.getStatus() != null) ? payment.getStatus().name() : "N/A",
                    headerFont, bodyFont);
            addDetail(document, "Amount Paid:", String.format("$%.2f", payment.getAmount()), headerFont, bodyFont);

            document.add(new Paragraph("\n")); // Space

            // Booking & Property Details (Defensive Null Checks)
            var booking = payment.getBooking();
            String bookingId = "N/A";
            String propertyTitle = "Unknown Property";
            String customerName = "Unknown Customer";
            String customerEmail = "N/A";

            if (booking != null) {
                bookingId = String.valueOf(booking.getId());
                var appt = booking.getAppointment();
                if (appt != null) {
                    if (appt.getProperty() != null) {
                        propertyTitle = appt.getProperty().getTitle();
                    }
                    if (appt.getCustomer() != null) {
                        customerName = appt.getCustomer().getName();
                        customerEmail = appt.getCustomer().getEmail();
                    }
                }
            }

            addDetail(document, "Booking Ref:", bookingId, headerFont, bodyFont);
            addDetail(document, "Property:", propertyTitle, headerFont, bodyFont);
            addDetail(document, "Customer Name:", customerName, headerFont, bodyFont);
            addDetail(document, "Customer Email:", customerEmail, headerFont, bodyFont);

            // Footer
            Paragraph footer = new Paragraph("\n\nThank you for choosing Prime Properties!", bodyFont);
            footer.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(footer);

            document.close();

        } catch (Exception e) {
            e.printStackTrace(); // Log the actual error
            throw new RuntimeException("Error generating PDF receipt: " + e.getMessage(), e);
        }

        return out.toByteArray();
    }

    private void addDetail(Document doc, String label, String value, Font headerFont, Font bodyFont) throws Exception {
        Paragraph p = new Paragraph();
        p.add(new Paragraph(label + " ", headerFont));
        p.add(new Paragraph(value, bodyFont));
        p.setSpacingAfter(5);
        doc.add(p);
    }
}
