import React from "react";

export default function StatsCard({ title, value, percentage, icon, iconBgColor }) {
    const isPositive = percentage >= 0;
    
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${iconBgColor} shadow-lg shadow-opacity-20`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                    {isPositive ? '+' : ''}{percentage}%
                </span>
                <span className="text-gray-400 ml-2">so với tháng trước</span>
            </div>
        </div>
    );
}