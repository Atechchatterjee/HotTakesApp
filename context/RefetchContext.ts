import { createContext } from "react";

export const RefetchContext = createContext<{
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  refetch: false,
  setRefetch: () => {},
});
