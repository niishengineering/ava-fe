// import Image from "next/image";
// import localFont from "next/font/local";
// import { Flex,Heading,Input,IconButton,Box} from "@chakra-ui/react";
// import { FaLessThan } from "react-icons/fa";
// import { GiHamburgerMenu } from "react-icons/gi";
// import { FaTimes } from "react-icons/fa";
// import { GrFormAttachment } from "react-icons/gr";
// import { FaPaperclip, FaSmile } from "react-icons/fa";
// import EmojiPicker from 'emoji-picker-react';
// import { useSession } from 'next-auth/react';
// import { IoMdSend } from "react-icons/io";
// import { useEffect, useState, useRef } from 'react';
// import io from 'socket.io-client';
// import Cookies from 'js-cookie';
// import { v4 as uuidv4 } from 'uuid';
// import { useCreateNewCustomer } from "@/libs/Hooks/customerHooks";

import { useEffect, useRef, useState } from "react";
import { CiCircleChevRight } from "react-icons/ci";
import { IoChevronDownCircle } from "react-icons/io5";

import { IoChevronDown, IoMenuOutline, IoClose } from "react-icons/io5";
import NavBar from "@/libs/Components/website/NavBar";
import FAQSection from "@/libs/Components/website/FAQAccordion";
import Footer from "@/libs/Components/website/Footer";

type Step = {
  number: string;
  text: string;
  image: string;
};

const stepsData: Step[] = [
  { number: "1", text: "Sign Up & Connect", image: "/step-1.png" },
  { number: "2", text: "Manage All Chats", image: "/step-2.png" },
  { number: "3", text: "Organize & Respond", image: "/step-3.png" },
  { number: "4", text: "Analyze & Improve", image: "/step-4.png" },
];

export default function StepByStepReveal() {
  const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const stepIndexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationStartedRef = useRef(false); // Prevent retrigger

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items (you can customize these)
  // Navigation items (you can customize these)
  const navItems = [
    {
      label: "Products",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { label: "Live Chat", href: "products/live-chat", icon: "💬" },
        { label: "Knowledge Base", href: "#", icon: "📚" },
        { label: "Contacts (CRM)", href: "#", icon: "👥" },
      ],
    },
    {
      label: "Services",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { label: "Hire Chat Agents", href: "#" },
        { label: "Virtual Assistants", href: "#" },
      ],
    },
    {
      label: "Resources",
      href: "#",
      hasDropdown: true,
      dropdownItems: [
        { label: "Help Center", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Customer Stories", href: "#" },
      ],
    },
  ];

  // Handle auth button clicks
  const handleLogin = () => {
    console.log("Login clicked");
    // Add login logic here
  };

  const handleSignup = () => {
    console.log("Signup clicked");
    // Add signup logic here
  };

  const showNextStep = () => {
    const stepIndex = stepIndexRef.current;

    if (stepIndex < stepsData.length) {
      setVisibleSteps((prev) => [...prev, stepsData[stepIndex]]);
      setCurrentStepIndex(stepIndex);
      stepIndexRef.current += 1;

      timeoutRef.current = setTimeout(showNextStep, 2000);
    } else {
      timeoutRef.current = setTimeout(() => {
        stepIndexRef.current = 0;
        setVisibleSteps([]);
        setCurrentStepIndex(-1);
        timeoutRef.current = setTimeout(showNextStep, 0);
      }, 3000);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationStartedRef.current) {
          animationStartedRef.current = true;
          showNextStep();
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
      }
    );

    const current = containerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted:", {
      name,
      email,
      message,
    });
  };

  return (
    <>
      {/* section 1 */}
      <section className=" px-8 py-6 xl:h-screen relative bg-[url('/Rectangle.png')] bg-contain bg-top bg-no-repeat font-albert">
        <div className="container mx-auto">
          <NavBar
            navItems={navItems}
            onLoginClick={handleLogin}
            onSignupClick={handleSignup}
          />
          {/* section 2 */}

          {/* main content text*/}
          <div className="flex flex-col gap-3 items-start">
            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center justify-between  w-full  ">
              <div className="text-left ">
                <img src="stars.png" alt="Stars" className="mt-0 md:mt-2  " />

                <h1 className="text-3xl md:text-5xl  font-bold leading-relaxed mt-">
                  Manage and
                  <br />
                  Respond to <span className="text-[#BD3D44]">Chats</span>
                  <br />
                  Seamlessly
                </h1>
                <p className="py-4 text-base md:text-lg text-gray-700">
                  Empower your virtual assistants with a real-time chat
                  <br />
                  dashboard that connects directly to your website.
                </p>
                <div className="flex justify-center md:justify-start w-full">
                  <button className="bg-[#192F5D] w-40 md:w-48 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">
                    Get Started
                  </button>
                </div>
              </div>

              <img
                src="desktop.png"
                alt="Desktop view"
                className="w-full max-w-xs md:max-w-md"
              />
            </div>
          </div>
        </div>
      </section>
      {/* section 2 */}
      <section className="px-8 py-6 bg-[#F9FAFC] font-albert">
        <div className="container mx-auto">
          <div className="text-center p-4">
            <h3 className="text-2xl font-bold">
              Built for Speed, Efficiency & Smarter
              <br /> Conversations
            </h3>
            <p className="opacity-75">
              Built to Optimize Every Chat, Every Interaction, Every Time.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-stretch  justify-center  gap-6 py-10 ">
            {/* Card 1 */}
            <div className="flex-1 max-w-sm  ">
              <div className="h-full max-w-sm w-full rounded border bg-[#1A63FF0D] p-4 hover:shadow-lg">
                <img src="Icon Image1.png" alt="Card image" />
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">
                    Real-Time Analytics
                  </h2>
                  <p className="text-gray-700 text-base">
                    Monitor response time, customer satisfaction, chat volume,
                    and agent performance with real-time reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-1 max-w-sm">
              <div className="h-full max-w-sm w-full rounded border bg-[#1A63FF0D] p-4 hover:shadow-lg">
                <img src="Icon Image2.png" alt="Card image" />
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">
                    All-in-One Chat Management.
                  </h2>
                  <p className="text-gray-700 text-base">
                    Keep track of multiple conversations in a centralized
                    dashboard, assign chats, and provide instant support
                    effortlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex-1 max-w-sm">
              <div className="h-full max-w-sm w-full rounded border bg-[#1A63FF0D] p-4 hover:shadow-lg">
                <img src="Icon Image3.png" alt="Card image" />
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">
                    Intelligent Chat Routing
                  </h2>
                  <p className="text-gray-700 text-base">
                    Automatically assign chats to the right assistant based on
                    expertise, availability, or past interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 3*/}
      <section className="bg-[url('/dark-background.png')] relative bg-cover bg-no-repeat bg-center font-albert ">
        <div className="container mx-auto">
          <div className="px-4 md:px-8 py-6">
            <div>
              <h5 className="text-white font-bold text-2xl text-center py-4">
                Smart Workforce Solutions for Your Business
              </h5>
            </div>

            {/* Block 1 */}
            <div className="flex flex-col md:flex-row justify-between items-center py-12 gap-6">
              <div className="text-white md:w-1/2">
                <h5 className="font-bold py-2 text-2xl">Hire Chat Agents</h5>
                <p className="opacity-75 text-xl">
                  Create and automate your customer <br />
                  communications and access the <br />
                  limitless power of AI right inside <br />
                  Deskmayte Chat App
                  <img src="/Frame.png" alt="" className="mt-2" />
                </p>
              </div>
              <div className="md:w-1/2">
                <img src="/Rectangle (1).png" alt="" className="w-full" />
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex flex-col md:flex-row-reverse justify-between items-center py-12 gap-6">
              <div className="text-white md:w-1/2">
                <h5 className="font-bold py-2 text-2xl">
                  Virtual Assistant Services
                </h5>
                <p className="opacity-75 text-xl">
                  Create and automate your customer <br />
                  communications and access the limitless <br />
                  power of AI right inside Deskmayte Chat <br />
                  App
                  <img src="/Frame.png" alt="" className="mt-2" />
                </p>
              </div>
              <div className="md:w-1/2">
                <img src="/Rectangle (2).png" alt="" className="w-full" />
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex flex-col md:flex-row justify-between items-center py-12 gap-6">
              <div className="text-white md:w-1/2">
                <h5 className="font-bold py-2 text-2xl">Remove Branding</h5>
                <p className="opacity-75 text-xl">
                  Truly customize the Deskmayte widget <br />
                  and email and create a more professional <br />
                  messaging experience for your visitors by <br />
                  removing or replacing the Deskmayte <br />
                  brand with your own
                  <img src="/Frame.png" alt="" className="mt-2" />
                </p>
              </div>
              <div className="md:w-1/2">
                <img src="/Rectangle (3).png" alt="" className="w-full" />
              </div>
            </div>

            {/* Block 4 */}
            <div className="flex flex-col md:flex-row-reverse justify-between items-center py-12 gap-6">
              <div className="text-white md:w-1/2">
                <h5 className="font-bold py-2 text-2xl">Knowledge Base</h5>
                <p className="opacity-75 text-xl">
                  Easily share your knowledge with a <br />
                  free, customizable Knowledge Base <br />
                  that streamlines support.
                  <img src="/Frame.png" alt="" className="mt-2" />
                </p>
              </div>
              <div className="md:w-1/2">
                <img src="/Rectangle (2).png" alt="" className="w-full" />
              </div>
            </div>
          </div>
        </div>
        {/* </section> */}

        {/*chat game plan section  */}
        <div
          ref={containerRef}
          className="mx-auto px-8 py-6 xl:h-screen bg-white rounded-br-[600px]"
        >
          <div className="container mx-auto">
            <div className="text-3xl font-semibold py-8 text-center md:text-center">
              <h2>Your Chat Game Plan in 4 Simple Steps</h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="max-w-5xl w-full flex flex-col md:flex-row items-center">
                {/* Left Section */}
                <div className="md:w-1/2 space-y-6">
                  <div className="space-y-4">
                    {visibleSteps.map((step, index) => {
                      if (!step) return null;
                      return (
                        <div
                          key={step.number}
                          className={`flex items-center space-x-4 transition-all duration-500 ease-out ${
                            index === visibleSteps.length - 1
                              ? "animate-slideIn"
                              : ""
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-lg font-bold">
                            {step.number}
                          </div>
                          <div
                            className={`rounded px-4 py-2 w-48 max-w-xs ${
                              index === currentStepIndex
                                ? "text-blue-600 font-semibold border border-blue-600 bg-blue-50"
                                : "border border-gray-300 bg-white"
                            }`}
                          >
                            {step.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Section */}
                <div className="md:w-1/2 mt-8 md:mt-0 md:ml-8">
                  {stepsData[currentStepIndex] && (
                    <img
                      src={stepsData[currentStepIndex].image}
                      alt={`Step ${stepsData[currentStepIndex].number}`}
                      className="w-full rounded shadow-md transition duration-500"
                    />
                  )}
                </div>
              </div>

              {/* Tailwind Animation */}
              <style jsx>{`
                @keyframes slideIn {
                  0% {
                    transform: translateX(-50px);
                    opacity: 0;
                  }
                  100% {
                    transform: translateX(0);
                    opacity: 1;
                  }
                }
                .animate-slideIn {
                  animation: slideIn 0.5s forwards;
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>
      {/* section 4 */}
      <section className="px-8 py-6 bg-white font-albert">
        {/* Heading */}
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h4 className="font-bold text-2xl sm:text-3xl">
              Real Voices, Real Impact
            </h4>
            <p className="mt-2 text-gray-600 text-sm sm:text-base">
              Empower your virtual assistants with a real-time chat dashboard
              that connects directly to your website.
            </p>
          </div>

          {/* Image Cards */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Card 1 */}
            <div className="flex-1 max-w-sm  flex-shrink-0 rounded border p-4 shadow-sm">
              <img
                src="white-woman.png"
                alt="White woman"
                className="w-full h-auto rounded"
              />
            </div>

            {/* Card 2 */}
            <div className="flex-1 max-w-sm flex-shrink-0 rounded border p-4 shadow-sm">
              <img
                src="white-man.png"
                alt="White man"
                className="w-full h-auto rounded"
              />
            </div>

            {/* Card 3 */}
            <div className="flex-1 max-w-sm  flex-shrink-0 rounded border p-4 shadow-sm">
              <img
                src="black-woman.png"
                alt="Black woman"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </section>
      {/* section 5 */}
      <FAQSection />
      {/* section 6 */}
      <section className="px-8 py-6 font-albert">
        <div className="container mx-auto">
          <div>
            <h4 className="text-xl font-semibold text-center py-6">
              Reach our Help <span className="text-[#0179B4]">Desk</span> for
              support in
              <br /> Getting Started
            </h4>
          </div>

          <div className="border border-gray-300 rounded-md p-4 mx-auto w-full md:w-1/2">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md mx-auto space-y-4"
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#192F5D] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Submit Form
              </button>
            </form>
          </div>

          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold mb-4">
              Manage your contacts in one place, streamline team
              <br /> collaboration, and never miss a follow-up again.
            </h2>
            <button className="w-48 bg-[#192F5D] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition m-4">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
      {/* footer */}
      <Footer />
    </>
  );
}
