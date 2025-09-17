import { useMutation } from "@tanstack/react-query";

import { toggleDarkModePreference } from "@/actions/toggle-dark-mode-preference";

export const getToggleDarkModePreference = () =>
  ["toggle-dark-mode-preference"] as const;

export const useToggleDarkModePreference = () => {
  return useMutation({
    mutationKey: getToggleDarkModePreference(),
    mutationFn: () => toggleDarkModePreference(),
  });
};
