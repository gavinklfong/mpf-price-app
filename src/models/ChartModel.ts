

import { MPFFundPrice, MPFFund, FundPrice, MPFFundPriceQuery } from './MPFFundModel';
import { ChartDataset } from './ChartDiagramModel';

export interface ChartModel {
    trusteeList?: string[],
    schemeList?: string[],
    fundList?: string[],
 
    trustee: string,
    scheme: string,
    funds?: string[],
    selectedFundText: string,
 
    fundRecords?: MPFFund[]
 
    displayInPercent: boolean,
    queryTimeRange: number,
    timePeriod: string,
    
    fundPriceMap?: Map<MPFFund, MPFFundPrice>,
 
    chartDatasets?: ChartDataset[],
    chartLabels?: string[]
 }