"use client";

import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface ModernFAQProps {
  className?: string;
}

const faqs = [
  {
    question: "What types of images can I deblur?",
    answer:
      "Our AI works best with motion blur, out-of-focus blur, and camera shake blur. We support JPEG, PNG, GIF, and WebP formats up to 10MB. The technology is most effective on photos with clear subjects and good lighting conditions.",
  },
  {
    question: "How long does the processing take?",
    answer:
      "Most images are processed within 15-30 seconds. Processing time depends on image size, complexity, and current server load. Pro users get priority processing for faster results.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "Absolutely. All images are processed on secure servers and automatically deleted after 24 hours. We never store, share, or use your images for any purpose other than the deblurring process. All data transfers are encrypted.",
  },
  {
    question: "What's the difference between the free and paid plans?",
    answer:
      "Free users can process 3 images per month with standard speed and 720p resolution. Pro users get 100 images monthly, priority processing, full resolution output, batch processing, and API access. Enterprise includes unlimited processing and premium support.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time with no penalty. You'll continue to have access to your plan features until the end of your current billing period. We also offer a 30-day money-back guarantee.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with the service for any reason, contact our support team within 30 days of your purchase for a full refund.",
  },
  {
    question: "Is there an API available?",
    answer:
      "Yes! Pro and Enterprise users get access to our REST API for automated image processing. The API includes batch processing, webhook notifications, and comprehensive documentation. Perfect for integrating into your applications.",
  },
  {
    question: "What if the deblurring doesn't work well on my image?",
    answer:
      "While our AI achieves excellent results on most images, some heavily degraded or extremely blurry images may have limited improvement potential. We're continuously improving our algorithms. If you're not satisfied with a result, contact support for assistance.",
  },
];

export default function ModernFAQ({
  className,
  ...props
}: React.ComponentProps<"section"> & ModernFAQProps) {
  return (
    <section
      className={cn("bg-background relative overflow-hidden py-24", className)}
      {...props}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, var(--primary) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="mb-16 text-center">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            FAQ
          </Badge>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Frequently Asked
            <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
              {" "}
              Questions
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
            Everything you need to know about ImageUnblur. Can&apos;t find the
            answer you&apos;re looking for?
            <a href="/contact" className="text-primary ml-1 hover:underline">
              Contact our support team
            </a>
            .
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-muted/30 hover:bg-muted/50 rounded-2xl border px-6 transition-colors duration-300"
              >
                <AccordionTrigger className="py-6 text-left hover:no-underline">
                  <span className="pr-4 text-lg font-semibold">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6">
                  <div className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="from-primary/10 border-primary/20 mx-auto max-w-2xl rounded-3xl border bg-gradient-to-r to-purple-500/10 p-8">
            <h3 className="mb-4 text-2xl font-bold">Still Have Questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our support team is here to help. Get in touch and we&apos;ll
              respond within 24 hours.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/docs"
                className="border-primary/20 text-primary hover:bg-primary/10 inline-flex items-center justify-center rounded-lg border px-6 py-3 font-medium transition-colors"
              >
                View Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
