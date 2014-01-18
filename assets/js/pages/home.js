Ext.require([
    'Ext.chart.*',
    'Ext.Window', 
    'Ext.fx.target.Sprite', 
    'Ext.layout.container.Fit', 
    'Ext.window.MessageBox'
]);
Ext.require('Ext.chart.*');
Ext.require(['Ext.layout.container.Fit', 'Ext.window.MessageBox']);

Ext.onReady(function() {

    var downloadChart = function(chart){
        Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
            if(choice == 'yes'){
                chart.save({
                    type: 'image/png'
                });
            }
        });
    };

    var chart1 = Ext.create('Ext.chart.Chart',{
        animate: false,
        store: store1,
        insetPadding: 30,
        axes: [{
            type: 'Numeric',
            minimum: 0,
            position: 'left',
            fields: ['data1'],
            title: false,
            grid: true,
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0'),
                font: '10px Arial'
            }
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: false,
            label: {
                font: '11px Arial',
                renderer: function(name) {
                    return name.substr(0, 3) + ' 07';
                }
            }
        }],
        series: [{
            type: 'line',
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            listeners: {
                itemmouseup: function(item) {
                    Ext.example.msg('Item Selected', item.value[1] + ' visits on ' + Ext.Date.monthNames[item.value[0]]);
                }  
            },
            tips: {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get('name'));
                    this.update(storeItem.get('data1'));
                }
            },
            style: {
                fill: '#38B8BF',
                stroke: '#38B8BF',
                'stroke-width': 3
            },
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0,
                fill: '#38B8BF',
                stroke: '#38B8BF'
            }
        }]
    });
 

    var panel1 = Ext.create('widget.panel', {
        width: '100%',
        height: 300,
        title: 'ExtJS.com Visits Trends, 2007/2008 (No styling)',
        renderTo: 'charts-container1',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function(){ downloadChart(chart1); }
        }],
        items: chart1,
        frame: true,
        style: 'margin-bottom: 20px'
    });
    
    var chart2 = Ext.create('Ext.chart.Chart',{
        animate: false,
        store: store1,
        insetPadding: 30,
        axes: [{
            type: 'Numeric',
            minimum: 0,
            position: 'left',
            fields: ['data1'],
            title: false,
            grid: true,
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0'),
                font: '10px Arial'
            }
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: false,
            label: {
                font: '11px Arial',
                renderer: function(name) {
                    return name.substr(0, 3);
                }
            }
        }],
        series: [{
            type: 'line',
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            tips: {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get('data1') + ' visits in ' + storeItem.get('name').substr(0, 3));
                }
            },
            style: {
                fill: '#38B8BF',
                stroke: '#38B8BF',
                'stroke-width': 3
            },
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0,
                fill: '#38B8BF',
                stroke: '#38B8BF'
            }
        }]
    });
 

    var panel2 = Ext.create('widget.panel', {
        width: '100%',
        height: 300,
        title: 'ExtJS.com Visits Trends, 2007/2008 (Simple styling)',
        renderTo: 'charts-container1',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function(){ downloadChart(chart2); }
        }],
        items: chart2,
        frame: true,
        style: 'margin-bottom: 20px'
    });
    
    var chart3 = Ext.create('Ext.chart.Chart', {
        animate: false,
        store: store1,
        insetPadding: 30,
        gradients: [{
          angle: 90,
          id: 'bar-gradient',
          stops: {
              0: {
                  color: '#99BBE8'
              },
              70: {
                  color: '#77AECE'
              },
              100: {
                  color: '#77AECE'
              }
          }
        }],
        axes: [{
            type: 'Numeric',
            minimum: 0,
            maximum: 100,
            position: 'left',
            fields: ['data1'],
            title: false,
            grid: true,
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0'),
                font: '10px Arial'
            }
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: false,
            grid: true,
            label: {
                font: '11px Arial',
                renderer: function(name) {
                    return name.substr(0, 3);
                }
            }
        }],
        series: [{
            type: 'column',
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            style: {
                fill: 'url(#bar-gradient)',
                'stroke-width': 3
            },
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0,
                fill: '#38B8BF',
                stroke: '#38B8BF'
            }
        }, {
            type: 'line',
            axis: 'left',
            xField: 'name',
            yField: 'data2',
            tips: {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    this.setTitle(storeItem.get('data2') + ' visits in ' + storeItem.get('name').substr(0, 3));
                }
            },
            style: {
                fill: '#18428E',
                stroke: '#18428E',
                'stroke-width': 3
            },
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0,
                fill: '#18428E',
                stroke: '#18428E'
            }
        }]
    }); 

    var panel3 = Ext.create('widget.panel', {
        width: '100%',
        height: 300,
        title: 'ExtJS.com Visits Trends, 2007/2008 (Full styling)',
        renderTo: 'charts-container1',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function(){ downloadChart(chart3); }
        }],
        items: chart3,
        frame: true,
        style: 'margin-bottom: 20px'
    });
});

Ext.onReady(function () {
    store1.loadData(generateData(8));
    
    var chart = Ext.create('Ext.chart.Chart', {
        style: 'background:#fff',
        animate: true,
        store: store1,
        shadow: true,
        theme: 'Category1',
        legend: {
            position: 'right'
        },
        axes: [{
            type: 'Numeric',
            minimum: 0,
            position: 'left',
            fields: ['data1', 'data2', 'data3'],
            title: 'Number of Hits',
            minorTickSteps: 1,
            grid: {
                odd: {
                    opacity: 1,
                    fill: '#ddd',
                    stroke: '#bbb',
                    'stroke-width': 0.5
                }
            }
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['name'],
            title: 'Month of the Year'
        }],
        series: [{
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            xField: 'name',
            yField: 'data1',
            markerConfig: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }, {
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            smooth: true,
            xField: 'name',
            yField: 'data2',
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }, {
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            smooth: true,
            fill: true,
            xField: 'name',
            yField: 'data3',
            markerConfig: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]
    });


    var panel = Ext.create('widget.panel', {
        width: '100%',
        height: 600,
        hidden: false,
        maximizable: true,
        title: 'Line Chart',
        renderTo: 'charts-container2',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        chart.save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }, {
            text: 'Reload Data',
            handler: function() {
                // Add a short delay to prevent fast sequential clicks
                window.loadTask.delay(100, function() {
                    store1.loadData(generateData(8));
                });
            }
        }],
        items: chart,
        frame: true,
        style: 'margin-bottom: 20px'
    });
});

Ext.onReady(function () {
    store1.loadData(generateData(6, 20));

    var donut = false;
    
    var chart = Ext.create('Ext.chart.Chart', {
        xtype: 'chart',
        animate: true,
        store: store1,
        shadow: true,
        legend: {
            position: 'right'
        },
        insetPadding: 60,
        theme: 'Base:gradients',
        series: [{
            type: 'pie',
            field: 'data1',
            showInLegend: true,
            donut: donut,
            tips: {
                trackMouse: true,
                renderer: function(storeItem, item) {
                    //calculate percentage.
                    var total = 0;
                    store1.each(function(rec) {
                        total += rec.get('data1');
                    });
                    this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('data1') / total * 100) + '%');
                }
            },
            highlight: {
                segment: {
                    margin: 20
                }
            },
            label: {
                field: 'name',
                display: 'rotate',
                contrast: true,
                font: '18px Arial'
            }
        }]
    });


    var panel1 = Ext.create('widget.panel', {
        width: '100%',
        height: 600,
        title: 'Semester Trends',
        renderTo: 'charts-container2',
        layout: 'fit',
        tbar: [{
            text: 'Save Chart',
            handler: function() {
                Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
                    if(choice == 'yes'){
                        chart.save({
                            type: 'image/png'
                        });
                    }
                });
            }
        }, {
            text: 'Reload Data',
            handler: function() {
                // Add a short delay to prevent fast sequential clicks
                window.loadTask.delay(100, function() {
                    store1.loadData(generateData(6, 20));
                });
            }
        }, {
            enableToggle: true,
            pressed: false,
            text: 'Donut',
            toggleHandler: function(btn, pressed) {
                chart.series.first().donut = pressed ? 35 : false;
                chart.refresh();
            }
        }],
        items: chart,
        frame: true,
        style: 'margin-bottom: 20px'
    });
});
