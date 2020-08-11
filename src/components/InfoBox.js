import React from 'react'
import {Card,CardContent,Typography} from '@material-ui/core'
import './InfoBox.css'
function InfoBox({title,cases,total,isRed,isBlue,active,...props}) {
    return (
<Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red" 
      } ${isBlue&& "infoBox--blue"}`}>
    <CardContent>
        
    <Typography color="textSecondary">{title}</Typography>
        
    <h2 className={`infoBox_cases ${!isRed && !isBlue && "infoBox_cases--green"} ${isBlue && "infoBox_cases--blue"}`}>{cases}</h2>
    
    <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>

    </CardContent>            
</Card>
    )
}

export default InfoBox
