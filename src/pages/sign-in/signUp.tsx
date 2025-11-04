import React, { useState } from "react";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(" ");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      firstName,
      lastName,
      email,
      password,
    });
  };

  return (
    <section className="container min-h-[100svh] flex flex-col justify-center px-8 py-6 font-albert">
      <div className="flex flex-col items-center">
        <img
          src="/Deskmayte-signup.png"
          alt="Deskmayte logo"
          className="mx-auto md:mx-0 py-2 w-48 h-18"
        />

        <h3 className="font-semibold text-xl">Create a Free Account</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto w-full md:w-1/2">
          {/* First Name Field */}
          <div className="py-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Enter your First Name"
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
          </div>

          {/* Last Name Field */}
          <div className="py-4">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Enter your Last Name"
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div className="py-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* password  */}

          <div className="py-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#192F5D] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition">
            Sign Up for Free
          </button>
        </div>
        <div className="text-center mt-4">
          <h4>
            Already have an account?{" "}
            <a href="" className="text-[#1AB345]">
              {" "}
              Sign In
            </a>
          </h4>
        </div>
      </form>
    </section>
  );
}
