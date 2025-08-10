"use client";

import { Eye, EyeClosed } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PasswordInput = ({ ...rest }: InputHTMLAttributes<HTMLInputElement>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="relative w-full">
      <Input
        placeholder="Senha..."
        type={showPassword ? "text" : "password"}
        {...rest}
      />
      <Button
        type="button"
        variant={"ghost"}
        onClick={toggleShowPassword}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeClosed /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordInput;
