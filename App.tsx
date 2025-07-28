
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { PredictionChart } from './components/PredictionChart';
import { ResultsTable } from './components/ResultsTable';
import { UpgradeAssistant } from './components/UpgradeAssistant';
import { fetchPredictionData } from './services/cryptoDataService';
import { TimeInterval, PredictionData } from './types';
import { TIME_INTERVALS } from './constants';

const App: React.FC = () => {
    const [timeInterval, setTimeInterval] = useState<TimeInterval>('3min');
    const [data, setData] = useState<PredictionData[]>([]);
    const [trendAccuracy, setTrendAccuracy] = useState<number>(0);
    const [avgPriceError, setAvgPriceError] = useState<number>(0);
    const [coinTicker, setCoinTicker] = useState<string>('BTC-USD');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (interval: TimeInterval) => {
        setIsLoading(true);
        setError(null);
        try {
            const { predictions, coin } = await fetchPredictionData(interval);
            setData(predictions);
            setCoinTicker(coin);

            if (predictions.length > 0) {
                const correctPredictions = predictions.filter(p => p.Trend_Match).length;
                const accuracy = (correctPredictions / predictions.length) * 100;
                setTrendAccuracy(accuracy);

                const totalError = predictions.reduce((sum, p) => sum + Math.abs(p['Prediction_Error (Close)']), 0);
                const avgError = totalError / predictions.length;
                setAvgPriceError(avgError);
            } else {
                setTrendAccuracy(0);
                setAvgPriceError(0);
            }
        } catch (e: any) {
            setError(e.message || "Failed to fetch prediction data.");
            setData([]); // Clear data on error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(timeInterval);
    }, [fetchData, timeInterval]);

    const handleIntervalChange = (interval: TimeInterval) => {
        if (!isLoading) {
            setTimeInterval(interval);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <Header coinTicker={coinTicker} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <MetricCard 
                        label="Trend Prediction Accuracy" 
                        value={isLoading ? '...' : `${trendAccuracy.toFixed(2)}%`}
                        helpText="Percentage of times the model correctly predicted 'UP' or 'DOWN'."
                    />
                    <MetricCard 
                        label="Average Price Prediction Error" 
                        value={isLoading ? '...' : `$${avgPriceError.toFixed(4)}`}
                        helpText="The average absolute difference between the predicted and actual closing price."
                    />
                </div>

                <div className="bg-gray-800 rounded-lg p-4 md:p-6 shadow-2xl relative">
                     {isLoading && (
                        <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center z-10 rounded-lg">
                            <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 sm:mb-0">Prediction vs. Actual Price</h2>
                        <div className="flex space-x-2 bg-gray-700 p-1 rounded-md">
                            {TIME_INTERVALS.map(interval => (
                                <button
                                    key={interval}
                                    onClick={() => handleIntervalChange(interval)}
                                    disabled={isLoading}
                                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        timeInterval === interval 
                                            ? 'bg-cyan-500 text-white shadow-md' 
                                            : 'text-gray-400 hover:bg-gray-600'
                                    }`}
                                >
                                    {interval}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-96 w-full">
                         <PredictionChart data={data} />
                    </div>
                     {error && <div className="mt-4 text-center text-red-400">{error}</div>}
                </div>

                <div className="mt-8">
                    <ResultsTable data={data} isLoading={isLoading}/>
                </div>

                <div className="mt-8">
                    <UpgradeAssistant />
                </div>

            </div>
        </div>
    );
};

export default App;
