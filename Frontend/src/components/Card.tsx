export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-3xl shadow-md hover:shadow-xl transition-all p-8 ${className}`}
    >
      {children}
    </div>
  );
};
