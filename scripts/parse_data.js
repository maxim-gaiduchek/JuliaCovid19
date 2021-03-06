function getDailyCases(countryCode) {
    countryCode = countryCode.toUpperCase();

    let path = (window.location.host.indexOf(".github.io") > -1 ? ("/" + window.location.pathname.split("/")[1]) : "") +
        "/data/WHO-COVID-19-global-data.csv";
    let dailyCases = [];
    let xhr = new XMLHttpRequest();

    xhr.open("GET", path, false);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let rows = xhr.responseText.split(/\r?\n|\r/);

            for (let i = 1; i < rows.length; i++) {
                let data = rows[i].split(",");

                if (data[1] === countryCode) {
                    dailyCases.push(Number.parseInt(data[4]));
                }
            }
        }
    }

    xhr.send();

    return dailyCases;
}

function getWorldNewCasesIn7Days() {
    let path = (window.location.host.indexOf(".github.io") > -1 ? ("/" + window.location.pathname.split("/")[1]) : "") +
        "/data/WHO-COVID-19-global-table-data.csv";
    let newCases = [];
    let xhr = new XMLHttpRequest();

    xhr.open("GET", path, false);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let rows = xhr.responseText.split(/\r?\n|\r/);

            for (let i = 2; i < rows.length; i++) {
                let data = rows[i].split(",");

                if (convertCountryToCode(data[0]) !== "") {
                    newCases.push([convertCountryToCode(data[0]), Number.parseInt(data[5])]);
                }
            }
        }
    }

    xhr.send();

    return newCases;
}