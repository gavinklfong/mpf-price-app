
export interface Row {
    trustee: string
    fund: string
    mth12: number
    mth6: number
    mth3: number
    mth1: number
}

export interface SummaryModel {
    selectedCategory: string;
    categoryList: string[];
    tableRows: Row[];
}
