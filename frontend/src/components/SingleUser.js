import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableRow, makeStyles } from "@material-ui/core";


export default function SingleUser({ data }) {
    console.log(data)
    return (
        <div >
            <Card elevation={1} sx={{ maxWidth: 345 }}>
                <CardHeader

                    title={data?.Details[0]?.UserName}
                    subheader={data.month}

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

                         <TableCell>{data.WorkingHours }</TableCell>
                         <TableCell>{Math.floor(data.TotalHours)}</TableCell>
                         <TableCell>1</TableCell>

                         <TableCell>{data?.Details[0]?.WorkingHours }</TableCell>
                         <TableCell>{data?.TotalHours?.toFixed(2)}</TableCell>
                         <TableCell>{data.Name}</TableCell>


                         </TableRow>
                  
            </TableBody>
            </Table>
                    </Grid>

                  
                    
                </CardContent>

            </Card>
        </div>
    )
}