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
import { useToggleDarkModePreference } from "@/hooks/mutations/use-toggle-dark-mode-preference";
import { useGlobalStates } from "@/hooks/states/use-global-states";
import { authClient } from "@/lib/auth-client";

const FormSchema = z.object({
  darkMode: z.boolean(),
});

export function ToggleTheme() {
  const { data: session } = authClient.useSession();
  const toggleDarkModePreferenceMutation = useToggleDarkModePreference();
  const [{ isDarkModeEnabled }, setGlobalState] = useGlobalStates();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      darkMode: isDarkModeEnabled,
    },
  });

  useEffect(() => {
    form.reset({ darkMode: isDarkModeEnabled });
  }, [isDarkModeEnabled, form]);

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
                    setGlobalState({ isDarkModeEnabled: checked });

                    try {
                      if (session?.user) {
                        toggleDarkModePreferenceMutation.mutate();
                      }
                    } catch (error) {
                      console.error("Erro ao salvar preferência:", error);
                      setGlobalState({ isDarkModeEnabled: !checked });
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
