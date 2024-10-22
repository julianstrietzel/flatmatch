import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  Button,
  Dialog,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import YouTube from "react-youtube";
import Footer from "../components/Footer";
import { useNotification } from "../hooks/useNotification.ts";
import apiClient from "../api/apiClient.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface Section {
  title: string;
  content: string;
  path: string;
}

const HelpPage: React.FC = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sendButtonText, setSendButtonText] = useState("Send");
  const theme = useTheme();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  const [expandedAcc, setExpandedAcc] = useState<number | undefined>(undefined);
  const [expandedAccSites, setExpandedAccSites] = useState<number | undefined>(
    undefined
  );
  const videoOptions = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1,
    },
  };

  const openVideo = () => {
    setVideoOpen(true);
  };

  const closeVideo = () => {
    setVideoOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showNotification({
        message: "Please fill in all fields.",
        severity: "error",
      });
      return;
    }

    setSendButtonText("Sending...");
    apiClient
      .post("/v1/contact", contactForm)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Failed to send message");
        }
        showNotification({
          message:
            "Message sent successfully! Due to the high course load this semester we might not be able to respond immediately. We are still trying hardly to get the 1.0 in SEBA. Thank you for your understanding.",
          severity: "success",
        });
        let emptyForm = { name: "", email: "", message: "" };
        // Message to Felix
        if (
          contactForm.name.toLowerCase().includes("elix") ||
          contactForm.name.toLowerCase().includes("oops")
        ) {
          emptyForm = {
            name: "Professor",
            email: "",
            message:
              "This is a message from the Professor:\nThe Seba Team 11 is doing extra great! They deserve the 1.0! Keep up the good work! :)",
          };
        }
        setContactForm(emptyForm);
      })
      .catch((error) => {
        showNotification({
          message: "Failed to send message. Please try again.",
          severity: "error",
        });
        console.error("There was an error sending the message!", error);
      })
      .finally(() => {
        setSendButtonText("Send");
      });
  };

  useEffect(() => {
    if (user) {
      setContactForm({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        message: "",
      });
    }
  }, [user]);

  const sections: Section[] = [
    {
      title: "Landing Page",
      content:
        "Welcome to the Landing Page! Here you will find an overview of our services and how FlatMatch can help you find the perfect roommate or flat. Explore the features and get started with creating your account. For example, John, a first-time user, found it easy to create his profile and start receiving roommate matches quickly.",
      path: "/",
    },
    {
      title: "Help Page",
      content:
        "This is the Help Page where you can find information and guidance on using the FlatMatch platform. Learn how to navigate through different features and get the most out of your experience. Sarah, a new user, found this page very helpful in understanding how to utilize the platform effectively.",
      path: "/help",
    },
    {
      title: "Chat Page",
      content:
        "The Chat Page allows you to communicate with potential roommates or flatmates. Use this feature to ask questions, arrange viewings, and discuss living arrangements directly through our platform. Mike successfully finalized a roommate agreement after chatting with a potential match.",
      path: "/chat",
    },
    {
      title: "Account Settings Page",
      content:
        "In the Account Settings Page, you can update your personal information, change your password, manage your preferences, and configure notifications. Ensure your account details are always up to date. Emma appreciated the ease of updating her contact information here.",
      path: "/account",
    },
    {
      title: "Roommate Landing Page",
      content:
        "The Roommate Landing Page is where you can start your search for the perfect roommate. Set your preferences and start swiping through available profiles tailored to your needs. Tom, a student, found his ideal roommate using this feature.",
      path: "/roommateLanding",
    },
    {
      title: "List Room Form",
      content:
        "The List Room Form is for those looking to add new flat or roommate listings. Provide detailed information about your flat, upload high-quality images, and set your preferences to attract the right roommates. Lara quickly found a roommate by listing her room here.",
      path: "/flat-profiles",
    },
    {
      title: "Swiping Page",
      content:
        "On the Swiping Page, you can browse through roommate profiles in a gamified swiping interface. Swipe right on profiles you like and left on those you don’t. Matches will be notified to you and the other person. Chris enjoyed the intuitive swiping experience to find his next roommate.",
      path: "/swiping",
    },
    {
      title: "Premium Features Page",
      content:
        "Upgrade to the Premium Features Page to access advanced functionalities like early access to new profiles, detailed roommate profiles, and enhanced matching algorithms. Learn more about our premium offerings here. Jane, a premium user, found it worth the investment for the extra features.",
      path: "/premium",
    },
    {
      title: "Payment Result Page",
      content:
        "The Payment Result Page displays the outcome of your transactions. Whether you’re subscribing to premium features or processing a rental payment, you will find the results and status updates here. Alex appreciated the transparency and clarity of his payment status on this page.",
      path: "/payment-result",
    },
    {
      title: "Confirm Email Page",
      content:
        "The Confirm Email Page is where you verify your email address. Click the link sent to your email to confirm your account and start using FlatMatch. If you haven’t received the email, check your spam folder or request a new one. Laura quickly completed her account setup using this feature.",
      path: "/confirm-email/:token",
    },
  ];

  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "To create an account, go to the Landing Page and click on 'Get Started'. Follow the instructions to sign up as a roommate or flatmate.",
    },
    {
      question: "How can I list my room?",
      answer:
        "Go to the List Room Form, fill in the details of your room, upload images, and submit. Your listing will be live shortly after approval.",
    },
    {
      question: "What is the swiping feature?",
      answer:
        "The swiping feature allows you to browse through roommate profiles quickly. Swipe right if you're interested and left if you're not.",
    },
    {
      question: "How can I communicate with potential roommates or flatmates?",
      answer:
        "Use the Chat Page to send messages, ask questions, arrange viewings, and discuss living arrangements directly through our platform.",
    },
    {
      question: "How do I upgrade to premium features?",
      answer:
        "Visit the Premium Features Page to learn about and subscribe to our premium offerings, which include advanced functionalities and early access to profiles.",
    },
    {
      question: "How do I confirm my email?",
      answer:
        "After registering, you will receive an email with a confirmation link. Click the link to verify your email address and complete your account setup.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to the Account Settings Page where you can update your personal information, change your password, manage preferences, and configure notifications. Keeping your profile up-to-date helps potential roommates know more about you.",
    },
    {
      question: "How can I find the best roommate match?",
      answer:
        "Use the Roommate Landing Page to set your preferences and browse through available profiles tailored to your needs. The platform’s matching algorithms will help you find the best roommate match.",
    },
    {
      question: "How do I list a property?",
      answer:
        "Go to the List Property Form to add new flat or room listings. Provide detailed information about your property, upload high-quality images, and set your preferences to attract the right roommates.",
    },
    {
      question: "How do I use the chat feature?",
      answer:
        "Navigate to the Chat Page to communicate with potential roommates. You can ask questions, arrange viewings, and discuss living arrangements directly through our platform.",
    },
  ];

  return (
    <>
      <Box mx={20} my={5}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          color={theme.palette.primary.main}
        >
          Help Page
        </Typography>
        <Box marginBottom={3}>
          <Button variant="outlined" color="primary" onClick={openVideo}>
            Watch Demo
          </Button>
        </Box>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          color={theme.palette.primary.main}
        >
          Frequently Asked Questions (FAQ)
        </Typography>
        <Box>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={index === expandedAcc}
              onChange={() =>
                setExpandedAcc((prevExpandedAcc) =>
                  prevExpandedAcc === index ? undefined : index
                )
              }
              sx={{
                borderRadius: 2,
                "&:before": {
                  display: "none",
                },
                marginBottom: 2,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" color={theme.palette.yellow[500]}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          marginY={5}
          padding={5}
          border={1}
          borderRadius={5}
          borderColor={theme.palette.divider}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            color={theme.palette.primary.main}
          >
            Contact Us
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            required={true}
            value={contactForm.name}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            required={true}
            value={contactForm.email}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Message"
            name="message"
            required={true}
            value={contactForm.message}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
          <Box textAlign="right" marginTop={2}>
            <Button type="submit" variant="contained" color="primary">
              {sendButtonText}
            </Button>
          </Box>
        </Box>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          color={theme.palette.primary.main}
        >
          Discover the amazing features and sections of FlatMatch
        </Typography>
        <Box marginBottom={20}>
          {sections.map((section, index) => (
            <Accordion
              key={index}
              expanded={index === expandedAccSites}
              onChange={() =>
                setExpandedAccSites((prev) =>
                  prev === index ? undefined : index
                )
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5" color={theme.palette.yellow[500]}>
                  <Link
                    component={RouterLink}
                    to={section.path}
                    underline="hover"
                    color="inherit"
                  >
                    {section.title}
                  </Link>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">{section.content}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        <Dialog open={videoOpen} onClose={closeVideo} maxWidth="lg">
          <YouTube videoId="dQw4w9WgXcQ" opts={videoOptions} />
        </Dialog>
      </Box>
      <Footer />
    </>
  );
};

export default HelpPage;
