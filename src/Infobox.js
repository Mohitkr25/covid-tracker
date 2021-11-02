import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./Infobox.css";

function Infobox({ title, cases, isRed, active, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "infobox-selected"} ${
        isRed && "infobox-red"
      }`}
    >
      <CardContent>
        <Typography className="infobox_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infobox_cases">{cases}</h2>

        <Typography className="infobox_total" color="textSecondary">
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
