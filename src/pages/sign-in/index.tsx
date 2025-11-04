import React, { useState } from "react";
import { useLoginUser } from "@/libs/Hooks/usersHooks";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LoadingSpinner from "@/libs/Components/loadingSpinner";
import { toast } from "react-toastify";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const mutation = useLoginUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setisLoading(true);
      e.preventDefault();

      const data = await mutation.mutateAsync({ email, password });
      Cookies.set("token", data.token.accessToken, {
        expires: 30,
        secure: true,
      });

      Cookies.set("refreshToken", data.token.refreshToken, {
        expires: 30,
        secure: true,
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <section className="h-screen flex items-center justify-center px-4  overflow-y-hidden font-albert">
      <LoadingSpinner showLoadingSpinner={isLoading} />

      <div className="flex flex-col md:flex-row items-center  w-full max-w-6xl gap-8 ">
        {/* Left Image Section (hidden on small screens) */}
        <div className="hidden md:block h-screen w-full ">
          <img
            src="./desk-man.png"
            alt="Person at desk illustration"
            className=""
          />
        </div>

        {/* Form Section */}
        <div className="w-full  px-4 ">
          <div className="mb-8 text-center md:text-left">
            <img
              src="./Deskmayte-signup.png"
              alt="Deskmayte logo"
              className="mx-auto md:mx-0 w-40 md:w-48 py-2"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              Login to Your Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#192F5D] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Log In Now
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
