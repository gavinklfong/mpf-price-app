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
  import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
  import Chart from 'chart.js';


  export interface ChartDataPoint {
      x: string | number;
      y: string | number;
  }

  export interface ChartDataset {
      data: Array<ChartDataPoint>;
      label: string;
      borderColor?: string;
      fill?: boolean;
  }
  
  export interface Props {
    type: string,
    labels: Array<string>,
    datasets: Array<ChartDataset>
  }

  let chart: any = null;

  const ChartComponent: React.FC<Props> = ( props ) => {

    const chartRef = useRef<any>();
    // const [chart, setChart] = useState();

    // useEffect(() => {

        try {
            if (chart !== null || chart !== undefined) {
                console.log("chart.destroy()");
                chart.destroy();
            }
        } catch (e) {
            console.log("exception occur while trying to destroy chart");
            console.log(e);
        };

        // if (typeof chart !== "undefined") chart.destory();

        try {
        const chartRenderingCtxRef: CanvasRenderingContext2D = chartRef?.current?.getContext("2d")!;
        
        chart = new Chart(chartRenderingCtxRef, {
            type: props.type,
            data: {
                //Bring in data
                labels: props.labels,
                datasets: props.datasets
            },
            options: {
                //Customize chart options
            }
        });

        // setChart(newChart);
        
    // }, [props.datasets]);

    } catch (e) {
        console.log("error occured when trying format chart data");
        console.log(e);
    }

    return (
        <div>
            <canvas
                id="myChart"
                ref={chartRef}
            />
        </div>
    );
};

export default ChartComponent;