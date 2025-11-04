import React, { useState } from "react";
import { FaTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { VscGithub } from "react-icons/vsc";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="px-8 py-10 bg-[#12141D] text-white font-albert">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between ">
          <div>
            <img src="/deskmayte-white.png" alt="" />
            <p className="text-sm opacity-40 mt-2">
              Amet minim mollit non
              <br /> deserunt ullamco est sit
              <br /> aliqua dolor do amet sint.
              <br /> Velit officia consequat duis
              <br /> enim velit mollit.
            </p>

            <div className="flex  gap-5 mt-6 ">
              <div>
                <FaTwitter className="text-xl text-white" />
              </div>
              <div>
                <FaFacebookF className="text-xl text-white" />
              </div>
              <div>
                <FaInstagram className="text-xl text-white" />
              </div>
              <div>
                <VscGithub className="text-xl text-white" />
              </div>
            </div>
          </div>

          <div>
            <h6 className="py-4 text-sm tracking-widest opacity-30">COMPANY</h6>
            <ul className="text-xs opacity-75 leading-loose">
              <li>Live Chat</li>
              <li>Hire Chat Agents</li>
              <li>Knowledge Base</li>
              <li>Virtual Assistants</li>
              <li>Contacts (CRM)</li>
              <li>Remove Branding</li>
            </ul>
          </div>
          <div>
            <h6 className="py-4 text-sm tracking-widest opacity-30">
              RESOURCES
            </h6>
            <ul className="text-xs opacity-75 leading-loose">
              <li>Help Center</li>
              <li>Blog</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Customer Stories</li>
            </ul>
          </div>
          <div>
            <h6 className="py-4 text-sm tracking-widest opacity-30">
              SUBSCRIBE TO NEWSLETTER
            </h6>

            <div className="flex">
              <label htmlFor="email" className="p-2">
                Email:
              </label>

              {/* Flex container to align input and button side by side */}
              <div className="relative w-80">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 pr-24 border text-black border-gray-400 rounded-sm"
                />

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("subcribe button clicked");
                  }}
                  className="absolute right-0 top-0 h-full bg-[#12141D] text-white px-4 py-2 border border-gray-400 rounded-sm ">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="border-t border-gray-800 py-2 mt-12"></div>

        <div className="text-center mt-4 mb-0">
          <h6 className="  text-center text-sm text-gray-400">
            © Copyright 2025, All Rights Reserved by Deskmayte
          </h6>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
