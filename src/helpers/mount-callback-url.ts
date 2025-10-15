interface MountCallbackUrlProps {
  baseUrl?: string;
  states: Array<{
    name: string;
    value?: string | number | boolean;
  }>;
}

export const mountCallbackUrl = ({
  baseUrl = "/",
  states,
}: MountCallbackUrlProps) => {
  let resultCallbackUrl = baseUrl;
  states.map((state, index) => {
    const stateToString = `${index != 0 ? `&` : `?`}${state.name}=${state.value}`;
    resultCallbackUrl += stateToString;
  });

  return resultCallbackUrl;
};
