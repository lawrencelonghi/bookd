"use client";
import React, { useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarMenu,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import Image from "next/image";
import { Search, LogOut } from "lucide-react";

interface User {
  id: string;
  email: string;
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = React.useState(false);
  const [isSignInOpen, setSignInOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  const [signInEmail, setSignInEmail] = React.useState("");
  const [signInPassword, setSignInPassword] = React.useState("");
  const [signInLoading, setSignInLoading] = React.useState(false);
  const [signInError, setSignInError] = React.useState("");

  const [signUpEmail, setSignUpEmail] = React.useState("");
  const [signUpPassword, setSignUpPassword] = React.useState("");
  const [signUpLoading, setSignUpLoading] = React.useState(false);
  const [signUpError, setSignUpError] = React.useState("");

  const menuItems = ["Sign in", "Create account", "Books"];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();

        setUser(data.user);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleSignIn = async () => {
    setSignInError("");
    setSignInLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInEmail,
          password: signInPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignInError(data.error || "Something went wrong");

        return;
      }

      setUser(data.user);
      setSignInOpen(false);
      setSignInEmail("");
      setSignInPassword("");
    } catch (error) {
      setSignInError("Network error. Please try again.");
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async () => {
    setSignUpError("");
    setSignUpLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSignUpError(data.error || "Something went wrong");

        return;
      }

      setUser(data.user);
      setIsCreateAccountOpen(false);
      setSignUpEmail("");
      setSignUpPassword("");
    } catch (error) {
      setSignUpError("Network error. Please try again.");
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <HeroUINavbar
      className="bg-neutral-900"
      position="static"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarBrand className="flex items-center gap-0">
        <Link href="/">
          <Image
            alt="Bookd"
            className="object-cover object-center"
            height={100}
            src="/images/logoBookd.png"
            width={90}
          />
          <p className="font-bold ml-0 text-3xl">Bookd</p>
        </Link>
      </NavbarBrand>

      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="md:hidden"
      />

      <NavbarContent className="hidden md:flex gap-9" justify="center">
        {!user ? (
          <>
            <NavbarItem>
              <Link
                className="text-[13px] text-gray-400 tracking-wider font-bold"
                color="foreground"
                href="#"
                onClick={() => setSignInOpen(true)}
              >
                SIGN IN
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link
                className="text-[13px] text-gray-400 tracking-wider font-bold"
                color="foreground"
                href="#"
                onClick={() => setIsCreateAccountOpen(true)}
              >
                CREATE ACCOUNT
              </Link>
            </NavbarItem>
          </>
        ) : null}

        <Modal
          isDismissable={true}
          isKeyboardDismissDisabled={false}
          isOpen={isSignInOpen}
          onOpenChange={setSignInOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Sign in
                </ModalHeader>
                <ModalBody>
                  <Input
                    classNames={{
                      base: "max-w-full sm:max-w-[18rem] h-10",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
                    }}
                    label="Email"
                    labelPlacement="outside"
                    radius="lg"
                    size="sm"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                  />

                  <Input
                    classNames={{
                      base: "max-w-full sm:max-w-[18rem] h-10",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
                    }}
                    label="Password"
                    labelPlacement="outside"
                    radius="lg"
                    size="sm"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                  />

                  {signInError && (
                    <p className="text-red-500 text-sm">{signInError}</p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    isLoading={signInLoading}
                    onPress={handleSignIn}
                  >
                    Sign In
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isDismissable={true}
          isKeyboardDismissDisabled={false}
          isOpen={isCreateAccountOpen}
          onOpenChange={setIsCreateAccountOpen}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create account
                </ModalHeader>
                <ModalBody>
                  <Input
                    classNames={{
                      base: "max-w-full sm:max-w-[18rem] h-10",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
                    }}
                    label="Your Email"
                    labelPlacement="outside"
                    radius="lg"
                    size="sm"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                  />

                  <Input
                    classNames={{
                      base: "max-w-full sm:max-w-[18rem] h-10",
                      mainWrapper: "h-full",
                      input: "text-small",
                      inputWrapper:
                        "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
                    }}
                    label="Create a password"
                    labelPlacement="outside"
                    radius="lg"
                    size="sm"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                  />

                  {signUpError && (
                    <p className="text-red-500 text-sm">{signUpError}</p>
                  )}

                  <p className="text-xs text-gray-500">
                    Password must be at least 6 characters
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    isLoading={signUpLoading}
                    onPress={handleSignUp}
                  >
                    Create your account now!
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <NavbarItem>
          <Link
            className="text-[13px] text-gray-400 tracking-wider font-bold"
            color="foreground"
            href="/books"
          >
            BOOKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            className="text-[13px] text-gray-400 tracking-wider font-bold"
            color="foreground"
            href="/lists"
          >
            LISTS
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" className="ml-6 md:flex gap-6" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
          }}
          radius="full"
          size="sm"
          startContent={<Search size={18} />}
          type="search"
        />

        {user && (
          <>
            <span className="text-[13px] text-gray-400 tracking-wider font-bold">
              {user.email}
            </span>
            <Button
              color="danger"
              size="sm"
              startContent={<LogOut size={16} />}
              variant="light"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="flex flex-col items-center justify-center gap-10">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full text-2xl"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </HeroUINavbar>
  );
};
