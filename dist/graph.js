function scatterPlot(data, var1, var2) {
    var dataArr = [];
    for (var i = 0; i < data.metadata.length; i++) {
        dataArr.push([data.metadata[i][var1], data.metadata[i][var2], data.tracks[i].track["name"]]);
    }

    option = {
        grid: {
            containLabel: true,
        },
        title: {
            text: var1 + ' vs ' + var2,
            left: '10%',
            top: '2%',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            right: '10%',
            top: '3%',
        },
        grid: {
            left: '8%',
            top: '10%'
        },
        xAxis: {
            name: var1,
            nameLocation: 'middle',
            nameGap: 30,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            nameTextStyle: {
                color: '#fff'
            },
            axisLabel: {
                color: '#fff'
            }
        },
        yAxis: {
            name: var2,
            nameLocation: 'middle',
            nameGap: 40,
            splitLine: {
                lineStyle: {
                    type: 'dashed'
                }
            },
            nameTextStyle: {
                color: '#fff'
            },
            scale: true,
            axisLabel: {
                color: '#fff'
            }
        },
        series: [{
            symbolSize: 20,
            data: dataArr,
            type: 'scatter',
            emphasis: {
                focus: 'series',
                label: {
                    show: true,
                    formatter: function(param) {
                        return param.data[2];
                    },
                    position: 'top'
                }
            },
            itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                        offset: 0,
                        color: 'rgb(251, 118, 123)'
                    },
                    {
                        offset: 1,
                        color: 'rgb(204, 46, 72)'
                    }
                ])
            }
        }]
    };
    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option, true);

}

function barGraph(data, var1, unit) {

    var dataArr = [];
    var names = [];
    for (var i = 0; i < data.metadata.length; i++) {
        dataArr.push(data.metadata[i][var1]);
        names.push(data.tracks[i].track["name"]);
    }

    var option = {
        grid: {
            containLabel: true,
        },
        title: {
            text: var1,
            left: '10%',
            top: '2%',
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            right: '10%',
            top: '3%',
        },
        xAxis: {
            name: "songs",
            nameLocation: 'middle',
            nameGap: 30,
            type: 'category',
            data: names,
            nameTextStyle: {
                color: '#fff'
            },
            axisLabel: {
                color: '#fff'
            }

        },
        yAxis: {
            name: unit,
            nameLocation: 'middle',
            nameGap: 40,
            nameTextStyle: {
                color: '#fff'
            },
            axisLabel: {
                color: '#fff',
            }
        },
        series: [{
            data: dataArr,
            type: 'bar',
            emphasis: {
                focus: 'series',
                label: {
                    show: true,
                    formatter: function(param) {
                        return param.name;
                    },
                    position: 'top'
                }
            },
        }]
    };
    // Display the chart using the configuration items and data just specified.
    myChart.setOption(option, true);
}