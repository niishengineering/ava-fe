import { useState } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import {
  IoChevronDown,
  IoMenuOutline,
  IoClose,
  IoChevronForward,
} from "react-icons/io5";

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

interface DropdownItem {
  label: string;
  href: string;
  icon?: string;
}

interface NavbarProps {
  logo?: string;
  logoAlt?: string;
  navItems?: NavItem[];
  loginHref?: string;
  signupHref?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

// const defaultNavItems: NavItem[] = [
//   {
//     label: "Products",
//     href: "#",
//     hasDropdown: true,
//     dropdownItems: [
//       { label: "Live Chat", href: "", icon: "💬" },
//       { label: "Knowledge Base", href: "#", icon: "📚" },
//       { label: "Contacts (CRM)", href: "#", icon: "👥" },
//     ],
//   },
//   {
//     label: "Services",
//     href: "#",
//     hasDropdown: true,
//     dropdownItems: [
//       { label: "Hire Chat Agents", href: "#" },
//       { label: "Virtual Assistants", href: "#" },
//     ],
//   },
//   {
//     label: "Resources",
//     href: "#",
//     hasDropdown: true,
//     dropdownItems: [
//       { label: "Help Center", href: "#" },
//       { label: "Blog", href: "#" },
//       { label: "Customer Stories", href: "#" },
//     ],
//   },
// ];

export default function NavBar({
  logo = "/Deskmayte Logo.png",
  logoAlt = "Deskmayte Logo",
  navItems,
  loginHref = "#",
  signupHref = "#",
  onLoginClick,
  onSignupClick,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(
    null
  );

  const handleLoginClick = (e: React.MouseEvent) => {
    if (onLoginClick) {
      e.preventDefault();
      onLoginClick();
    }
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    if (onSignupClick) {
      e.preventDefault();
      onSignupClick();
    }
  };

  const toggleMobileDropdown = (itemLabel: string) => {
    if (mobileExpandedItem === itemLabel) {
      setMobileExpandedItem(null);
    } else {
      setMobileExpandedItem(itemLabel);
    }
  };

  return (
    <nav>
      <div className="flex justify-between items-center py-4 bg-transparent">
        <div className="flex items-center md:gap-4 lg:gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src={logo} alt={logoAlt} className="h-8" />
          </div>

          {/* Desktop Navigation with Radix UI */}
          <div className="hidden md:block">
            <NavigationMenu.Root className="relative z-10">
              <NavigationMenu.List className="flex md:gap-6">
                {navItems?.map((item) => (
                  <NavigationMenu.Item key={item.label} className="relative">
                    {item.hasDropdown ? (
                      <>
                        <NavigationMenu.Trigger className="flex items-center space-x-1 text-gray-700 font-medium capitalize hover:text-[#192F5D] focus:outline-none group">
                          {item.label}
                          <IoChevronDown className="text-[20px] mt-1 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        </NavigationMenu.Trigger>

                        <NavigationMenu.Content className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-200 z-50">
                          <ul>
                            {item.dropdownItems?.map((dropdownItem) => (
                              <li key={dropdownItem.label}>
                                <NavigationMenu.Link asChild>
                                  <a
                                    href={dropdownItem.href}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#192F5D] transition-colors">
                                    {dropdownItem.icon && (
                                      <span className="mr-2">
                                        {dropdownItem.icon}
                                      </span>
                                    )}
                                    {dropdownItem.label}
                                  </a>
                                </NavigationMenu.Link>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenu.Content>
                      </>
                    ) : (
                      <NavigationMenu.Link asChild>
                        <a
                          href={item.href}
                          className="text-gray-700 font-medium capitalize hover:text-[#192F5D]">
                          {item.label}
                        </a>
                      </NavigationMenu.Link>
                    )}
                  </NavigationMenu.Item>
                ))}
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        </div>

        {/* Auth Links (Desktop) */}
        <div className="hidden md:flex md:gap-2 lg:gap-2 md:items-stretch">
          <a
            href={loginHref}
            onClick={handleLoginClick}
            className="text-gray-700 font-medium px-2 py-2 hover:text-blue-600">
            Log In
          </a>
          <a
            href={signupHref}
            onClick={handleSignupClick}
            className="bg-[#192F5D] text-white px-2 py-2 rounded hover:bg-blue-700">
            Sign Up Now
          </a>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl text-gray-700"
            aria-label="Open mobile menu">
            <IoMenuOutline />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay (Slide-In) - Keep original mobile implementation */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-2xl text-gray-700"
            aria-label="Close mobile menu">
            <IoClose />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <ul className="flex flex-col space-y-4 px-6">
          {navItems?.map((item) => (
            <li key={item.label}>
              <div className="flex items-center justify-between">
                <a
                  href={item.href}
                  className="text-gray-700 capitalize hover:text-[#192F5D]"
                  onClick={() => !item.hasDropdown && setIsOpen(false)}>
                  {item.label}
                </a>
                {item.hasDropdown && (
                  <button
                    onClick={() => toggleMobileDropdown(item.label)}
                    className="p-1">
                    {mobileExpandedItem === item.label ? (
                      <IoChevronDown className="text-[18px] transform rotate-180 transition-transform" />
                    ) : (
                      <IoChevronForward className="text-[18px]" />
                    )}
                  </button>
                )}
              </div>

              {/* Mobile Dropdown Items */}
              {item.hasDropdown && mobileExpandedItem === item.label && (
                <div className="ml-4 mt-2 space-y-3 border-l border-gray-200 pl-4">
                  {item.dropdownItems?.map((dropdownItem) => (
                    <a
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      className="flex items-center text-gray-600 text-sm hover:text-[#192F5D]"
                      onClick={() => setIsOpen(false)}>
                      {dropdownItem.icon && (
                        <span className="mr-2">{dropdownItem.icon}</span>
                      )}
                      {dropdownItem.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Auth Buttons */}
        <div className="flex flex-col space-y-3 px-6 mt-6">
          <a
            href={loginHref}
            onClick={(e) => {
              handleLoginClick(e);
              setIsOpen(false);
            }}
            className="text-gray-700 py-2 hover:text-blue-600">
            Log In
          </a>
          <a
            href={signupHref}
            onClick={(e) => {
              handleSignupClick(e);
              setIsOpen(false);
            }}
            className="bg-[#192F5D] text-white px-4 py-2 rounded hover:bg-blue-700">
            Sign Up Now
          </a>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}
