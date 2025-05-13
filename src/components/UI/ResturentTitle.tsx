interface TitleProps {
  text: string;
  className?: string;
}

const Title = ({ text, className = "" }: TitleProps) => {
  return (
    <h2
      className={`text-xl uppercase font-bold mb-4 dark:text-white mx-2 text-gray-800  tracking-tight  hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 border-l-4 border-gray-500 dark:border-gray-400 pl-4 ${className}`}
    >
      {text}
    </h2>
  );
};

export default Title;