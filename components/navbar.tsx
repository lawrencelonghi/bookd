'use client'
import React from "react";
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
  ModalFooter
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Search } from 'lucide-react';



export const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [ isCreateAccountOpen, setIsCreateAccountOpen ] = React.useState(false)
    const [ isSignInOpen, setSignInOpen ] = React.useState(false)

    const menuItems = [
    "Sign in",
    "Create account",
    "Books",
  ];
  
  

  return (
    <HeroUINavbar position="static" className="bg-neutral-900" onMenuOpenChange={setIsMenuOpen}>
       <NavbarBrand className="flex items-center gap-0">
        <Image src="/images/logoBookd.png" height={100} width={90} alt="Bookd" 
              className="object-cover object-center"/>
        <p className="font-bold ml-0 text-3xl">Bookd</p>
      </NavbarBrand>

        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />

       <NavbarContent className="hidden md:flex gap-8" justify="center">

        <NavbarItem>
          <Link className="text-[13px] text-gray-400 tracking-wider font-bold" 
                color="foreground" 
                href="#"
                onClick={() => setSignInOpen(true)}>
            SIGN IN
          </Link>
        </NavbarItem>

    <Modal 
      isOpen={isSignInOpen} 
      onOpenChange={setSignInOpen}  
      isDismissable={true} 
      isKeyboardDismissDisabled={false}
    >
      <ModalContent>
        {(onClose) => (  
          <>
            <ModalHeader className="flex flex-col gap-1">Sign in</ModalHeader>
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
                size="sm"
                type="email"
                radius="lg"
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
                size="sm"
                type="password"
                radius="lg"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary">
                Sign In
              </Button>
            </ModalFooter>
          </>
        )}
  </ModalContent>
</Modal>


        <NavbarItem>
          <Link className="text-[13px] text-gray-400 tracking-wider font-bold" 
                color="foreground" 
                href="#"
                onClick={() => setIsCreateAccountOpen(true)}>
            CREATE ACCOUNT
          </Link>
        </NavbarItem>

    <Modal 
      isOpen={isCreateAccountOpen} 
      onOpenChange={setIsCreateAccountOpen}  
      isDismissable={true} 
      isKeyboardDismissDisabled={false}
    >
      <ModalContent>
        {(onClose) => (  
          <>
            <ModalHeader className="flex flex-col gap-1">Create account</ModalHeader>
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
                size="sm"
                type="email"
                radius="lg"
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
                size="sm"
                type="password"
                radius="lg"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary">
                Create your account now!
              </Button>
            </ModalFooter>
          </>
        )}
  </ModalContent>
</Modal>


        <NavbarItem>
          <Link className="text-[13px] text-gray-400 tracking-wider font-bold" 
                color="foreground" 
                href="/books">
            BOOKS
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link className="text-[13px] text-gray-400 tracking-wider font-bold" 
                color="foreground" 
                href="/lists">
            LISTS
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" className="items-center hidden md:flex" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/10 dark:bg-default-500/10",
          }}
          
          size="sm"
          startContent={<Search size={18}/>}
          type="search"
          radius="lg"
        />
        </NavbarContent>

        <NavbarMenu className="flex flex-col items-center justify-center gap-10">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full text-2xl"
                color={
                  index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
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
