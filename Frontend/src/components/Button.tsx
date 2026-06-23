export const Button: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}> = ({ children, variant = "primary", onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95 ${
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
      } ${className}`}
    >
      {children}
    </button>
  );
};
