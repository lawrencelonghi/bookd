'use client'
import Image from "next/image";
import { Button } from "@heroui/button";
import { title } from "@/components/primitives";
import { Input } from "@heroui/input";
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/modal";
import { useAuth } from "@/app/contexts/AuthContext";


interface User {
  id: string;
  email: string;
}


export default function Home() {

    const [isCreateAccountOpen, setIsCreateAccountOpen] = React.useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
    const { user, setUser } = useAuth();

    const [signInEmail, setSignInEmail] = React.useState("");
    const [signInPassword, setSignInPassword] = React.useState("");
    const [signInLoading, setSignInLoading] = React.useState(false);
    const [signInError, setSignInError] = React.useState("");
  
    const [signUpEmail, setSignUpEmail] = React.useState("");
    const [signUpPassword, setSignUpPassword] = React.useState("");
    const [signUpLoading, setSignUpLoading] = React.useState(false);
    const [signUpError, setSignUpError] = React.useState("");

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



  return (
    <section className="flex flex-col flex-wrap text-center items-center justify-center py-8 md:py-10">
      <h1 className="text-md md:text-3xl">Track books you&apos;ve readed.</h1>
      <div className="flex flex-wrap justify-center gap-8 object-cover object-center mt-10 mb-9">
        <Image
          alt="Farenheit 451 book cover"
          className="hidden md:block"
          height={150}
          src="/images/farenheitCover.jpg"
          width={200}
        />
        <Image
          alt="Maya Angelou book cover"
          className="hidden md:block"
          height={200}
          src="/images/MayaCover.jpg"
          width={200}
        />
        <Image
          alt="Psycho book cover"
          height={200}
          src="/images/PsychoCover.jpg"
          width={200}
        />
        <Image
          alt=" A Clockwork Orange book cover"
          height={200}
          src="/images/kubrikCover.jpg"
          width={200}
        />
      </div>
      <div className="inline-block max-w-lg text-center justify-center">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-md md:text-3xl">
            Save those you want to read.
          </h1>
          <h1 className="text-md md:text-3xl">
            Tell your friends what&apos;s good.
          </h1>
        </div>

        <Button className="text-white font-bold text-base" 
                color="success"
                onClick={() => setIsCreateAccountOpen(true)}
                >
          Get started - it&apos;s free!
        </Button>

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
      </div>
    </section>
  );
}
