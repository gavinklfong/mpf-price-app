
export interface ChartDataPoint {
    x: string | number;
    y: string | number;
}

export interface ChartDataset {
    data: Array<ChartDataPoint>;
    label?: string;
    borderColor?: string;
    fill?: boolean;
}