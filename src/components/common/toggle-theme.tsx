"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useGlobalStates } from "@/hooks/states/use-global-states";

const FormSchema = z.object({
  darkMode: z.boolean(),
});

interface ToggleThemeProps {
  initialState?: boolean;
}

export function ToggleTheme({ initialState = false }: ToggleThemeProps) {
  const [{ isDarkModeEnabled }, setGlobalState] = useGlobalStates();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      darkMode: isDarkModeEnabled ? isDarkModeEnabled : initialState,
    },
  });

  useEffect(() => {
    if (isDarkModeEnabled) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkModeEnabled]);

  return (
    <Form {...form}>
      <form className="w-full space-y-6">
        <FormField
          control={form.control}
          name="darkMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg">
              <FormLabel>Modo Escuro</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setGlobalState({ isDarkModeEnabled: checked });
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
