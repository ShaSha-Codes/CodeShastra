import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CoPresentIcon from '@mui/icons-material/CoPresent';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';



function Dashboard() {
  return (
    <Grid container spacing={2}>
        <Box m={5} sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
            <Box m={5}>
                
                    <Paper sx={{height:"200px",width:"300px"}} elevation={12}>
                        <Stack alignItems="center">
                            <AddLocationIcon sx={{marginTop:3,fontSize:100}}/>
                            <Typography variant="h6" component="h2">
                                    GeoLocator
                            </Typography>
                        </Stack>
                    </Paper>
                
            </Box>
            <Box m={5}>
                
                    <Paper sx={{height:"200px",width:"300px"}} elevation={12}>
                        <Stack alignItems="center">
                            <ManageAccountsIcon sx={{marginTop:3,fontSize:100}}/>
                            <Typography variant="h6" component="h2">
                                    Manage Accounts
                            </Typography>
                        </Stack>
                    </Paper>
                
            </Box>
            <Box m={5}>
                
                    <Paper sx={{height:"200px",width:"300px"}} elevation={12}>
                        <Stack alignItems="center">
                            <CoPresentIcon sx={{marginTop:3,fontSize:100}}/>
                            <Typography variant="h6" component="h2">
                                    Attendance
                            </Typography>
                        </Stack>
                    </Paper>
                
            </Box>
            <Box m={5}>
                
                    <Paper sx={{height:"200px",width:"300px"}} elevation={12}>
                        <Stack alignItems="center">
                            <HealthAndSafetyIcon sx={{marginTop:3,fontSize:100}}/>
                            <Typography variant="h6" component="h2">
                                    Safety
                            </Typography>
                        </Stack>
                    </Paper>
                
            </Box>
            
            
            </Grid>
        </Box>
    </Grid>
  )
}

export default Dashboard