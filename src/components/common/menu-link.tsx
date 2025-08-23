"use client";

import { useRouter } from "next/navigation";
import { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

interface MenuLinkProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
}

const MenuLink = ({ href, children, onClick, ...rest }: MenuLinkProps) => {
  const router = useRouter();

  const handleClickDefault = () => {
    router.push(href || "/");
  };

  return (
    <Button
      variant="ghost"
      className={cn("w-full justify-start", rest.className)}
      onClick={onClick ? (e) => onClick(e) : handleClickDefault}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default MenuLink;
