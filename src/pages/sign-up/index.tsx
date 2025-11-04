import {
  Flex,
  Box,
  Text,
  Input,
  Heading,
  UnorderedList,
  ListItem,
  Button,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AvaLogo from "../../../public/AvaLogo.jpg";
import { useRegisterUserHook } from "@/libs/Hooks/usersHooks";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import LoadingSpinner from "@/libs/Components/loadingSpinner";

export default function SignUp() {
  const [firstName, setFirstName] = useState<String | null>(null);
  const [lastName, setLastName] = useState<String | null>(null);
  const [email, setEmail] = useState<String | null>(null);
  const [password, setPassword] = useState<String | null>(null);
  const registerUserMutation = useRegisterUserHook();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function registerUser() {
    try {
      setIsLoading(true);
      const data = await registerUserMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
        service: "ava",
        role: "admin",
      });

      Cookies.set("token", data.token.accessToken, {
        expires: 30,
        secure: true,
      });

      Cookies.set("refreshToken", data.token.refreshToken, {
        expires: 30,
        secure: true,
      });

      router.push("/sign-up/products");
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // <Flex justifyContent={"center"} height={"100vh"} width={"100%"}>
    //   <LoadingSpinner showLoadingSpinner={isLoading} />
    //   <Flex flexDir={"column"}>
    //     <Image width={100} src={AvaLogo} alt="logo"></Image>
    //     <Heading>Create a completely free account</Heading>
    //     <Flex
    //       mt={"2rem"}
    //       width={{ lg: "70%", md: "70%", sm: "100%", base: "100%" }}
    //       mx={"auto"}
    //       flexDir={"column"}
    //     >
    //       <Input
    //         p={"2rem"}
    //         mt={"1rem"}
    //         placeholder="Enter Your First Name"
    //         onChange={(e) => setFirstName(e.target.value)}
    //       ></Input>
    //       <Input
    //         p={"2rem"}
    //         mt={"1rem"}
    //         placeholder="Enter Your Last Name"
    //         onChange={(e) => setLastName(e.target.value)}
    //       ></Input>
    //       <Input
    //         p={"2rem"}
    //         mt={"1rem"}
    //         placeholder="Enter Your Email"
    //         onChange={(e) => setEmail(e.target.value)}
    //       ></Input>
    //       <Input
    //         p={"2rem"}
    //         mt={"1rem"}
    //         placeholder="Enter Your Password"
    //         onChange={(e) => setPassword(e.target.value)}
    //       ></Input>
    //       <UnorderedList mt={"2rem"}>
    //         <ListItem>6 characters minimum</ListItem>
    //         <ListItem>At least one number</ListItem>
    //         <ListItem>Upper & lowercase character</ListItem>
    //       </UnorderedList>

    //       <Button
    //         w={"100%"}
    //         mt="2rem"
    //         mx={"auto"}
    //         bg={"#101828"}
    //         color={"White"}
    //         onClick={() => registerUser()}
    //       >
    //         Sign Up For Free
    //       </Button>

    //       <Text>
    //         {" "}
    //         already have an account ?{" "}
    //         <Link href="#" textDecor={"underline"}>
    //           Return to Sign in
    //         </Link>
    //       </Text>
    //     </Flex>
    //   </Flex>
    // </Flex>
    <section className="container min-h-[100svh] flex flex-col justify-center px-8 py-6 font-albert">
      <LoadingSpinner showLoadingSpinner={isLoading} />
      <div className="flex flex-col items-center">
        <img
          src="/Deskmayte-signup.png"
          alt="Deskmayte logo"
          className="mx-auto md:mx-0 py-2 w-48 h-18"
        />

        <h3 className="font-semibold text-xl">Create a Free Account</h3>
      </div>

      <div>
        <div className="mx-auto w-full md:w-1/2">
          {/* First Name Field */}
          <div className="py-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={registerUser}
            type="submit"
            className="w-full bg-[#192F5D] text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up for Free
          </button>
        </div>
        <div className="text-center mt-4">
          <h4>
            Already have an account?{" "}
            <a href="/sign-in" className="text-[#1AB345]">
              Sign In
            </a>
          </h4>
        </div>
      </div>
    </section>
  );
}
