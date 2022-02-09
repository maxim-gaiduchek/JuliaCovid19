// Create the chart

function buildChartMap() {
    fc = Highcharts.ajax({
        url: '/data/WHO-COVID-19-global-table-data.csv',
        dataType: 'csv',
        success: function (csv) {

            // Parse the CSV Data
            /*Highcharts.data({
                csv: data,
                switchRowsAndColumns: true,
                parsed: function () {
                    console.log(this.columns);
                }
            });*/

            // Very simple and case-specific CSV string splitting
            function CSVtoArray(text) {
                return text.replace(/^"/, '')
                    .replace(/",$/, '')
                    .split(',');
            }

            csv = csv.split(/\n/);

            let countries = {},
                mapChart,
                countryChart,
                numRegex = /^[0-9\.]+$/,
                lastCommaRegex = /,\s$/,
                quoteRegex = /\"/g,
                categories = CSVtoArray(csv[2]).slice(4);

            // Parse the CSV into arrays, one array each country
            csv.forEach(function (line) {
                let row = CSVtoArray(line);

                countries[row[0]] = {
                    name: row[0],
                    code3: row[1],
                    data: parseInt(row[5])
                };
            });

            // For each country, use the latest value for current population
            let data = [];
            for (let code3 in countries) {
                if (Object.hasOwnProperty.call(countries, code3)) {
                    let value = null,
                        year,
                        itemData = countries[code3].data,
                        i = itemData.length;

                    while (i--) {
                        if (typeof itemData[i] === 'number') {
                            value = itemData[i];
                            year = categories[i];
                            break;
                        }
                    }
                    data.push({
                        name: countries[code3].name,
                        code3: code3,
                        value: value,
                        year: year
                    });
                }
            }

            console.log(countries);
            console.log(data);

            // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
            let mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
            mapData.forEach(function (country) {
                country.id = country.properties['hc-key']; // for Chart.get()
                country.flag = country.id.replace('UK', 'GB').toLowerCase();
            });

            // Wrap point.select to get to the total selected points
            Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

                proceed.apply(this, Array.prototype.slice.call(arguments, 1));

                let points = mapChart.getSelectedPoints();
                if (points.length) {

                    //          if (points.length === 1) {
                    //                   document.querySelector('#info #flag')
                    //                       .className = 'flag ' + points[0].flag;
                    //                   document.querySelector('#info h2').innerHTML = points[0].name;
                    //               } else {
                    //                   document.querySelector('#info #flag')
                    //                       .className = 'flag';
                    //                   document.querySelector('#info h2').innerHTML = 'Comparing countries';
//
//                }

                    document.querySelector('#info .subheader')
                        .innerHTML = '<h4>Historical population</h4><small><em>Shift + Click on map to compare countries</em></small>';

                    if (!countryChart) {
                        countryChart = Highcharts.chart('country-chart', {
                            chart: {
                                height: 250,
                                spacingLeft: 0
                            },
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: null
                            },
                            subtitle: {
                                text: null
                            },
                            xAxis: {
                                tickPixelInterval: 50,
                                crosshair: true
                            },
                            yAxis: {
                                title: null,
                                opposite: true
                            },
                            tooltip: {
                                split: true
                            },
                            plotOptions: {
                                series: {
                                    animation: {
                                        duration: 500
                                    },
                                    marker: {
                                        enabled: false
                                    },
                                    threshold: 0,
                                    pointStart: parseInt(categories[0], 10)
                                }
                            }
                        });
                    }

                    countryChart.series.slice(0).forEach(function (s) {
                        s.remove(false);
                    });
                    points.forEach(function (p) {
                        countryChart.addSeries({
                            name: p.name,
                            data: countries[p.code3].data,
                            type: points.length > 1 ? 'line' : 'area'
                        }, false);
                    });
                    countryChart.redraw();

                } else {
                    document.querySelector('#info #flag').className = '';
                    document.querySelector('#info h2').innerHTML = '';
                    document.querySelector('#info .subheader').innerHTML = '';
                    if (countryChart) {
                        countryChart = countryChart.destroy();
                    }
                }
            });

            // Initiate the map chart
            mapChart = Highcharts.mapChart('container_map', {

                title: {
                    text: 'COVID-19 trends by country'
                },
                subtitle: {
                    text: 'Click by highlight country for detail forecast'
                },

                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },

                colorAxis: {
                    type: 'logarithmic',
                    endOnTick: false,
                    startOnTick: false,
                    min: 50000,
                    minColor: '#10FF00',
                    maxColor: '#FF0000'
                },

                tooltip: {
                    footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
                },

                series: [{
                    data: data,
                    mapData: mapData,
                    joinBy: ['iso-a3', 'code3'],
                    name: 'Current population',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    states: {
                        select: {
                            color: '#a4edba',
                            borderColor: 'black',
                            dashStyle: 'shortdot'
                        }
                    },
                    borderWidth: 0.5
                }]
            });

            // Pre-select a country
            mapChart.get('us').select();
        }
    });








    /*fc = Highcharts.mapChart('container_map', {
        chart: {
            map: 'custom/world-palestine-lowres',
            borderWidth: 0
        },
        title: {
            text: 'Covid trends by country'
        },
        subtitle: {
            text: 'Click by highlight country for detail forecast'
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
            min: 0,
            minColor: '#10FF00',
            maxColor: '#FF0000'
        },

        plotOptions: {
            series: {
                events: {
                    click: function(e) {
                        console.log(e.point.options["hc-key"]);

                        dailyCases = getDailyCases(e.point.options["hc-key"]);

                        mm = buildChart2(parseInt(document.getElementById('calcRange').value), parseInt(document.getElementById('pred').value));
                        showDataTable(buildTimeDataSet(dailyCases, startDate, parseInt(document.getElementById('pred').value)), dailyCases, dvHWS, dailyCases.length - 1, dsHolidays);
                    }
                }
            }
        },

        series: [{
            name: 'Country',
            data: getWorldNewCasesIn7Days(),
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
    });*/

    return fc;
}

let dstime = [];
startDate = "2020-01-22";
let dailyCases = [null, 271, 475, 701, 787, 1784, 1479, 1764, 2016, 2137, 2626, 2857, 3253, 3927, 3728, 3184, 3453, 2685, 3004, 2569, 2057, 14180, 5174, 2682, 2132, 2158, 2031, 1880, 534, 1034, 1058, 1038, 628, 993, 861, 1136, 1459, 1819, 2206, 2635, 2615, 3306, 3167, 4322, 5053, 5745, 5853, 7216, 8776, 11285, 14141, 16687, 17391, 18862, 20782, 23939, 28099, 32161, 38421, 34031, 37150, 43892, 46174, 49932, 62555, 67243, 67709, 61260, 64387, 76180, 78224, 79313, 86641, 82080, 74477, 76092, 83309, 89049, 89840, 98008, 85714, 76612, 76511, 80168, 87571, 87696, 90760, 85286, 79116, 83141, 82166, 84569, 89030, 97149, 91630, 75745, 71541, 79181, 88998, 89033, 95559, 82928, 82694, 81352, 84330, 97231, 97027, 97216, 88958, 80616, 73819, 89469, 92673, 98431, 102809, 97557, 84466, 92290, 99408, 106045, 109371, 110219, 103185, 98721, 92285, 95577, 110085, 120481, 129538, 127154, 111597, 103737, 120629, 124017, 134212, 133901, 131371, 117341, 110345, 125012, 140169, 141989, 145260, 137930, 126861, 128876, 148970, 151355, 146160, 186564, 162433, 134761, 143643, 169276, 180170, 186478, 199540, 184257, 168480, 163585, 183505, 204079, 216234, 219268, 200686, 180668, 176917, 216276, 221028, 231042, 242956, 222730, 202095, 197070, 228346, 241936, 254241, 245914, 232435, 223426, 205941, 246757, 286376, 280728, 294133, 267966, 224446, 219052, 256206, 296486, 291451, 295677, 264415, 224736, 202898, 260887, 278427, 287852, 287701, 276463, 226993, 220595, 274671, 294888, 291445, 294546, 270662, 221515, 205281, 265500, 280842, 277035, 269277, 272501, 217413, 219802, 262921, 282778, 282295, 294808, 269488, 230516, 250894, 268554, 293552, 294261, 312296, 281896, 243975, 206618, 252902, 295347, 307417, 324333, 295943, 257207, 251301, 289820, 312780, 318838, 328924, 304337, 259536, 239450, 287982, 318267, 320222, 329853, 306477, 262552, 239325, 295721, 322789, 327064, 333136, 304694, 260765, 273122, 317665, 353336, 362005, 365507, 378538, 295199, 275908, 325726, 388136, 405034, 420189, 402876, 349435, 338538, 397046, 448138, 486513, 496301, 485310, 435169, 401818, 473554, 519880, 550484, 575780, 512590, 473944, 454634, 505426, 576205, 626072, 629381, 640411, 507796, 473048, 572561, 628249, 653868, 663628, 613193, 522000, 492953, 578639, 622647, 666197, 669986, 617735, 527848, 529180, 575358, 644842, 623821, 610710, 602211, 529565, 490891, 593377, 648026, 693648, 696515, 653259, 553212, 520215, 613892, 662787, 702987, 714090, 665157, 554454, 527819, 610594, 728325, 738164, 721314, 646848, 566490, 536124, 625339, 698272, 697138, 542998, 472808, 449926, 497332, 644488, 739265, 762969, 646538, 570617, 545086, 559302, 721682, 808846, 843875, 845040, 771688, 645106, 590228, 688017, 745904, 752960, 763601, 679209, 561032, 477350, 596614, 664034, 652798, 641261, 603426, 484473, 438903, 535007, 589891, 600675, 584016, 531632, 418187, 391737, 456713, 486600, 507975, 497152, 442427, 363441, 321073, 389989, 442180, 444593, 428500, 387828, 305049, 263014, 346860, 397405, 402514, 412597, 388200, 318432, 286151, 379246, 444446, 449124, 436923, 398209, 322129, 295215, 372454, 446285, 450744, 454255, 414754, 379797, 292922, 394714, 469012, 482468, 494543, 454235, 378114, 337116, 456381, 535141, 552550, 558555, 519389, 437728, 424221, 506113, 591138, 634965, 634442, 595770, 503602, 457322, 549697, 646834, 706975, 652668, 568601, 552874, 481343, 632756, 690131, 746860, 792146, 723612, 654495, 584795, 743849, 813207, 843459, 837550, 806164, 731102, 657169, 830808, 887898, 889779, 901918, 846524, 746730, 672375, 837664, 892635, 904166, 876736, 818284, 697764, 670503, 785728, 850142, 860360, 841794, 798200, 667099, 608638, 717598, 756574, 748046, 700947, 648801, 550299, 535965, 618118, 664713, 657155, 625443, 584718, 491140, 445506, 525473, 563016, 538450, 510638, 502628, 415417, 367755, 450898, 492738, 477179, 421838, 411537, 339960, 315192, 365059, 424062, 438669, 416579, 382562, 310575, 303520, 373761, 402065, 391028, 405678, 368850, 305188, 281446, 378386, 434880, 406699, 413569, 382070, 323319, 319100, 384415, 398777, 434330, 441122, 400798, 353961, 348365, 436102, 464814, 489280, 497208, 449541, 401938, 402513, 515441, 558595, 567717, 567889, 526696, 495073, 435693, 521771, 566891, 573394, 584780, 546622, 495958, 466459, 607165, 667925, 676241, 655331, 597459, 548610, 502890, 627413, 694747, 716810, 708973, 642973, 571240, 525302, 661384, 708537, 724165, 735805, 649405, 565925, 533282, 675535, 710178, 747102, 724948, 640196, 565870, 527851, 681541, 738983, 738057, 728758, 643308, 562881, 537394, 641057, 688290, 696191, 681029, 586376, 541769, 500136, 542613, 614991, 630510, 610905, 554832, 488959, 449973, 526804, 577654, 587570, 577534, 496230, 428874, 413028, 486911, 534884, 526126, 514168, 443774, 398940, 383555, 439925, 493687, 502382, 482118, 411286, 358491, 348224, 424038, 459569, 471495, 454447, 397484, 353567, 333116, 403325, 447527, 454538, 441966, 392724, 347758, 353199, 423551, 459293, 472499, 463274, 419240, 362464, 341347, 441086, 482023, 490344, 475981, 430215, 372072, 363469, 408009, 489410, 527312, 513060, 463909, 392995, 389415, 481468, 553797, 564182, 540079, 490503, 416538, 431253, 518600, 601187, 624666, 604596, 556707, 461737, 472376, 589524, 642275, 637249, 620016, 543501, 464020, 480304, 615852, 687995, 718802, 715291, 617864, 510553, 492854, 634239, 693348, 690521, 684959, 602142, 523295, 483479, 644947, 731359, 746657, 749242, 677457, 585676, 578486, 778413, 923612, 1020619, 1012228, 917256, 690413, 824362, 1313351, 1658743, 1946120, 1947753, 1842937, 1295776, 1477787, 2231118, 2631781, 2746273, 2815212, 2731780, 2490445, 2253803, 2951884, 3301136, 3365590, 3354940, 2976678, 2664526, 2435171, 3267703, 3662871, 3778819, 3774008, 3443341, 2846394, 2495431, 3540324, 3668401, 3693304, 3508466, 2919499];

let holidaysList = [];

let dvHWS = [];
let dsHolidays = [];
let dsHolidaysWeeks = [];

let countryName = 'WORLDWIDE';
//<br> Update: ' +   new Date(document.lastModified);

mm = buildChartMap();
mm = buildChart2(parseInt(document.getElementById('calcRange').value), parseInt(document.getElementById('pred').value));
showDataTable(buildTimeDataSet(dailyCases, startDate, parseInt(document.getElementById('pred').value)), dailyCases, dvHWS, dailyCases.length - 1, dsHolidays);