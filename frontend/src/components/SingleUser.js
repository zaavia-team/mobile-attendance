import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from "@material-ui/core";


export default function SingleUser({ data }) {
   const month = ["january", "February", "March", "April","May", "June", "July", "August", "September", "October", "Novemper", "December"]
    return (
        <div >
            <Card elevation={1} sx={{ maxWidth: 345 }}>
                <CardHeader

                    title={data?.Details[0]?.UserName}
                    subheader= {`Month : ${month[data?.Details[0]?.Date?.Month]}`}

                />
                <CardContent>
                    <Grid container  justifyContent="center" alignItems="center">
                    <Table >
              <TableHead>
                  <TableRow >
                      <TableCell>Total Hours</TableCell>
                      <TableCell>Total Hours (working)</TableCell>
                      <TableCell>Leaves</TableCell>

                     
                  </TableRow>
              </TableHead>
              <TableBody>
              
                        
                        <TableRow >

                         {/* <TableCell>{data.WorkingHours }</TableCell>
                         <TableCell>{Math.floor(data.TotalHours)}</TableCell>
                         <TableCell>1</TableCell> */}

                         <TableCell>{data?.WorkingHours }</TableCell>
                         <TableCell >{data?.TotalHours?.toFixed(2)}</TableCell>
                         <TableCell>0</TableCell>


                         </TableRow>
                  
            </TableBody>
            </Table>
                    </Grid>

                  
                    
                </CardContent>

            </Card>
        </div>
    )
}