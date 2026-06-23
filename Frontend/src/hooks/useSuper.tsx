import { useContext } from "react";
import { SuperContext } from "../context/SuperContext";

export const useSuper = () => {
  const context = useContext(SuperContext );
  if (!context) {
    throw new Error("useCitizen must be used within SuperProvider");
  }
  return context;
};
