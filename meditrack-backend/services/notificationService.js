const db = require('../models');
const Notification = db.Notification;
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Replace with your SMTP host
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

class NotificationService {
  // Create and send a notification
  static async createNotification(userId, type, title, message, metadata = {}) {
    // Create in-app notification
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      metadata,
      isRead: false
    });

    // Send email notification
    await this.sendEmailNotification(userId, title, message, type);

    return notification;
  }

  // Send email notification
  static async sendEmailNotification(userId, subject, message, type) {
    try {
      // In a real app, you would fetch the user's email from the database
      // For now, we'll use the userId as the email for testing
      const mailOptions = {
        from: `"MediTrack" <${process.env.EMAIL_FROM || 'noreply@meditrack.com'}>`,
        to: userId, // Replace with user.email in production
        subject: `[MediTrack] ${subject}`,
        text: message,
        html: this.getEmailTemplate(type, message, subject)
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email notification:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  // Get unread notifications for a user
  static async getUnreadNotifications(userId) {
    return Notification.findAll({
      where: {
        userId,
        isRead: false
      },
      order: [['createdAt', 'DESC']]
    });
  }

  // Mark notifications as read
  static async markAsRead(notificationIds, userId) {
    return Notification.update(
      { isRead: true },
      {
        where: {
          id: { [Op.in]: notificationIds },
          userId
        }
      }
    );
  }

  // Email template generator
  static getEmailTemplate(type, message, title) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
            .button { 
              display: inline-block; 
              padding: 10px 20px; 
              margin: 20px 0; 
              background-color: #4CAF50; 
              color: white; 
              text-decoration: none; 
              border-radius: 4px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${title}</h2>
            </div>
            <div class="content">
              <p>${message}</p>
              <p>Thank you for using MediTrack.</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} MediTrack. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = NotificationService;
