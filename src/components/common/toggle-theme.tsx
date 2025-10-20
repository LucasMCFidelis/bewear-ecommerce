"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useToggleDarkModePreference } from "@/hooks/mutations/use-toggle-dark-mode-preference";
import { useThemeContext } from "@/hooks/states/use-theme-context";
import { authClient } from "@/lib/auth-client";

const FormSchema = z.object({
  darkMode: z.boolean(),
});

export function ToggleTheme() {
  const { data: session } = authClient.useSession();
  const toggleDarkModePreferenceMutation = useToggleDarkModePreference();
  const { isDarkMode, setIsDarkMode } = useThemeContext();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      darkMode: isDarkMode,
    },
  });

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
                  disabled={toggleDarkModePreferenceMutation.isPending}
                  onCheckedChange={async (checked) => {
                    field.onChange(checked);
                    setIsDarkMode(checked);

                    try {
                      if (session?.user) {
                        toggleDarkModePreferenceMutation.mutate();
                      }
                    } catch (error) {
                      console.error("Erro ao salvar preferência:", error);
                      setIsDarkMode(!checked);
                      form.setValue("darkMode", !checked);
                    }
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
