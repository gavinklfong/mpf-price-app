import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {
    useIonViewWillEnter,
  } from '@ionic/react';
import { useAppContext } from './ContextHook';
import { MPFService, MPFFundSummary } from '../services/MPFService';
import { Row } from '../components/SummaryTable';
import { ServiceFactory } from '../services/ServiceFactory';

export interface SummaryModel {
    selectedCategory: string;
    categoryList: string[];
    tableRows: Row[];
}

export const ALL_CATEGORY_ITEM = "-- All Categories --";

export const useSummary = () : [SummaryModel, Dispatch<SetStateAction<SummaryModel>>, boolean] => {

    const [pending, setPending] = useState(true);

    const initialSummaryPageModel = {selectedCategory: ALL_CATEGORY_ITEM, categoryList: [ALL_CATEGORY_ITEM], tableRows: []};
    const [summaryPageModel, setSummaryPageModel] = useState<SummaryModel>(initialSummaryPageModel);

    const { updateLoginSession} = useAppContext();

    const mpfService: MPFService = ServiceFactory.getMPFService();

    const formatTableRowData = (rows:MPFFundSummary[]):Row[] => {
        const result = rows.map(item => {
            let row: Row = {
                trustee: item.fund.trustee,
                fund: item.fund.fund,
                mth1: item.mth1,
                mth3: item.mth3,
                mth6: item.mth6,
                mth12: item.mth12
            }
            return row;
        });

        return result;
    }

    // temporary fix on show loading issue
    useIonViewWillEnter(() => {
        updateLoginSession((loginSession:any) => ({...loginSession, showLoading: false}));
    });

    useEffect(() => {
        (async () => {
          let result = await mpfService.getCategories();
          result.unshift(ALL_CATEGORY_ITEM);
          console.log("useSummary() - get category list = " + JSON.stringify(result));
          setSummaryPageModel(summaryPageModel => ({...summaryPageModel, categoryList: result}));
        })();
    }, [mpfService]);

    useEffect(() => {

        (async () => {

            updateLoginSession((loginSession:any) => ({...loginSession, showLoading: true}));
            setPending(true);
            let selectedCategories = [];
            if (summaryPageModel.selectedCategory === ALL_CATEGORY_ITEM)
                selectedCategories.push("");
            else
                selectedCategories.push(summaryPageModel.selectedCategory);

            let result = await mpfService.getSummaryByCategories(selectedCategories);
            const rows = formatTableRowData(result);
            setSummaryPageModel(summaryPageModel => ({...summaryPageModel, tableRows: rows}));
            updateLoginSession((loginSession:any) => ({...loginSession, showLoading: false}));
            setPending(false);
        })();

  }, [summaryPageModel.selectedCategory, mpfService, updateLoginSession]);

  return [summaryPageModel, setSummaryPageModel, pending];

}
