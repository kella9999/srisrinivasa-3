
export type TimeInterval = '3min' | '5min' | '15min';

export interface PredictionData {
    timestamp: string;
    Actual_Open: number;
    Actual_High: number;
    Actual_Low: number;
    Actual_Close: number;
    Predicted_Close: number;
    'Prediction_Error (Close)': number;
    Actual_Trend: 'UP' | 'DOWN';
    Predicted_Trend: 'UP' | 'DOWN';
    Trend_Match: boolean;
}
