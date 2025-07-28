import React from 'react';

interface MetricCardProps {
    label: string;
    value: string;
    helpText: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, helpText }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg relative group">
            <h3 className="text-gray-400 text-sm font-medium">{label}</h3>
            <p className="text-3xl font-bold text-white mt-2">{value}</p>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="relative" title={helpText}>
                     <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                </span>
            </div>
        </div>
    );
};
