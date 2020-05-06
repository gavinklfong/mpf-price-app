
  import React, { useEffect, useRef } from 'react';
  import Chart from 'chart.js';
  import { ChartDataPoint, ChartDataset } from '../models/ChartDiagramModel';

  
  export interface Props {
    type: string,
    labels: Array<string>,
    datasets: Array<ChartDataset>
    height: string
  }

  let chart: any = null;

  const ChartDiagram: React.FC<Props> = ( props ) => {

    console.debug("ChartComponent render()");
    
    const chartRef: any = useRef();
    // const [chart, setChart] = useState();

    // let gradientLine = chartRef
    //     .createLinearGradient(0, 0, 1 * 2, 0);
    // gradientLine.addColorStop(0, "#FF006E");
    // gradientLine.addColorStop(1, "#F46036");


    useEffect(() => {

        // try {
        //     if (chart !== null || chart !== undefined) {
        //         console.debug("chart.destroy()");
        //         chart.destroy();
        //     }
        // } catch (e) {
        //     console.debug("exception occur while trying to destroy chart");
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
            console.debug("error occured when trying format chart data");
            // console.debug(e);
        }

        return () => {

            try {
                if (chart !== null || chart !== undefined) {
                    console.debug("chart.destroy()");
                    chart.destroy();
                }
            } catch (e) {
                console.debug("exception occur while trying to destroy chart");
            };
        }

    }, [props.datasets, props.labels]);


    return (
        <div style={{position: "relative", height:props.height}} >
            <canvas
                id="myChart"
                ref={chartRef}
            />
        </div>
    );
};

export default ChartDiagram;