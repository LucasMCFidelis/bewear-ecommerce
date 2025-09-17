"use client";

import {
  Home,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBagIcon,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CategoryDTO } from "@/app/data/categories/category-dto";
import { useGlobalStates } from "@/hooks/states/use-global-states";
import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Cart from "./cart";
import MenuLink from "./menu-link";
import { ToggleTheme } from "./toggle-theme";

interface HeaderProps {
  categories?: Array<CategoryDTO>;
}

const Header = ({ categories }: HeaderProps) => {
  const { data: session } = authClient.useSession();
  const [{ isSheetMenuOpen }, setGlobalState] = useGlobalStates();

  return (
    <header className="flex items-center p-5 justify-between">
      <Link href={"/"}>
        <Image src={"/logo.svg"} alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-2">
        {session?.user && <Cart />}

        <Sheet
          open={isSheetMenuOpen}
          onOpenChange={(value) => setGlobalState({ isSheetMenuOpen: value })}
        >
          <SheetTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="h-full px-5 flex flex-col gap-8">
              <ToggleTheme />
              <Separator />
              {session?.user ? (
                <>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <MenuLink href="/">
                      <Home /> Inicio
                    </MenuLink>
                    <MenuLink href="/orders">
                      <Truck /> Meus pedidos
                    </MenuLink>
                    <MenuLink
                      onClick={() => {
                        setGlobalState({
                          isSheetMenuOpen: false,
                          isCartOpen: true,
                        });
                      }}
                    >
                      <ShoppingBagIcon /> Sacola
                    </MenuLink>
                  </div>

                  <Separator />
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/authenticator">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}

              <div>
                {categories &&
                  categories.map((category) => (
                    <MenuLink
                      key={category.id}
                      href={`/category/${category.slug}`}
                    >
                      {category.name}
                    </MenuLink>
                  ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
