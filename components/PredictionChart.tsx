import React, { useEffect, useRef } from 'react';
import {
    createChart,
    CrosshairMode,
    LineStyle,
    type IChartApi,
    type ISeriesApi,
    type Time,
    type CandlestickData,
    type LineData,
} from 'lightweight-charts';
import { PredictionData } from '../types';

interface PredictionChartProps {
    data: PredictionData[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartApiRef = useRef<IChartApi | null>(null);
    const candlestickSeriesApiRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const predictionLineSeriesApiRef = useRef<ISeriesApi<'Line'> | null>(null);

    // Effect for initialization and cleanup
    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#1f2937' }, // bg-gray-800
                textColor: '#d1d5db', // text-gray-300
            },
            grid: {
                vertLines: { color: '#374151' }, // bg-gray-700
                horzLines: { color: '#374151' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#4b5563', // gray-600
            },
            timeScale: {
                borderColor: '#4b5563',
                timeVisible: true,
                secondsVisible: false,
            },
        });
        chartApiRef.current = chart;

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#10b981',
            wickDownColor: '#ef4444',
            wickUpColor: '#10b981',
        });
        candlestickSeriesApiRef.current = candlestickSeries;
        
        const predictionLineSeries = chart.addLineSeries({
            color: '#06b6d4',
            lineWidth: 2,
            lineStyle: LineStyle.Dotted,
        });
        predictionLineSeriesApiRef.current = predictionLineSeries;

        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0] && entries[0].contentRect.width) {
                 chart.resize(entries[0].contentRect.width, entries[0].contentRect.height);
            }
        });
        resizeObserver.observe(chartContainerRef.current);

        // Cleanup on unmount
        return () => {
            resizeObserver.disconnect();
            if (chartApiRef.current) {
                chartApiRef.current.remove();
            }
            chartApiRef.current = null;
            candlestickSeriesApiRef.current = null;
            predictionLineSeriesApiRef.current = null;
        };
    }, []); // Empty dependency array, runs only once

    // Effect to update data
    useEffect(() => {
        if (!candlestickSeriesApiRef.current || !predictionLineSeriesApiRef.current) {
            return;
        }
        
        const candlestickData: CandlestickData[] = data.map(d => ({
            time: (new Date(d.timestamp).getTime() / 1000) as Time,
            open: d.Actual_Open,
            high: d.Actual_High,
            low: d.Actual_Low,
            close: d.Actual_Close,
        }));

        const predictionData: LineData[] = data.map(d => ({
            time: (new Date(d.timestamp).getTime() / 1000) as Time,
            value: d.Predicted_Close,
        }));

        candlestickSeriesApiRef.current.setData(candlestickData);
        predictionLineSeriesApiRef.current.setData(predictionData);

        if (data.length > 0 && chartApiRef.current) {
            chartApiRef.current.timeScale().fitContent();
        }
    }, [data]);

    return <div ref={chartContainerRef} className="h-full w-full" />;
};
