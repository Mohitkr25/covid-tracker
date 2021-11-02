import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Infobox from "./Infobox";

import Table from "./Table";
import { prettyPrintStat, SortData } from "./util";
import LineGraph from "./LineGraph";
import MyMap from "./MyMap";
import "leaflet/dist/leaflet.css";
import "./covid.css";
function Covid() {
  const [countries, Setcountry] = useState([]);
  const [countrycount, Setcountrycount] = useState(["Worldwide"]);
  const [countryInfo, setContryInfo] = useState({});
  const [tableData, SetTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setContryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortesdata = SortData(data);
          SetTableData(sortesdata);
          Setcountry(countries);
          setmapCountries(data);
        });
    };
    getCountryData();
  }, []);

  const onCountrychange = async (event) => {
    const countryCode = event.target.value;

    // console.log(countryCode);
    Setcountrycount(countryCode);

    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        Setcountrycount(countryCode);
        setContryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  console.log("country info >>> ", countryInfo);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1> covid-19 tracker 🔥</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={countrycount}
              onChange={onCountrychange}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            title="CoronaVirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setcasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setcasesType("deaths")}
            title="Death"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <MyMap
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by Country</h3>

          <Table countries={tableData} />
          {/* table
    graph */}
          <h3>Worldwide Live new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Covid;
