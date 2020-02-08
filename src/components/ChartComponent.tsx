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
  import React, { useEffect, useRef } from 'react';
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
  interface Props {
    type: string,
    labels: Array<string>,
    datasets: Array<ChartDataset>
  }


  const ChartComponent: React.FC<Props> = ( props ) => {

    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const chartRenderingCtxRef: CanvasRenderingContext2D = chartRef?.current?.getContext("2d")!;
        
        new Chart(chartRenderingCtxRef, {
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
        
    }, []);

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