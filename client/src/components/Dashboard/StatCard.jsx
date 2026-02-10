import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({ title, value, icon: Icon, color, trend, trendText }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-lg shadow-sm`}>
          <Icon className="text-white" size={20} />
        </div>
        {trend && trendText && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trend === "up" ? (
              <FaArrowUp size={10} />
            ) : (
              <FaArrowDown size={10} />
            )}
            <span>{trendText}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
