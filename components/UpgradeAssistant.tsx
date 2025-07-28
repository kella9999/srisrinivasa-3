import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

export const UpgradeAssistant: React.FC = () => {
    const [suggestions, setSuggestions] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUpgradeSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const prompt = `You are an expert data scientist and machine learning engineer specializing in time-series forecasting for financial markets.
A user has built an XGBoost model to predict 3-minute cryptocurrency price movements and is looking for specific, actionable advice to improve it.
The user has mentioned four areas of interest:
1. Feature Engineering
2. Hyperparameter Tuning
3. Exploring other time-series models
4. Incorporating external data

Based on these topics, provide a concise but detailed list of suggestions. For each suggestion, briefly explain why it's useful and give a concrete example. Structure your response in a clear, easy-to-read format. Use markdown for formatting, including headers for each of the four topics, and bullet points for suggestions. For example:

### Feature Engineering
*   **Create Lagged Features:** This helps the model see recent price action. For example, use the closing price from 1, 2, and 3 intervals ago as features.
*   **Add Technical Indicators:** Indicators can capture momentum and volatility. For example, calculate a 14-period Relative Strength Index (RSI) or Moving Average Convergence Divergence (MACD).

Continue this pattern for all four topics.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setSuggestions(response.text);

        } catch (e: any) {
            console.error(e);
            setError('Failed to get suggestions. There might be an issue with the API key or network.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl md:text-2xl font-bold text-white">Upgrade Assistant</h2>
                    <p className="text-sm text-gray-400 mt-1">Get AI-powered advice to improve your prediction model.</p>
                </div>
                 <button
                    onClick={getUpgradeSuggestions}
                    disabled={isLoading}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center self-end sm:self-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </>
                    ) : 'Get Suggestions'}
                </button>
            </div>
           
            {error && <div className="mt-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">{error}</div>}
            
            {suggestions && (
                 <div className="mt-4 border-t border-gray-700 pt-4 text-gray-300 leading-relaxed">
                    <ReactMarkdown
                        components={{
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-cyan-400 mt-4 mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mt-2" {...props} />,
                            li: ({node, ...props}) => <li {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                            code: ({node, ...props}) => <code className="bg-gray-700 text-emerald-400 rounded px-1 py-0.5 text-sm" {...props} />,
                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                        }}
                    >
                        {suggestions}
                    </ReactMarkdown>
                 </div>
            )}
        </div>
    );
};