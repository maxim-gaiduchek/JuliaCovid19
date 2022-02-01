var rnbo_map = [
    ['ua-my', 4911, 2377230],
    ['ua-ks', 4902, 1027913],
    ['ua-kc', 4909, 2967360],
    ['ua-zt', 4914, 1208212],
    ['ua-sm', 4899, 1068247],
    ['ua-dt', 4912, 4131808],
    ['ua-dp', 4913, 3176648],
    ['ua-kk', 4901, 2658461],
    ['ua-lh', 4894, 2135913],
    ['ua-pl', 4897, 1386978],
    ['ua-zp', 4891, 1687401],

    // ['ua-sc', 0,385998],
//  ['ua-kr', 0,1968550],

    ['ua-ch', 4906, 991294],
    ['ua-rv', 4898, 1152961],
    ['ua-cv', 4905, 901632],
    ['ua-if', 4892, 1368097],
    ['ua-km', 4903, 1254702],
    ['ua-lv', 4895, 2512084],
    ['ua-tp', 4900, 1038695],
    ['ua-zk', 4915, 1253791],
    ['ua-vo', 4908, 1031421],
    ['ua-ck', 4904, 1192137],
    ['ua-kh', 4893, 933109],
    ['ua-kv', 4910, 1781044],
    ['ua-mk', 4896, 1119862],
    ['ua-vi', 4907, 1545416],
    ['ua-sc', 0, 385998],
    ['ua-kr', 0, 1968550]


];
var data0 = [
    ['ua-my', 0],
    ['ua-ks', 0],
    ['ua-kc', 0],
    ['ua-zt', 0],
    ['ua-sm', 0],
    ['ua-dt', 0],
    ['ua-dp', 0],
    ['ua-kk', 0],
    ['ua-lh', 0],
    ['ua-pl', 0],
    ['ua-zp', 0],

    //   ['ua-sc', 0],
    //   ['ua-kr', 0],

    ['ua-ch', 0],
    ['ua-rv', 0],
    ['ua-cv', 0],
    ['ua-if', 0],
    ['ua-km', 0],
    ['ua-lv', 0],
    ['ua-tp', 0],
    ['ua-zk', 0],
    ['ua-vo', 0],
    ['ua-ck', 0],
    ['ua-kh', 0],
    ['ua-kv', 0],
    ['ua-mk', 0],
    ['ua-vi', 0]
];

var xmlhttp1 = new XMLHttpRequest();
var yourDate = new Date();

var url1 = "https://api-covid19.rnbo.gov.ua/data?to=" + yourDate.toISOString().split('T')[0];
// var url = "https://api-covid19.rnbo.gov.ua/data?to=2021-04-04";
// var url = "https://api-covid19.rnbo.gov.ua/data?to=2021-08-10";

xmlhttp1.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);

        for (i = 0; i < data0.length; i++) {
            console.log(Object.values(data0[i])[0]);

            for (j = 0; j < myArr.ukraine.length; j++) {
                // console.log(myArr.ukraine[j].country);

                if (myArr.ukraine[j].country == Object.values(rnbo_map[i])[1]) {
                    data0[i] = [Object.values(rnbo_map[i])[0], Math.round((myArr.ukraine[j].delta_confirmed / Object.values(rnbo_map[i])[2]) * 100000)];
                    //       console.log(myArr.ukraine[j].delta_confirmed);
                }
            }
        }


        mm = buildChart(data0);

    }
//console.log(d1);

};

xmlhttp1.open("GET", url1, true);
xmlhttp1.send();

//mm= buildChart(data0);

function buildChart(data_) {
    fc = Highcharts.mapChart('container_map', {
        chart: {
            map: 'countries/ua/ua-all'
        },
        title: {
            text: 'Ukraine'
        },
        subtitle: {
            text: ''
        },
        legend: {
            enabled: true
        },
        credits: {
            enabled: false
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            // stops: [
            //     [0, 'black'],
            //     [1, '#00FF00'],
            //     [10, '#FF0000']
            // ],
            // min: 1,
            // max: 1000,
            // type: 'logarithmic',
            // minColor: '#00FF00',
            // maxColor: '#FF0000',
            // lineColor: 'black',
            // lineWidth: 10
            //
            // dataClasses: [{
            //     from: 0,
            //     to: 0,
            //     color: 'black',
            //     name: 'Clinton'
            // }],
            // max: 50,
            // type: 'logarithmic',
            // minColor: 'green',
            // maxColor: 'red',
            min: 1,
            minColor: '#10FF00',
            maxColor: '#FF0000'
        },
        plotOptions: {
            series: {
                events: {
                    click: function (e) {
                        const url = "ua_reg_new.html?reg=" + e.target.point.options['hc-key'];
                        console.log(e.target.point);
                        location.href = url;
                    }
                }
            }
        },

        series: [{
            name: 'Daily per 100000',
            data: data_,
            keys: ['hc-key', 'value'],
            joinBy: 'hc-key',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
    return fc;
}

var countryName = 'Ukraine'
var dstime = [];
var dailyCases = getDailyCases("UA");
var startDate = "2020-02-15";

var holidaysList = ['2020-03-07', '2020-03-08', '2020-03-09', '2020-04-18', '2020-04-19', '2020-04-20', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-09', '2020-05-10', '2020-05-11', '2020-06-06', '2020-06-07', '2020-06-08', '2020-06-27', '2020-06-28', '2020-06-29', '2020-08-22', '2020-08-23', '2020-08-24', '2020-10-14', '2020-12-25', '2020-12-26', '2020-12-27',
    '2021-01-01', '2021-01-02', '2021-01-03', '2021-01-07', '2021-01-08', '2021-01-09', '2021-01-10', '2021-03-06', '2021-03-07', '2021-03-08', '2021-05-01', '2021-05-02', '2021-05-03', '2021-05-04', '2021-05-08', '2021-05-09', '2021-05-10', '2021-06-19', '2021-06-20', '2021-06-21', '2021-06-26', '2021-06-27', '2021-06-28', '2021-08-21', '2021-08-22', '2021-08-23', '2021-08-24', '2021-10-14', '2021-10-15', '2021-10-16', '2021-10-17', '2021-12-25', '2021-12-26', '2021-12-27',
    '2022-01-01'];

var dvHWS = [];
var dsHolidays = [];
var dsHolidaysWeeks = [];


document.getElementById("container").innerHTML = 'Loading data...';

var xmlhttp = new XMLHttpRequest();
var url = "https://api-covid19.rnbo.gov.ua/charts/main-data?mode=ukraine";

xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var myArr = JSON.parse(this.responseText);

        dailyCases = total_to_daily(myArr.confirmed);
        startDate = myArr.dates[0];

        if (dailyCases[dailyCases.length - 1] == 0) {
            dailyCases.splice(dailyCases.length - 1, 1);
        }

        mm = buildChart2(parseInt(document.getElementById('calcRange').value), parseInt(document.getElementById('pred').value));
        showDataTable(buildTimeDataSet(dailyCases, startDate, parseInt(document.getElementById('pred').value)), dailyCases, dvHWS, dailyCases.length - 1, dsHolidays);

    } else {
        // countryName = 'Ukraine <br> Online data unavailable. Manual update: ' +   new Date(document.lastModified);
        mm = buildChart2(parseInt(document.getElementById('calcRange').value), parseInt(document.getElementById('pred').value));
        showDataTable(buildTimeDataSet(dailyCases, startDate, parseInt(document.getElementById('pred').value)), dailyCases, dvHWS, dailyCases.length - 1, dsHolidays);
    }
};

xmlhttp.ontimeout = function (e) {
    // countryName = 'Ukraine <br> Online data unavailable. Manual update: ' +   new Date(document.lastModified);
    mm = buildChart2(parseInt(document.getElementById('calcRange').value), parseInt(document.getElementById('pred').value));
    showDataTable(buildTimeDataSet(dailyCases, startDate, parseInt(document.getElementById('pred').value)), dailyCases, dvHWS, dailyCases.length - 1, dsHolidays);
};

// xmlhttp.timeout = 200;
xmlhttp.open("GET", url, true);
xmlhttp.send();