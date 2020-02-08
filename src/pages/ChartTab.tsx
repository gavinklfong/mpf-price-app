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
  IonSelectOption
} from '@ionic/react';
import { book, build, colorFill, grid } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import './ChartTab.css';
import ChartComponent, { ChartDataPoint, ChartDataset }  from '../components/ChartComponent';
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

  const [funds, setFunds] = useState(new Array<MPFFund>());
  const [selectedFund, setSelectedFund] = useState("");
  const [fundPrices, setFundPrices] = useState(new Array<MPFFundPrice>());
  const [chartDatasets, setChartDatasets] = useState(Array<ChartDataset>() );
  const [chartLabels, setChartLabels] = useState(new Array());


  const trustee = "HSBC";
  const scheme = "SuperTrust Plus";

  const mpfService = new MPFService();


  const retrieveMPFFunds = async () => {
    let retrievedFunds = await mpfService.getFunds(trustee, scheme);
    setFunds(retrievedFunds);
    console.log("retrieveMPFFunds()")
    console.log(JSON.stringify(retrievedFunds));
  }

  const retrieveMPFFundPrices = async () => {
    console.log("retrieveMPFFundPrices()");

    let fundPriceQuery: MPFFundPriceQuery = {
      trustee: trustee,
      scheme: scheme,
      fund: selectedFund,
      startDate: 20191101,
      endDate: 20200201
    }

    let retrievedMPFFundPrices = await mpfService.getFundPrices(fundPriceQuery);
    setFundPrices(retrievedMPFFundPrices);
  }

  const updateChartData = () => {
   console.log("updateChartData()");

    let labels = Array<String>();
    let data = Array<ChartDataPoint>();

    fundPrices.map((item: MPFFundPrice) => {
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

    setChartDatasets(datasets);
    setChartLabels(labels);

  }

  const fundSelected = (e: any) => {
    console.log("Fund selected. " + e.target.value);
    setSelectedFund(e.target.value);
  }


  useEffect(() => { 

    console.log("useEffect() triggered");

    let process = async () => {
      await retrieveMPFFunds();
      await retrieveMPFFundPrices();
      updateChartData();
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
                  <IonSelectOption value={item.fund}>{item.fund}</IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>          
        </IonList>
        </IonCard>
        <IonCard>
          <ChartComponent type="line" labels={chartLabels} datasets={chartDatasets}/>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ChartTab;
