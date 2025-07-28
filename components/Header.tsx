import React from 'react';

interface HeaderProps {
    coinTicker: string;
}

export const Header: React.FC<HeaderProps> = ({ coinTicker }) => {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-700">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Crypto Price Predictor
                </h1>
                <p className="text-gray-400 mt-1">AI-Powered Forecasting Dashboard</p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
                <p className="text-lg font-semibold text-cyan-400">{coinTicker}</p>
                <p className="text-sm text-gray-500">XGBoost Model</p>
            </div>
        </header>
    );
};
