// utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const emailTemplates = {
  adminNotification: (inquiry) => ({
    subject: `New Advertising Inquiry from ${inquiry.company_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .detail { margin-bottom: 10px; }
          .label { font-weight: bold; color: #2E7D32; }
          .footer { margin-top: 20px; padding: 20px; background: #eee; text-align: center; font-size: 12px; }
          .button { background: #2E7D32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Advertising Inquiry</h1>
          </div>
          <div class="content">
            <div class="detail"><span class="label">Company:</span> ${inquiry.company_name}</div>
            <div class="detail"><span class="label">Contact:</span> ${inquiry.contact_name}</div>
            <div class="detail"><span class="label">Email:</span> <a href="mailto:${inquiry.email}">${inquiry.email}</a></div>
            <div class="detail"><span class="label">Phone:</span> ${inquiry.phone || 'Not provided'}</div>
            <div class="detail"><span class="label">Business Type:</span> ${inquiry.business_type}</div>
            <div class="detail"><span class="label">Website:</span> ${inquiry.website ? `<a href="${inquiry.website}">${inquiry.website}</a>` : 'Not provided'}</div>
            <div class="detail"><span class="label">Budget:</span> R${inquiry.budget_range}</div>
            <div class="detail"><span class="label">Preferred Contact:</span> ${inquiry.preferred_contact_method}</div>
            ${inquiry.message ? `
            <div class="detail">
              <span class="label">Message:</span><br>
              ${inquiry.message}
            </div>
            ` : ''}
            <div style="margin-top: 20px;">
              <a href="mailto:${inquiry.email}?subject=Re: Advertising Inquiry - RentEkasi" class="button">
                Reply to ${inquiry.contact_name}
              </a>
            </div>
          </div>
          <div class="footer">
            <p>This inquiry was received from the RentEkasi advertising page on ${new Date(inquiry.created_at).toLocaleDateString()}</p>
            <p>IP Address: ${inquiry.ip_address}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  clientConfirmation: (inquiry) => ({
    subject: 'Thank you for your advertising inquiry - RentEkasi',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #2E7D32, #4CAF50); color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 5px; }
          .footer { margin-top: 20px; padding: 20px; background: #eee; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Interest</h1>
          </div>
          <div class="content">
            <p>Dear ${inquiry.contact_name},</p>
            <p>Thank you for your interest in advertising with <strong>RentEkasi</strong>!</p>
            <p>We have received your inquiry and our advertising team will contact you within <strong>24-48 hours</strong> to discuss your advertising needs.</p>
            <p><strong>Here's a summary of your inquiry:</strong></p>
            <ul>
              <li><strong>Company:</strong> ${inquiry.company_name}</li>
              <li><strong>Business Type:</strong> ${inquiry.business_type}</li>
              <li><strong>Budget Range:</strong> R${inquiry.budget_range}</li>
            </ul>
            <p>If you have any immediate questions, please feel free to reply to this email.</p>
            <p>Best regards,<br>The RentEkasi Team</p>
          </div>
          <div class="footer">
            <p>RentEkasi - Trusted Township Rentals</p>
            <p>Email: advertising@rentekasi.com | Phone: +27 XXX XXX XXXX</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Send advertising inquiry notifications
const sendAdvertisingNotifications = async (inquiry) => {
  try {
    // Send to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'your-admin@rentekasi.com';
    const adminTemplate = emailTemplates.adminNotification(inquiry);
    await sendEmail(adminEmail, adminTemplate.subject, adminTemplate.html);

    // Send confirmation to client
    const clientTemplate = emailTemplates.clientConfirmation(inquiry);
    await sendEmail(inquiry.email, clientTemplate.subject, clientTemplate.html);

    console.log('All advertising notification emails sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending advertising notifications:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendAdvertisingNotifications,
  emailTemplates
};