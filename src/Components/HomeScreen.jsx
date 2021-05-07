import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./HomeScreen.css";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { sortData, prettyPrintStat } from "../utils";
import LineGraph from "./Linegraph";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

function HomeScreen() {
  const [stateData, setStateData] = useState([]);
  const [states, setStates] = useState("Total");
  const [stateInfo, setStateInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapStates, setMapStates] = useState([]);
  const [timeSeries, setTimeSerise] = useState();

  useEffect(() => {
    fetch("https://api.covid19india.org/data.json")
      .then((response) => response.json())
      .then((data) => {
        setStateInfo(data.statewise[0]);
      });
  }, []);

  const handleStateChange = async (event) => {
    const stateCode = event.target.value;

    await fetch("https://api.covid19india.org/data.json")
      .then((response) => response.json())
      .then((data) => {
        setStates(stateCode);
        const states = data.statewise;
        states.map((state) => {
          if (state.statecode === stateCode) {
            console.log(state);
            setStateInfo(state);
          }
          return null;
        });
      });
  };

  useEffect(() => {
    const getStateData = async () => {
      fetch("https://api.covid19india.org/data.json")
        .then((response) => response.json())
        .then((data) => {
          const states = data.statewise.map((state) => ({
            name: state.state,
            value: state.statecode,
          }));
          setTimeSerise(data.cases_time_series);
          const sortedData = sortData(data.statewise);
          setTableData(sortedData);
          setMapStates(data.statewise);
          setStateData(states);
        });
    };
    getStateData();
  }, [states]);

  return (
    <div className="homeScreen">
      <div className="home__left">
        <div className="home__header">
          <h1>COVID-19 Tracker India </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={states}
              onChange={handleStateChange}
            >
              <MenuItem value="Total">Total</MenuItem>
              {stateData.map((state) => (
                <MenuItem value={state.value}>{state.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <p>Last Updated ({stateInfo.lastupdatedtime})</p>
        <div className="app__stats">
          <InfoBox
            className="covid__new"
            title="New Cases"
            cases={prettyPrintStat(stateInfo.deltaconfirmed)}
            total={prettyPrintStat(stateInfo.confirmed)}
          />
          <InfoBox
            className="covid__recovered"
            title="Recovered"
            cases={prettyPrintStat(stateInfo.deltarecovered)}
            total={prettyPrintStat(stateInfo.recovered)}
          />
          <InfoBox
            className="covid__death"
            title="Decreased"
            cases={prettyPrintStat(stateInfo.deltadeaths)}
            total={prettyPrintStat(stateInfo.deaths)}
          />
        </div>
        <Map states={mapStates} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by States</h3>
          <Table states={tableData} />
          <h3 className="worldwide__header">Worldwide covid cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeScreen;
