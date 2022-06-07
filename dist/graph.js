// Display an error message if the user tries to plot the wrong number of variables
function errMsg(count) {
    const errorToast = document.getElementById('liveToast');
    var toastText = document.getElementById('toast-msg-text');
    toastText.innerHTML = "Please select " + count + " variables.";
    const toast = new bootstrap.Toast(errorToast);
    toast.show();
}

function scatterPlot(data, variables) {
    // Check if the user has selected the correct number of variables  
    if (variables.length == 2) {
        // Get the variables from array
        var var1 = variables[0],
            var2 = variables[1];
        var dataArr = [];
        // Pull corresponding data from the metadata and tracks arrays based on the variables
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.tracks[i].track) {
                dataArr.push([data.metadata[i][var1], data.metadata[i][var2], data.tracks[i].track["name"], data.tracks[i].track.artists[0]["name"], data.tracks[i].track["uri"]]);
            }
        }

        // Create the configuration object for the chart
        option = {
            tooltip: {
                formatter: (param) => {
                    return `
                        track: ${param.data[2]}<br />
                        artist: ${param.data[3]}<br />
                        ${var1}: ${param.data[0]}<br />
                        ${var2}: ${param.data[1]}
                        `;
                },
            },
            grid: {
                containLabel: true,
            },
            title: {
                text: data.title + ":  " + var1 + ' vs ' + var2,
                left: '10%',
                top: '2%',
                textStyle: {
                    color: '#fff'
                },
            },
            legend: {
                right: '10%',
                top: '3%',
            },
            grid: {
                left: '8%',
                top: '15%'
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
                // Display track name on hover
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
    } else {
        // If the user has selected the wrong number of variables, display an error message
        errMsg("two");
    }

}

function barGraph(data, variables) {

    switch (variables[0]) {
        case "duration_ms":
            var unit = "duration (ms)";
            break;
        case "loudness":
            var unit = "loudness (dB)";
            break;
        case "tempo":
            var unit = "tempo (bpm)";
            break;
        case "time_signature":
            var unit = "time signature (beats per bar)";
            break;
        case "key":
            var unit = "key (pitch class)";
            break;
        case "mode":
            var unit = "mode (0=minor, 1=major)";
            break;
        default:
            var unit = variables[0] + " score";
            break;
    }
    // Check if the user has selected the correct number of variables  
    if (variables.length == 1) {
        // Get the variables from array
        var var1 = variables[0];
        var dataArr = [];
        var names = [];
        // Pull corresponding data from the metadata and tracks arrays based on the variables
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.tracks[i].track) {
                dataArr.push([data.tracks[i].track["name"], data.metadata[i][var1], data.tracks[i].track.artists[0]["name"], data.tracks[i].track["uri"]]);
                names.push(data.tracks[i].track["name"]);
            }
        }

        // Create the configuration object for the chart
        var option = {
            tooltip: {
                formatter: (param) => {
                    return `
                        track: ${param.data[0]}<br />
                        artist: ${param.data[2]}<br />
                        ${var1}: ${param.data[1]}<br />
                        `;
                },
            },
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
                name: 'name',
                nameLocation: 'middle',
                nameGap: 30,
                type: 'category',
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
            dataset: {
                source: dataArr
            },
            series: [{
                type: 'bar',
                // Display track name on hover
                emphasis: {
                    focus: 'series',
                    label: {
                        show: true,
                        formatter: function(param) {
                            return param.data[0];
                        },
                        position: 'top'
                    }
                },
            }]
        };
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option, true);
    } else {
        // If the user has selected the wrong number of variables, display an error message
        errMsg("one");
    }

}

function scatter3d(data, variables) {
    // Check if the user has selected the correct number of variables  
    if (variables.length == 3) {
        // Get the variables from array
        var var1 = variables[0],
            var2 = variables[1],
            var3 = variables[2];

        // Manually set first array item to be axis labels
        var dataArr = [
            [var1, var2, var3]
        ];
        // Pull corresponding data from the metadata and tracks arrays based on the variables
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.tracks[i].track) {
                dataArr.push([data.metadata[i][var1], data.metadata[i][var2], data.metadata[i][var3], data.tracks[i].track["name"], data.tracks[i].track.artists[0]["name"], data.tracks[i].track["uri"]]);
            }
        }
        // Create the configuration object for the chart
        var option = {
            tooltip: {
                formatter: (param) => {
                    return `
                        track: ${param.data[3]}<br />
                        artist: ${param.data[4]}<br />
                        ${var1}: ${param.data[0]}<br />
                        ${var2}: ${param.data[1]}<br />
                        ${var3}: ${param.data[2]}
                        `;
                },
            },
            grid3D: {},
            xAxis3D: {
                name: var1,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                }
            },
            yAxis3D: {
                name: var2,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                }
            },
            zAxis3D: {
                name: var3,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                }
            },
            dataset: {
                dimensions: [
                    var1, var2, var3, 'name'
                ],
                source: dataArr
            },
            series: [{
                type: 'scatter3D',
                encode: {
                    x: var1,
                    y: var2,
                    z: var3,
                },
                // Display track name on hover
                emphasis: {
                    focus: 'series',
                    label: {
                        show: true,
                        formatter: function(param) {
                            return param.data[3];
                        },
                        position: 'top'
                    }
                },
            }]
        };
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option, true);
    } else {
        // If the user has selected the wrong number of variables, display an error message
        errMsg("three");
    }
}

function bar3d(data, variables) {
    // Check if the user has selected the correct number of variables  
    if (variables.length == 3) {
        // Get the variables from array
        var var1 = variables[0],
            var2 = variables[1],
            var3 = variables[2];

        // Manually set first array item to be axis labels
        var dataArr = [];
        // Pull corresponding data from the metadata and tracks arrays based on the variables
        for (var i = 0; i < data.metadata.length; i++) {
            if (data.tracks[i].track) {
                dataArr.push([data.metadata[i][var1], data.metadata[i][var2], data.metadata[i][var3], data.tracks[i].track["name"], data.tracks[i].track.artists[0]["name"], data.tracks[i].track["uri"]]);
            }
        }
        // Create the configuration object for the chart
        var option = {
            tooltip: {
                formatter: (param) => {
                    return `
                        track: ${param.data[3]}<br />
                        artist: ${param.data[4]}<br />
                        ${var1}: ${param.data[0]}<br />
                        ${var2}: ${param.data[1]}<br />
                        ${var3}: ${param.data[2]}
                        `;
                },
            },
            grid3D: {},
            visualMap: {
                type: 'continuous',
                max: 1,
                min: 0,
                precision: 2,
                show: false,
                inRange: {
                    color: [
                        '#313695',
                        '#4575b4',
                        '#74add1',
                        '#abd9e9',
                        '#e0f3f8',
                        '#ffffbf',
                        '#fee090',
                        '#fdae61',
                        '#f46d43',
                        '#d73027',
                        '#a50026'
                    ]
                }
            },
            xAxis3D: {
                axisPointer: {
                    show: false
                },
                name: var1,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                },
                type: 'value'
            },
            yAxis3D: {
                axisPointer: {
                    show: false
                },
                name: var2,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                },
                type: 'value'
            },
            zAxis3D: {
                axisPointer: {
                    show: false
                },
                name: var3,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#fff'
                },
                axisLabel: {
                    color: '#fff',
                },
                type: 'value'
            },
            dataset: {
                dimensions: [
                    var1, var2, var3
                ],
                source: dataArr
            },
            series: [{
                type: 'bar3D',
                shading: 'color',
                encode: {
                    x: var1,
                    y: var2,
                    z: var3,
                },
                itemStyle: {
                    opacity: 0.7
                },
                // Display track name on hover
                emphasis: {
                    focus: 'series',
                    label: {
                        show: true,
                        formatter: function(param) {
                            return param.data[3];
                        },
                        position: 'top'
                    }
                },
            }]
        };
        // Display the chart using the configuration items and data just specified.
        myChart.setOption(option, true, false, true);
    } else {
        // If the user has selected the wrong number of variables, display an error message
        errMsg("three");
    }
}