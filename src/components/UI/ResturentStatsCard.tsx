import { JSX } from "react";

interface StatsCardProps {
  data: {
    title: string;
    icon: JSX.Element;
    count: number;
  };
}

const ResturentStatsCard = ({ data }: StatsCardProps) => {
  return (
    <div className=" p-6 rounded-2xl flex bg-gray-100 items-center gap-4 dark:bg-gray-600 dark:text-gray-200 mx-2">
      <span className="p-3 text-2xl rounded-2xl bg-gray-100 dark:bg-gray-500">
        {data.icon} 
      </span>
      <div>
        <h2 className="text-xl font-bold dark:text-white">
          {data.count} 
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{data.title}</p>
      </div>
    </div>
  );
};

export default ResturentStatsCard;