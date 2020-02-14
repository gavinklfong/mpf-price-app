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

const ChartTab: React.FC = () => {

  // let labels: Array<string> = ["Jan", "Feb", "March"];

  // let data: Array<ChartDataPoint> = [];
  // data.push({x: "Jan", y: 10});
  // data.push({x: "Feb", y: 40});
  // data.push({x: "March", y: 80});

  // let datasets: Array<ChartDataset> = [];
  // datasets.push(
  //   {
  //     label: "Sales",
  //     data: data,
  //     borderColor: randomCssRgba(),
  //     fill: false
  //   }
  // );

  const [showLoading, setShowLoading] = useState(false);
  const [funds, setFunds] = useState(new Array<MPFFund>());
  const [selectedFund, setSelectedFund] = useState("");
  const [fundPrices, setFundPrices] = useState(new Array<MPFFundPrice>());
  const [chartDatasets, setChartDatasets] = useState(Array<ChartDataset>() );
  const [chartLabels, setChartLabels] = useState(new Array());
  const [chartProps, setChartProps] = useState<ChartProps>();


  const trustee = "HSBC";
  const scheme = "SuperTrust Plus";

  const mpfService = new MPFService();


  const retrieveMPFFunds = async (): Promise<MPFFund[]> => {
    return await mpfService.getFunds(trustee, scheme);
    // setFunds(retrievedFunds);
    // console.log("retrieveMPFFunds()")
    // console.log(JSON.stringify(retrievedFunds));

  }

  const retrieveMPFFundPrices = async (): Promise<MPFFundPrice[]> => {
    console.log("retrieveMPFFundPrices()");

    let fundPriceQuery: MPFFundPriceQuery = {
      trustee: trustee,
      scheme: scheme,
      fund: selectedFund,
      startDate: 20191101,
      endDate: 20200201
    }

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
        label: selectedFund,
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

    console.log("updateChartData() setChartProps()");
    setChartProps(chartProps);

    console.log("updateChartData() setChartDatasets()");
    setChartDatasets(datasets);

    console.log("updateChartData() setChartLabels()");
    setChartLabels(labels);

  }

  const fundSelected = async (e: any) => {
    console.log("Fund selected. " + e.target.value);
    setSelectedFund(e.target.value);

    // setShowLoading(true);
      
    // // let retrievedFunds = await retrieveMPFFunds();
    // // setFunds(retrievedFunds);
    
    // let retrievedMPFFundPrices = await retrieveMPFFundPrices();
    // setFundPrices(retrievedMPFFundPrices);

    // updateChartData(retrievedMPFFundPrices);

    // setShowLoading(false);
  }


  useEffect(() => { 

    console.log("useEffect() triggered");

    let process = async () => {
      setShowLoading(true);
      
      let retrievedFunds = await retrieveMPFFunds();
      console.log("useEffect() setFund()");
      setFunds(retrievedFunds);
      
      let retrievedMPFFundPrices = await retrieveMPFFundPrices();
      console.log("useEffect() setFundPrices()");
      setFundPrices(retrievedMPFFundPrices);

      console.log("useEffect() updateChartData()");
      updateChartData(retrievedMPFFundPrices);

      setShowLoading(false);
    }

    process();

  }, [selectedFund]);


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
            <IonSelect interface="action-sheet">
              <IonSelectOption value="HSBC">HSBC</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Scheme</IonLabel>
            <IonSelect interface="action-sheet">
              <IonSelectOption value="TrustPlus">Trust Plus</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Fund</IonLabel>
            <IonSelect interface="action-sheet" onIonChange={fundSelected}>
              { funds.map((item: MPFFund) => {
                return (
                  <IonSelectOption key={item.fund} value={item.fund}>{item.fund}</IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>  
          <IonItem>
            <IonRange min={3} max={24} step={3} snaps dualKnobs ticks color="danger">
              <IonIcon size="small" slot="start" name="sunny" />
              <IonIcon slot="end" name="sunny" />
            </IonRange>
          </IonItem>        
        </IonList>
        </IonCard>
        <IonCard>
          <ChartComponent type="line" labels={chartLabels} datasets={chartDatasets} />
        </IonCard>
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
