import React, { useState } from 'react';
import { Resend } from 'resend';
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageSquare, Send, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const ContactPage = () => {
  const {toast} = useToast();
  const [data, setData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast({
      title: "Status",
      description: "Sending...",
    });

    try {
      const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

      await resend.emails.send({
        from: 'contact@psyq.com', // Verified domain email
        to: 'nathanieltjames24@gmail.com', // Where you want to receive messages
        subject: `PsyQ: Contact Form Inquiry from ${data.name}`,
        text: `
          Name: ${data.name}
          Email: ${data.email}
          Message: ${data.message}
        `,
      });

      toast({
        title: "Success",
        description: "Message sent successfully!",
      });
      setData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-400">
            Have questions about PsyQ? Our team is here to help you optimize your trading journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-gray-400 mb-2">We'll respond within 24 hours</p>
            <a href="mailto:support@psyq.ai" className="text-primary hover:text-emerald-300">
              support@psyq.ai
            </a>
          </Card>

          <Card className="p-6">
            <MessageSquare className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Issues</h3>
            <p className="text-gray-400 mb-2">Found a bug or issue? let us know</p>
            <button className="text-primary hover:text-emerald-300">
              Get Started
            </button>
          </Card>

          <Card className="p-6">
            <Clock className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Support Hours</h3>
            <p className="text-gray-400">Mon - Fri: 9AM - 6PM EST</p>
            <p className="text-gray-400">Weekend: 10AM - 4PM EST</p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <Card className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </Label>
                <Input
                  type="text"
                  className="border-gray-600"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </Label>
                <Input
                  type="email"
                  className="border-gray-600"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </Label>
                <Textarea
                  rows={4}
                  className="border-gray-600"
                  value={data.message}
                  onChange={handleChange}
                  placeholder="Enter your message" 
                />
              </div>

              <Button
                type="submit"
                className="w-full px-8 py-3 bg-primary hover:bg-emerald-300"
              >
                Send Message
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What's included in the free trial?",
                  a: "The Free Beata is a free trial includes basic trade tracking, performance metrics, and AI insights to help you experience the power of PsyQ for a limited of time, we do this in the hopes that our users will give us feedback about the app."
                },
                {
                  q: "Can I import my existing trade history?",
                  a: "Yes! You can import your trading history via CSV or connect directly with supported brokers for automatic trade synchronization."
                },
                {
                  q: "How does the AI analysis work?",
                  a: "Our AI analyzes your trading patterns, emotional responses, and market conditions to identify behavioral patterns and provide actionable insights."
                }
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
