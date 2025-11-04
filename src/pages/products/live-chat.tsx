import { useEffect, useRef, useState } from "react";
import { CiCircleChevRight } from "react-icons/ci";
import { IoChevronDownCircle } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { VscGithub } from "react-icons/vsc";
import { FaTwitter } from "react-icons/fa6";
import { IoChevronDown, IoMenuOutline, IoClose } from "react-icons/io5";
import NavBar from "@/libs/Components/website/NavBar";
import FAQSection from "@/libs/Components/website/FAQAccordion";
import Footer from "@/libs/Components/website/Footer";
import Image from "next/image";

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
  const animationStartedRef = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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

  const handleLogin = () => {
    console.log("Login clicked");
  };

  const handleSignup = () => {
    console.log("Signup clicked");
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
        threshold: 0.3,
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
  };

  return (
    <>
      {/* Hero Section */}
      <section className=" md:h-screen font-albert overflow-hidden">
        {/* Background Image */}

        {/* Navigation */}
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NavBar
              navItems={navItems}
              onLoginClick={handleLogin}
              onSignupClick={handleSignup}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[url('/live-hero.svg')] bg-cover h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="">
              <div className="flex flex-col gap-6">
                <h1 className="text-white text-[65px] font-bold leading-tight">
                  Embed live chat
                  <br />
                  on your site
                  <br />
                  without any fees.
                </h1>

                <div className="flex items-center justify-center md:flex-row md:justify-start gap-4">
                  <button className="bg-[#192F5D] w-40 md:w-48 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* section 2 */}
      <section className="bg-[url('/live-chat-bg1.png')] bg-cover bg-repeat-round md:h-screen px-8 py-6  bg-[#F9FAFC] font-albert">
        <div className="container mx-auto">
          <div className="text-center p-4">
            <h3 className="text-2xl font-bold">Our Unique Features</h3>
          </div>

          <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-6">
            <div>
              <Image
                src="/live-chat-features.svg"
                alt="Description of my image"
                width={400}
                height={400}
              />
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-4xl font-bold text-[#101828]">
                Track your{" "}
                <span className="bg-gradient-to-r from-[#101828] to-[#1A63FF] bg-clip-text text-transparent">
                  website visitors in{" "}
                </span>{" "}
                real time.
              </h4>
              <p className="text-[#000000] text-2xl">
                Discover which pages they’re browsing, how frequently they
                return, and follow their complete customer journey from start to
                finish.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* section 3 */}
      <section className="bg-[url('/live-chat-bg2.png')] bg-cover bg-repeat-round md:h-screen px-8 py-6  bg-[#F9FAFC] font-albert">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 place-items-center md:grid-cols-2 gap-6">
            <div className="order-2 md:order-1">
              <Image
                src="/live-chat-features2.svg"
                alt="Description of my image"
                width={400}
                height={400}
              />
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-4xl font-bold bg-gradient-to-r from-[#101828] to-[#1A63FF] bg-clip-text text-transparent">
                Handle Conversations <br /> directly from your phone
              </h4>
              <p className="text-[#000000] text-2xl">
                Stay on top of every message with Android and iOS apps that send
                instant notifications and let you chat wherever you are.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* section 4 */}
      <section className="bg-[url('/live-chat-bg3.png')] bg-cover bg-repeat-round md:h-screen px-8 py-6  bg-[#F9FAFC] font-albert">
        <div className="container mx-auto">
          <div className="text-center p-4">
            <h2 className="text-[32px] mx-auto font-semibold md:w-[698px] ">
              Empower Your Business with Faster, Smarter, and More Personalized
              Service Through Our Chat Agents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#192F5D] w-[277px] h-[324px]">
              <h5 className="text-[#FFFFFF]">CRM Integrations</h5>
            </div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
      </section>
      {/* footer */}
      <Footer />
    </>
  );
}
