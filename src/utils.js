import React from "react";
import numeral from "numeral";
import { Cricle, Popup } from 'react-leaflet';


export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
}

export const prettyPrintStat = (state) =>
    state ? `+${numeral(state).format("0.0a")}` : "+0";

// export const showDataOnMap = (data, casesType = 'active') => (
//     data.map(state => (
//         <Circle
//             center={ }
//         >

//         </Circle>
//     ))
// )
