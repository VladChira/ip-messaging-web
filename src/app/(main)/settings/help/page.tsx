"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Shield } from "lucide-react";

export default function HelpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Contact form submission logic will go here
    console.log("Form submitted:", { name, email, message });
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
    // Show success message or redirect
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Help</h1>
      
      <Tabs defaultValue="help-center" className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="help-center" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Help Center
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Contact Devs
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </TabsTrigger>
        </TabsList>

        {/* Help Center Tab */}
        <TabsContent value="help-center">
          <Card>
            <CardHeader>
              <CardTitle>Help Center</CardTitle>
              <CardDescription>
                Find answers to commonly asked questions about our messaging app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create a new chat?</AccordionTrigger>
                  <AccordionContent>
                    To create a new chat, click on the &quot;New&quot; button at the top of your chats list. 
                    You can then select a user to start a conversation with.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I delete a message?</AccordionTrigger>
                  <AccordionContent>
                    To delete a message, hover over it and click on the three dots menu that appears.
                    Select &quot;Delete&quot; from the dropdown menu. Note that deleted messages
                    cannot be recovered.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Can I use this app on multiple devices?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can use our messaging app on multiple devices. Simply log in with
                    your account credentials, and your chats will be synchronized across all your
                    devices.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How secure are my messages?</AccordionTrigger>
                  <AccordionContent>
                    All messages are encrypted end-to-end, meaning only you and the recipient
                    can read them. We do not store messages on our servers after they have been
                    delivered.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I change my account settings?</AccordionTrigger>
                  <AccordionContent>
                    To access your account settings, click on your profile picture in the top
                    right corner and select &quot;Settings&quot; from the dropdown menu. There,
                    you can update your profile, change your password, and manage notification
                    preferences.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Devs Tab */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Developers</CardTitle>
              <CardDescription>
                Have a question or feedback? Reach out to our development team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or feedback"
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-medium mb-2">Alternative Contact Methods</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For urgent matters, you can reach us at:
                </p>
                <ul className="text-sm space-y-1">
                  <li>Email: support@yourapp.com</li>
                  <li>Twitter: @yourapp_support</li>
                  <li>GitHub: github.com/yourapp/issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Policy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
              <CardDescription>
                Last updated: May 12, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">1. Introduction</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to our Privacy Policy. This document explains how we collect, use, and protect
                  your personal information when you use our messaging application.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">2. Information We Collect</h3>
                <p className="text-sm text-muted-foreground">
                  We collect information that you provide directly to us, such as your name, email address,
                  and profile information. We also collect usage data, including message metadata (but not
                  message content), device information, and IP addresses.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">3. How We Use Your Information</h3>
                <p className="text-sm text-muted-foreground">
                  We use your information to provide, maintain, and improve our services, to communicate with
                  you, and to ensure the security of our platform. We do not sell your personal information to
                  third parties.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">4. Data Security</h3>
                <p className="text-sm text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction. All messages are encrypted
                  end-to-end.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">5. Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  You have the right to access, correct, or delete your personal information. You can also
                  request a copy of the data we hold about you. To exercise these rights, please contact us
                  through the contact form provided.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">6. Changes to This Policy</h3>
                <p className="text-sm text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by
                  posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">7. Contact Us</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us through the Contact
                  Developers section of this Help page.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}