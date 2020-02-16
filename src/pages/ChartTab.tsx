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
  IonRange
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
  const [chartDatasets, setChartDatasets] = useState(Array<ChartDataset>() );
  const [chartLabels, setChartLabels] = useState(new Array());
  // const [fundPriceQuery, setFundPriceQuery] = useState<MPFFundPriceQuery>({
  //   trustee: "HSBC",
  //   scheme: "SuperTrust Plus",
  //   fund: "European Equity Fund",
  //   startDate: 20191101,
  //   endDate: 20200201
  // });
  const [fundPriceQuery, setFundPriceQuery] = useState<MPFFundPriceQuery>({
    trustee: "",
    scheme: "",
    fund: "",
    startDate: 20191101,
    endDate: 20200201
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

  const retrieveMPFFunds = async (): Promise<MPFFund[]> => {
    return await mpfService.getFunds(fundPriceQuery.trustee, fundPriceQuery.scheme);
  }

  const retrieveMPFFundPrices = async (): Promise<MPFFundPrice[]> => {
    console.log("retrieveMPFFundPrices()");
    return await mpfService.getFundPrices(fundPriceQuery);
  }

  const updateChartData = (prices: Array<MPFFundPrice>) => {
   console.log("updateChartData()");

    let labels = Array<string>();
    let data = Array<ChartDataPoint>();

    prices.map((item: MPFFundPrice) => {
      let dateMoment = moment(item.date, "YYYYMMDD");
      let dateString = dateMoment.format("YYYY-MM-DD");
      labels.push(dateString);
      data.push({x: dateString, y: item.price});
    });

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
    
    let chartProps: ChartProps = {
      type: "line",
      labels: labels,
      datasets: datasets
    }

    console.log("updateChartData() setChartDatasets()");
    setChartDatasets(datasets);

    console.log("updateChartData() setChartLabels()");
    setChartLabels(labels);

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

      // setShowLoading(true);

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

      // setShowLoading(false);
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

        setShowLoading(true);
      
        let retrievedMPFFundPrices = await retrieveMPFFundPrices();
        updateChartData(retrievedMPFFundPrices);
  
        setShowLoading(false);
      }

    })();

  }, [fundPriceQuery.fund]);


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
            <IonRange name="range" value={1} min={1} max={12} step={3} snaps ticks color="danger">
                <IonLabel slot="start">1 Month</IonLabel>
                <IonLabel slot="end">12 Months</IonLabel>
            </IonRange>
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
