"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { IoChevronForward } from "react-icons/io5";

export default function FAQSection() {
  const faqItems = [
    {
      id: "item-1",
      question: "What is Webflow and why is it the best website builder?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: "item-2",
      question: "What is your favorite template from BRIX Templates?",
      answer: "Your favorite template content goes here.",
    },
    {
      id: "item-3",
      question: "How do you clone a Webflow Template from the Showcase?",
      answer: "Instructions for cloning a Webflow Template go here.",
    },
    {
      id: "item-4",
      question: "Why is BRIX Templates the best Webflow agency out there?",
      answer: "Answer about BRIX Templates goes here.",
    },
  ];

  return (
    <section className="px-1 md:px-8 py-10 border-4 bg-[#1A63FF14] font-albert">
      <div className="container mx-auto">
        <h4 className="text-[#073493] text-xl font-semibold text-center py-6">
          Frequently Asked Questions
        </h4>

        <div className="md:w-1/2 mx-auto">
          <Accordion.Root
            type="single"
            collapsible
            className="flex flex-col gap-2">
            {faqItems.map((item) => (
              <Accordion.Item
                key={item.id}
                value={item.id}
                className="bg-white rounded-xl p-4 border border-transparent data-[state=open]:border-[#1A63FF]">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full justify-between items-center font-semibold py-2 group">
                    {item.question}
                    <div
                      className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full flex shadow-lg items-center justify-center 
                       transition-all
                       group-data-[state=open]:bg-[#1A63FF] 
                       group-data-[state=open]:text-white 
                       group-data-[state=closed]:bg-white 
                       group-data-[state=closed]:text-[#1A63FF]">
                      <IoChevronForward
                        className="text-[18px] transition-transform duration-300
                         group-data-[state=open]:rotate-90"
                      />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="mt-2 text-sm opacity-75">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
