
import { PredictionData, TimeInterval } from '../types';

// A simple deterministic pseudo-random number generator for consistency
const pseudoRandom = (seed: number) => {
    let s = seed;
    return () => {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

// This function simulates fetching data from a backend.
// In a real application, this function would make a `fetch` call
// to your backend server (e.g., `fetch('/api/crypto-data?interval=3min')`).
// The backend server would then securely call the Binance API.
export const fetchPredictionData = (interval: TimeInterval): Promise<{ predictions: PredictionData[], coin: string }> => {
    
    // Return a Promise to mimic a real network request
    return new Promise((resolve, reject) => {
        
        // Simulate network latency (e.g., 500ms to 1.5s)
        setTimeout(() => {
            try {
                // The logic to generate mock data is now inside the promise
                const predictions: PredictionData[] = [];
                const coin = 'BTC-USD';
                const numPoints = 100;
                const intervalMinutes = parseInt(interval.replace('min', ''));
                
                // Seed the random generator based on the interval for different-looking data
                const rand = pseudoRandom(intervalMinutes);

                let lastClose = 60000 + rand() * 5000;
                const startTime = new Date().getTime() - numPoints * intervalMinutes * 60 * 1000;

                for (let i = 0; i < numPoints; i++) {
                    const timestamp = new Date(startTime + i * intervalMinutes * 60 * 1000).toISOString();
                    
                    const open = lastClose * (1 + (rand() - 0.495) * 0.005);
                    const high = Math.max(open, lastClose) * (1 + rand() * 0.005);
                    const low = Math.min(open, lastClose) * (1 - rand() * 0.005);
                    const close = low + (high - low) * rand();

                    // The "prediction" logic remains the same for this simulation
                    const predictionNoise = (rand() - 0.5) * 300;
                    const predictedClose = close + predictionNoise;
                    
                    const predictionError = predictedClose - close;

                    const actualTrend = close >= open ? 'UP' : 'DOWN';
                    const predictedTrend = predictedClose >= open ? 'UP' : 'DOWN';
                    const trendMatch = actualTrend === predictedTrend;

                    predictions.push({
                        timestamp: timestamp,
                        Actual_Open: open,
                        Actual_High: high,
                        Actual_Low: low,
                        Actual_Close: close,
                        Predicted_Close: predictedClose,
                        'Prediction_Error (Close)': predictionError,
                        Actual_Trend: actualTrend,
                        Predicted_Trend: predictedTrend,
                        Trend_Match: trendMatch,
                    });

                    lastClose = close;
                }
                
                // To test error handling, you can uncomment the next line:
                // if (Math.random() > 0.8) { reject(new Error("Failed to connect to the simulated API.")); return; }

                resolve({ predictions, coin });
            } catch (e) {
                reject(e);
            }
        }, 500 + Math.random() * 1000);
    });
};
