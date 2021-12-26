import React, { useEffect, useState } from "react";
import "./Vaccination.css";
import { makeStyles } from "@material-ui/core/styles";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CircularIndeterminate from "./CircularIndeterminate";

// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from "@material-ui/pickers";
// import "date-fns";
// import Grid from "@material-ui/core/Grid";
// import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0.7),
      flex: "1",
      width: "100%",
      fontFamily: "Varela",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
}));

function Vaccination() {
  const [input, setInput] = useState();
  const [pincode, setPincode] = useState();
  const [slots, setSlots] = useState();
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const classes = useStyles();
  const today = new Date();
  const date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setPincode(input);
  };

  const fetchSlots = async () => {
    const response = await fetch(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
    )
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.sessions);
        if (slots.length === 0) {
          setIsValid(false);
        }
        console.log(slots);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    fetchSlots();
  }, [pincode]);

  return (
    <div className="Vaccination">
      <h1>Find out vaccination slot nearby</h1>
      <form
        id="form__input"
        onSubmit={handleSubmit}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <div className="formin">
          <input
            className="text__box"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter the Pincode here"
            value={input}
          />
          <SearchOutlinedIcon
            onClick={handleSubmit}
            className="search__btn"
            type="submit"
          />
        </div>
      </form>
      {slots ? (
        slots.map((res) => (
          <div id="accord" className={classes.root}>
            <Accordion id="accordian">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{res.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <h4>{res.address} </h4>
                  <p>{res.vaccine} </p>
                  <ul>
                    {res.slots.map((data) => (
                      <li>{data}</li>
                    ))}
                  </ul>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </div>
        ))
      ) : loading ? (
        <div className="loading">
          <CircularIndeterminate />
        </div>
      ) : null}
      {/* {!isValid && <h1>Please enter a valid pincode</h1>} */}
    </div>
  );
}

export default Vaccination;
