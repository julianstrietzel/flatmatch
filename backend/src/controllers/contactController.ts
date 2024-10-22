import { Request, Response } from "express";
import { transporter } from "../services/authService";
import dotenv from "dotenv";
import mongoose from "mongoose";

interface IContactForm {
  name: string;
  email: string;
  message: string;
  timestamp?: Date;
}

const contactFormModel = mongoose.model<IContactForm>(
  "ContactForm",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  })
);

dotenv.config();

export const sendContactEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    const contactForm = new contactFormModel({ name, email, message });
    await contactForm.save();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Contact Form Submission",
      text:
        "Dear " +
        name +
        ",\nThank you for your message. Due to the high course load this semester we might not be able to respond immediately. We are still trying hardly to get the 1.0 in SEBA. Thank you for your understanding.\n" +
        "Here is a copy of your message:\n" +
        message,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      text: "Name: " + name + "\nEmail: " + email + "\nMessage: " + message,
    });
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
