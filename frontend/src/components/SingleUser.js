import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader, Grid } from '@mui/material';

export default function SingleUser({ data }) {
    console.log(data)
    return (
        <div >

            <Card elevation={1} sx={{ maxWidth: 345 }}>
                <CardHeader
                    title={data.Name}
                    subheader={data.month}
                />
                <CardContent>
                    <Grid container  justifyContent="center" alignItems="center">
                        <Grid item>
                    <Typography>
                        {data.Name}
                    </Typography>
                    </Grid>
                    <Typography>
                        "Areeb"
                    </Typography>

                    <Typography variant="body2" color="textSecondary">
                        "Areeb"
                    </Typography>
                    </Grid>

                </CardContent>

            </Card>
        </div>
    )
}