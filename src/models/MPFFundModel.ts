
export interface MPFFundPriceQuery {
    startDate: number;
    endDate: number;
    timePeriod?: string;
    funds: MPFFund[];
}

export interface MPFFundPrice {
    trustee: string;
    scheme: string;
    fund: string;
    prices: FundPrice[];
}

export interface FundPrice {
    date: number;
    price: number;
}

export interface MPFFund {
    trustee: string;
    scheme: string;
    fund: string;
}

export interface MPFCatalog {
    fund: MPFFund;
    categories: string[];
}

export interface MPFFundSummary {
    fund: MPFFund;
    mth1: number;
    mth3: number;
    mth6: number;
    mth12: number;
}
