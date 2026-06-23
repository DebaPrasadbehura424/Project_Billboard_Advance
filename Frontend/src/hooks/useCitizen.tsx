import { useContext } from "react";
import { CitizenContext } from "../context/CitizenContext";

export const useCitizen = () => {
  const context = useContext(CitizenContext);
  if (!context) {
    throw new Error("useCitizen must be used within CitizenProvider");
  }
  return context;
};
