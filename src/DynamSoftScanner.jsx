import React, { useState } from 'react';
import { Button, Card, Grid, TextField, Stack } from '@mui/material';
import {MRZScanner} from 'dynamsoft-mrz-scanner';


const DynamSoftScanner = () => {
  const [scanResult, setScanResult] = useState(null);

  const startMRZScan = async () => {
    const mrzConfig = {
      license: import.meta.env.VITE_DYNAMSOFT_SCANNER_KEY,
      showResultView: false,
      scannerViewConfig: {
        showScanGuide: true,
        showFormatSelector: false,
        showSoundToggle: false,
      },
      resultViewConfig: {
        onDone: (mrzResult) => {
          setScanResult(mrzResult);
        }
      }
    };

    const scanner = new MRZScanner(mrzConfig);
    try {
      const result = await scanner.launch();
      setScanResult(result);
    } catch (error) {
      console.error('MRZ scan failed', error);
    } finally {
      scanner.dispose();
    }
  };


  return (
    <div>
      <Button
        variant="contained"
        onClick={startMRZScan}
        sx={{ backgroundColor: '#34957B', fontWeight: 600, '&:focus': { outline: 'none' } }}
      >
        Scan MRZ
      </Button>

      <Card sx={{ 
              padding: 4, 
              marginTop: 3, 
              boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.04), 0px 10px 10px 0px rgba(0, 0, 0, 0.06), 0px 0px 15px 0px rgba(0, 0, 0, 0.06)'
             }} >
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField value={scanResult?.data ? scanResult?.data.firstName : ''} fullWidth placeholder="First name"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.data ? scanResult?.data.lastName : ''} fullWidth placeholder="Last name"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField fullWidth placeholder="Main guest email"></TextField>
          </Grid>
          <Grid size={6}></Grid>
          <Grid size={6}>
            <TextField value={scanResult?.data ? scanResult?.data.sex : ''} placeholder="Gender"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              value={
                scanResult?.data && scanResult?.data.dateOfBirth.day &&
                `${scanResult?.data.dateOfBirth.day}. ${scanResult?.data.dateOfBirth.month}. ${scanResult?.data.dateOfBirth.year}`
              }
              fullWidth
              placeholder="Date of birth"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.data ? scanResult?.data.nationalityRaw : ''} fullWidth placeholder="Nationality"></TextField>
          </Grid>
          <Grid size={6}></Grid>
          <Grid size={6}>
            <TextField
              value={scanResult?.data ? scanResult?.data.documentType : ''}
              fullWidth
              placeholder="Document type"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.data ? scanResult?.data.documentNumber : ''} fullWidth placeholder="Document number"></TextField>
          </Grid>
        </Grid>
      </Card>

    </div>
  );
};

export default DynamSoftScanner;