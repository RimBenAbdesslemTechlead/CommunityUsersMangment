/* eslint-disable no-undef */
/* eslint-disable no-new */
/* eslint-disable no-console */
({
    // eslint-disable-next-line no-unused-vars
    afterScriptsLoaded : function(component, event, helper) 
    {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        console.log('jsonData===',jsonData);
        console.log('dataObj===',dataObj);
        new Highcharts.Chart({
            chart: {
                renderTo: component.find("chart").getElement(),
                type: component.get("v.chartType")
            },
            title: {
                text:
        'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">Salesforce</a>'
            },
            subtitle: {
                text: component.get("v.chartSubTitle")
            },
            xAxis: {
                categories: component.get("v.xAxisCategories"),
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: 
                {
                    text: component.get("v.yAxisParameter")
                }
            },
            tooltip: 
            {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: [{
                        enabled: true,
                        distance: 20
                    }, {
                        enabled: true,
                        distance: -40,
                        format: '{point.percentage:.1f}%',
                        style: {
                            fontSize: '1.2em',
                            textOutline: 'none',
                            opacity: 0.7
                        },
                        filter: {
                            operator: '>',
                            property: 'percentage',
                            value: 10
                        }
                    }]
                }
            },
            series: dataObj
        });
    }
})