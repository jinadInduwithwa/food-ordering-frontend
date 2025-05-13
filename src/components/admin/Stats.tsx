import ResturentStatsCard from "../UI/ResturentStatsCard";
import ResturentTitle from "../UI/ResturentTitle";
import {
    FiPieChart,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiDollarSign,
    FiUsers,
    FiShoppingCart,
    FiStar,
    FiTruck,
    FiPercent,
    FiBox,
    FiUserCheck,
  } from "react-icons/fi";
  
  interface Status {
    title: string;
    icon: JSX.Element;
    count: number;
  }
  
  const menuItemsData: Status[] = [
    {
      title: "New Orders",
      icon: <FiPieChart />,
      count: 15,
    },
    {
      title: "Pending Orders",
      icon: <FiClock />,
      count: 8,
    },
    {
      title: "Completed Orders",
      icon: <FiCheckCircle />,
      count: 45,
    },
    {
      title: "Canceled Orders",
      icon: <FiXCircle />,
      count: 5,
    },
    {
      title: "Total Revenue",
      icon: <FiDollarSign />,
      count: 2450,
    },
    {
      title: "Active Customers",
      icon: <FiUsers />,
      count: 120,
    },
    {
      title: "Items Sold",
      icon: <FiShoppingCart />,
      count: 180,
    },
    {
      title: "Customer Ratings",
      icon: <FiStar />,
      count: 4,
    },
    {
      title: "Delivery Orders",
      icon: <FiTruck />,
      count: 35,
    },
    {
      title: "Discounts Applied",
      icon: <FiPercent />,
      count: 12,
    },
    {
      title: "Menu Items",
      icon: <FiBox />,
      count: 50,
    },
    {
      title: "Staff Online",
      icon: <FiUserCheck />,
      count: 6,
    },
  ];
  
  const Stats = () => {
    return (
      <div className="p-4">
        <ResturentTitle text="Restaurant Stats"/>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItemsData.map((data, index) => (
            <ResturentStatsCard key={index} data={data} />
          ))}
        </div>

      </div>
    );
  };
  
  export default Stats;