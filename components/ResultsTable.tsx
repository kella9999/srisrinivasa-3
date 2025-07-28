
import React from 'react';
import { PredictionData } from '../types';

interface ResultsTableProps {
    data: PredictionData[];
    isLoading: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data, isLoading }) => {
    
    const formatTrend = (trend: 'UP' | 'DOWN') => {
        return trend === 'UP' 
            ? <span className="text-emerald-500">UP 🔼</span> 
            : <span className="text-red-500">DOWN 🔽</span>;
    };

    const formatMatch = (match: boolean) => {
        return match
            ? <span className="text-emerald-500">✅ Correct</span>
            : <span className="text-red-500">❌ Incorrect</span>;
    };
    
    const renderSkeleton = () => (
        [...Array(5)].map((_, i) => (
            <tr key={i} className="bg-gray-800 border-b border-gray-700 animate-pulse">
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-12"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-24"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-24"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-700 rounded w-28"></div></td>
            </tr>
        ))
    );

    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-700">
                <h2 className="text-xl md:text-2xl font-bold text-white">Record of Sequential Analysis</h2>
                <p className="text-sm text-gray-400 mt-1">The model's prediction for each interval compared to the actual result.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Actual Close</th>
                            <th scope="col" className="px-6 py-3">Predicted Close</th>
                            <th scope="col" className="px-6 py-3">Error</th>
                            <th scope="col" className="px-6 py-3">Actual Trend</th>
                            <th scope="col" className="px-6 py-3">Predicted Trend</th>
                            <th scope="col" className="px-6 py-3">Trend Match</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? renderSkeleton() : (
                            data.slice(0).reverse().map((d) => ( // Show most recent first
                                <tr key={d.timestamp} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                                    <td className="px-6 py-4 font-medium text-white">${d.Actual_Close.toFixed(2)}</td>
                                    <td className="px-6 py-4">${d.Predicted_Close.toFixed(2)}</td>
                                    <td className={`px-6 py-4 ${d['Prediction_Error (Close)'] >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {d['Prediction_Error (Close)'].toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">{formatTrend(d.Actual_Trend)}</td>
                                    <td className="px-6 py-4">{formatTrend(d.Predicted_Trend)}</td>
                                    <td className="px-6 py-4">{formatMatch(d.Trend_Match)}</td>
                                </tr>
                            ))
                        )}
                         {!isLoading && data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No data to display.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
