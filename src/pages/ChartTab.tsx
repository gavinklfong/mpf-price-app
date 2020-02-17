import moment from 'moment';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonLoading,
  IonRange,
  IonToggle,
  IonNote,
  IonSpinner,
  IonSegment,
  IonSegmentButton
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import './ChartTab.css';
import ChartComponent, { ChartDataPoint, ChartDataset, Props as ChartProps }  from '../components/ChartComponent';
import { MPFService, MPFFundPrice, MPFFund, MPFFundPriceQuery } from '../services/MPFService';



const randomNumber = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min);
const randomByte = () => randomNumber(0, 255)
const randomPercent = () => (randomNumber(50, 100) * 0.01).toFixed(2)
const randomCssRgba = () => `rgba(${[randomByte(), randomByte(), randomByte(), randomPercent()].join(',')})`

const mpfService = new MPFService();


const ChartTab: React.FC = () => {

  const [trusteeEntries, setTrusteeEntries] = useState(new Array<MPFFund>());
  const [showLoading, setShowLoading] = useState(false);
  const [trustees, setTrustees] = useState(new Array<string>());
  const [schemes, setSchemes] = useState(new Array<string>());
  const [funds, setFunds] = useState(new Array<MPFFund>());

  const [queryRange, setQueryRange] = useState<number>(1);
  const [displayInPercent, setDisplayInPercent] = useState(true);

  const [pricePeriod, setPricePeriod] = useState<string>("D");

  const [fundPrices, setFundPrices] = useState(new Array<MPFFundPrice>());
  const [chartDatasets, setChartDatasets] = useState(Array<ChartDataset>() );
  const [chartLabels, setChartLabels] = useState(new Array());

  const [fundPriceQuery, setFundPriceQuery] = useState<MPFFundPriceQuery>({
    trustee: "",
    scheme: "",
    fund: "",
    startDate: +(moment().subtract("months", 6).format("YYYYMMDD")),
    endDate: +(moment().format("YYYYMMDD"))
  });

  const setSelectedTrustee = (trustee: string) => {
    setFundPriceQuery({...fundPriceQuery, trustee: trustee});
  }

  const setSelectedScheme = (scheme: string) => {
      setFundPriceQuery({...fundPriceQuery, scheme: scheme});
  }

  const setSelectedFund = (fund: string) => {
      setFundPriceQuery({...fundPriceQuery, fund: fund});
  }

  const setSelectedQueryRange = (range: number) => {
      let newStartDate = moment().subtract("months", range);
      setFundPriceQuery({...fundPriceQuery, startDate: +(newStartDate.format("YYYYMMDD"))});
      setQueryRange(range);
  }

  const retrieveMPFFundPrices = async (): Promise<MPFFundPrice[]> => {
    console.log("retrieveMPFFundPrices()");
    return await mpfService.getFundPrices(fundPriceQuery);
  }

  const prepareChartData = (prices: Array<MPFFundPrice>, inPercent: boolean): [Array<string>, Array<ChartDataset>] => {
   console.log("updateChartData()");

    let labels = Array<string>();
    let data = Array<ChartDataPoint>();

    if (prices && prices.length > 0) {

        let initialPrice = prices[0].price;
        prices.forEach((item: MPFFundPrice) => {
          let dateMoment = moment(item.date, "YYYYMMDD");
          let dateString = dateMoment.format("YYYY-MM-DD");
          
          labels.push(dateString);

          if (inPercent) {
              let priceInPercent = ((item.price - initialPrice) / initialPrice) * 100;
              data.push({x: dateString, y: priceInPercent});
          } else {
               data.push({x: dateString, y: item.price});
          }
        });
    }

    let datasets = Array<ChartDataset>();
    datasets.push(
      {
        label: fundPriceQuery.fund,
        data: data,
        borderColor: randomCssRgba(),
        fill: false
      }
    );

    console.log("updateChartData() - datasets: " + JSON.stringify(datasets));
    console.log("updateChartData() - labels: " + JSON.stringify(labels));

    return [labels, datasets];
  }

  // retrieve trustee list
  useEffect(() => {
      (async() => {
        let retrievedTrustees = await mpfService.getTrustees();
        console.log("retrieved trustees: " + retrievedTrustees);
        setTrustees(retrievedTrustees);
        // if (retrievedTrustees && retrievedTrustees.length > 0) {
        //     let defaultSeltectedTrustee = retrievedTrustees[0];
        //     setFundPriceQuery({...fundPriceQuery, trustee: defaultSeltectedTrustee});
        // }
      }
      )();
  }, []);

  // On trustee selected
  useEffect(() => {
    (async() => {

      setShowLoading(true);

      let retrievedFunds = await mpfService.getTrustee(fundPriceQuery.trustee);
      setTrusteeEntries(retrievedFunds);

      let schemeSet =  new Set<string>();
      retrievedFunds.forEach(item => {
          schemeSet.add(item.scheme);
      });
      let retrievedSchemes = Array.from(schemeSet);
      console.log("retrieved schemes for selected trustee: " + JSON.stringify(retrievedSchemes));

      setSchemes(retrievedSchemes);

      if (retrievedFunds && retrievedFunds.length > 0) {
        let defaultSelectedScheme = retrievedFunds[0].scheme;
        setFundPriceQuery({...fundPriceQuery, scheme: defaultSelectedScheme});
        // setFundPriceQuery(query => ({...query, cheme: defaultSelectedScheme}));
      }

      setShowLoading(false);
    }
    )();
  }, [fundPriceQuery.trustee]);

  // on scheme selected
  useEffect(() => {

    // setShowLoading(true);

    let fundList = trusteeEntries.filter(item => item.scheme === fundPriceQuery.scheme);
    if (fundList && fundList.length > 0) {
        setFunds(fundList);
        setFundPriceQuery(query => ({...query, fund: fundList[0].fund}));
    }
    // setShowLoading(false);

  },[fundPriceQuery.scheme, trusteeEntries]);

  // on fund selected
  useEffect(() => { 

    console.log("useEffect() selected fund change");

    (async() => {
      if (fundPriceQuery.fund != null && fundPriceQuery.fund.length > 0) {

        // setShowLoading(true);
        setShowLoading(true);
      
        let retrievedMPFFundPrices = await retrieveMPFFundPrices();
        setFundPrices(retrievedMPFFundPrices);

        setShowLoading(false);
      }

    })();

  }, [fundPriceQuery.fund, fundPriceQuery.startDate, fundPriceQuery.endDate, fundPriceQuery.timePeriod]);

  useEffect(() => { 

   setShowLoading(true);

   console.log("useEffect() selected fund price change");

   const [labels, datasets] = prepareChartData(fundPrices, displayInPercent);
   console.log("updateChartData() setChartDatasets()");
   setChartDatasets(datasets);

   console.log("updateChartData() setChartLabels()");
   setChartLabels(labels);

   setShowLoading(false);

 
 }, [fundPrices, displayInPercent]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
        <IonList>
          <IonItem>
            <IonLabel>Trustee</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Trustee --" 
              selectedText={fundPriceQuery.trustee} value={fundPriceQuery.trustee} 
              onIonChange={(e: any) => setSelectedTrustee(e.target.value) }>
              { trustees.map((item: string) => {
                return (
                  <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                );
              })}
            </IonSelect>            
          </IonItem>
          <IonItem>
            <IonLabel>Scheme</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- Select Scheme --" selectedText={fundPriceQuery.scheme} value={fundPriceQuery.scheme} onIonChange={(e: any) => setSelectedScheme(e.target.value) }>
               { schemes.map((item) => {
                  return (
                    <IonSelectOption key={item} value={item}>{item}</IonSelectOption>
                  );
               })}               
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Fund</IonLabel>
            <IonSelect interface="action-sheet" placeholder="-- All Funds --" selectedText={fundPriceQuery.fund} value={fundPriceQuery.fund} onIonChange={(e: any) => setSelectedFund(e.target.value) }>
              { funds.map((item: MPFFund) => {
                return (
                  <IonSelectOption key={item.fund} value={item.fund}>{item.fund}</IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>  
          <IonItem>
            <IonLabel>Range</IonLabel>
            <IonRange name="range" value={queryRange} min={1} max={12} step={3} debounce={1000} snaps ticks color="danger"
            onIonChange={(e: any) => setSelectedQueryRange(e.target.value)}>
                <IonLabel slot="start">1 Month</IonLabel>
                <IonLabel slot="end">12 Months</IonLabel>
            </IonRange>
            <IonLabel>Percent</IonLabel>
            <IonToggle checked={displayInPercent} onIonChange={(e: any) => setDisplayInPercent(!displayInPercent)}/>
          </IonItem>   
          <IonItem>
            <IonSegment value={pricePeriod} onIonChange={e => { console.log('price period selected', e.detail.value); setFundPriceQuery({...fundPriceQuery, timePeriod: e.detail.value }); setPricePeriod(p => e.detail.value!)}}>
               <IonSegmentButton value="D">
               <IonLabel>Daily</IonLabel>
               </IonSegmentButton>
               <IonSegmentButton value="W">
               <IonLabel>Weekly</IonLabel>
               </IonSegmentButton>
               <IonSegmentButton value="M">
               <IonLabel>Monthly</IonLabel>
               </IonSegmentButton>
            </IonSegment>
          </IonItem>     
        </IonList>
        </IonCard>
        <IonCard>
            <ChartComponent type="line" labels={chartLabels} datasets={chartDatasets} /> 
        </IonCard>

        {/* Overlay to show while data fetching */}
        <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Loading...'}
        />

      </IonContent>
    </IonPage>
  );
};

export default ChartTab;
