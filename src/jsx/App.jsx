import React, {Component} from 'react';
import style from './../styles/styles.less';

// https://d3js.org/
import * as d3 from 'd3';

// https://www.chartjs.org/
import Chart from 'chart.js';
import 'chartjs-plugin-labels';
import 'chartjs-plugin-datalabels';

let path_prefix, chart, interval;
if (location.href.match('localhost')) {
  path_prefix = './';
}
else {
  path_prefix = 'https://raw.githubusercontent.com/ebuddj/2020-swing_states/master/public/';
}

class App extends Component {
  constructor(props) {
    super(props);

    this.appRef = React.createRef();
    this.chartRef = React.createRef();

    this.state = {
    }
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {

  }
  componentWillUnMount() {

  }
  getData() {
    d3.csv('./data/data.csv').then((data) => {
      let bar_chart_data = {
        labels:[],
        datasets:[{
          backgroundColor:'rgba(105, 141, 197, 1)',
          data:[],
          label:'D'
        },{
          backgroundColor:'rgba(240, 119, 99, 1)',
          data:[],
          label:'R'
        }]
      };
      data.map((values, i) => {
        bar_chart_data.labels.push([values.state, values.votes]);
        bar_chart_data.datasets[0].data.push(values.d);
        bar_chart_data.datasets[1].data.push(values.r);
      });
      this.setState((state, props) => ({
        data:{...data},
        data1:data
      }), this.createChart(bar_chart_data, data));
    });
  }
  createChart(bar_chart_data, data) {
    let ctx = this.chartRef.current.getContext('2d');

    chart = new Chart(ctx, {
      data:bar_chart_data,
      options:{
        animation:{
          duration: 2000,
        },
        hover:{
          enabled:false,
        },
        legend:{
          display:false
        },
        onHover:(event, chartElement) => {
          // event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
        },
        plugins: {
          // https://chartjs-plugin-datalabels.netlify.app/guide/options.html
          datalabels:{
            align:'start',
            anchor:'end',
            color:'#000',
            font:{
              size:16,
              weight:'bold'
            },
            formatter: (value, context) => {
              return value + '%';
            }
          },
          // https://www.npmjs.com/package/chartjs-plugin-labels#usage
          labels:{
            render: (args) => {
              if (args.dataset.label === 'D') {
                return {
                  height:45,
                  src:path_prefix + 'media/img/biden.png',
                  width:45
                }
              }
              else {
                return {
                  height:45,
                  src:path_prefix + 'media/img/trump.png',
                  width:45
                }
              }
            },
            textMargin:0
          }
        },
        scales:{
          xAxes:[{
            display:true,
            gridLines:{
              display:false
            },
            ticks:{
              autoSkip:false,
              fontColor:'#000',
              fontSize:18,
              fontStyle:'bold',
              maxRotation:0,
              minRotation:0,
              z:9999
            },
            stacked:false
          }],
          yAxes:[{
            display:true,
            stacked:false,
            ticks:{
              suggestedMin:0
            }
          }]
        },
        title:{
          display:false,
        },
        tooltips:{
          enabled:false
        }
      },
      type:'bar'
    });
    // this.createInterval(data);
  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // static getDerivedStateFromProps(props, state) {}
  // getSnapshotBeforeUpdate(prevProps, prevState) {}
  // static getDerivedStateFromError(error) {}
  // componentDidCatch() {}
  render() {
    return (
      <div className={style.app}>
        <div className={style.chart_container}>
          <canvas id={style.chart} ref={this.chartRef}></canvas>
        </div>
      </div>
    );
  }
}
export default App;