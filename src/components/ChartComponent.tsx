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

  const ChartComponent: React.FC = () => {

    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const chartRenderingCtxRef: CanvasRenderingContext2D = chartRef?.current?.getContext("2d")!;
        
        new Chart(chartRenderingCtxRef, {
            type: "line",
            data: {
                //Bring in data
                labels: ["Jan", "Feb", "March"],
                datasets: [
                    {
                        label: "Sales",
                        data: [86, 67, 91],
                    }
                ]
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