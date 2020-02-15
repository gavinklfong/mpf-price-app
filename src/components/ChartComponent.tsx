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

    console.log("ChartComponent render()");
    
    const chartRef = useRef<any>();
    // const [chart, setChart] = useState();

    useEffect(() => {

        // try {
        //     if (chart !== null || chart !== undefined) {
        //         console.log("chart.destroy()");
        //         chart.destroy();
        //     }
        // } catch (e) {
        //     console.log("exception occur while trying to destroy chart");
        // };

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
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });

            // setChart(newChart);
            
        } catch (e) {
            console.log("error occured when trying format chart data");
            // console.log(e);
        }

        return () => {

            try {
                if (chart !== null || chart !== undefined) {
                    console.log("chart.destroy()");
                    chart.destroy();
                }
            } catch (e) {
                console.log("exception occur while trying to destroy chart");
            };
        }

    }, [props.datasets, props.labels]);


    return (
        <div style={{position: "relative", height:"50vh" }} >
            <canvas
                id="myChart"
                ref={chartRef}
            />
        </div>
    );
};

export default ChartComponent;