import { useState } from 'react';
import {
  DocumentSelection,
  IdBoltSession,
  Region,
  Passport,
  DriverLicense,
  IdCard,
  ReturnDataMode,
  Validators,
  CancellationReason,
  FullDocumentScanner
} from '@scandit/web-id-bolt';
import { Button, Card, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';


const ID_BOLT_URL = 'https://app.id-scanning.com';

const LICENSE_KEY = import.meta.env.VITE_ID_BOLT_SCANNER_KEY

const mapScanditDocumentType = {
  Passport: 'Potni list',
  IdCard: 'Osebna izkaznica',
  DriverLicense: 'Vozniško dovoljenje',
};

const mapScanditGender = {
  male: 'Moški',
  female: 'Ženska',
};

const documentSelection = DocumentSelection.create({
  accepted: [new Passport(Region.Any), new DriverLicense(Region.Any), new IdCard(Region.Any)]
});

const createIDBoltSession = (onCompletionCallback, text) => {
  const idBoltSession = IdBoltSession.create(ID_BOLT_URL, {
    licenseKey: LICENSE_KEY,
    documentSelection,
    sessionId: 'sessionId',
    returnDataMode: ReturnDataMode.Full,
    validation: [Validators.notExpired()],
    locale: 'en',
    textOverrides: {
      'titles.SCANNER_HEADER': "Scan ID card, passport, or driver's license.",
      'titles.LOCAL_SCAN_HEADER': "Scan ID card, passport, or driver's license.",
      'texts.HELP_SUPPORTED_DOCUMENTS_INCLUDE_LIST_BRIEF': "Scan ID card, passport, or driver's license.",
    },
    theme: {
      colors: {
        primary: '#34957B',
        image: '#34957B'
      },
      dimensions: {
        radiusButton: '8px'
      }
    },
    scanner: new FullDocumentScanner(),
    workflow: {
      showResultScreen: false,
      showWelcomeScreen: true
    },
    onCompletion: async (result) => {
      IdBoltSession.terminate();
      onCompletionCallback(result);
    },
    onCancellation: (reason) => {
      switch (reason) {
        case CancellationReason.UserClosed:
          console.log('User closed the scanning window');
          break;
        case CancellationReason.ServiceStartFailure:
          console.log('ID Bolt service failed to start');
          break;
      }
    }
  });
  return idBoltSession;
};

const startIdBolt = async (setResult, text) => {
  IdBoltSession.terminate();
  const session = createIDBoltSession(setResult, text);
  await session.start();
};

const IDBoltScanner = () => {
  const [scanResult, setResult] = useState(null);
  const [open, setOpen] = useState(null);
  const onCompletionCallback = (result) => {
    setResult(result);
    // if (result.capturedId.documentType === 'IdCard' && result.capturedId.nationality === 'SI' && result.capturedId.documentNumber === '') {
    //   console.log('Slovenian ID card detected');
    //   IdBoltSession.terminate();
    //   setOpen(true);
    //   // start another scan for the back side of the document
    //   // with timeout to allow the first scan to close
    //   setTimeout(() => {
    //     startIdBolt(onCompletionCallback, 'Please scan the back side of your document');
    //   }, 500);
    // }
  };

  return (
    <div>
      <button onClick={() => startIdBolt(onCompletionCallback)}>Scan ID</button>

      <Card sx={{ padding: 4, marginTop: 2 }} elevation={3}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <TextField value={scanResult?.capturedId.firstName} fullWidth placeholder="First name"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.capturedId.lastName} fullWidth placeholder="Last name"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField fullWidth placeholder="Main guest email"></TextField>
          </Grid>
          <Grid size={6}></Grid>
          <Grid size={6}>
            <TextField value={mapScanditGender[scanResult?.capturedId.sex]} placeholder="Gender"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField
              value={
                scanResult?.capturedId.dateOfBirth.day &&
                `${scanResult?.capturedId.dateOfBirth.day}. ${scanResult?.capturedId.dateOfBirth.month}. ${scanResult?.capturedId.dateOfBirth.year}`
              }
              fullWidth
              placeholder="Date of birth"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.capturedId.nationality} fullWidth placeholder="Nationality"></TextField>
          </Grid>
          <Grid size={6}></Grid>
          <Grid size={6}>
            <TextField
              value={mapScanditDocumentType[scanResult?.capturedId.documentType]}
              fullWidth
              placeholder="Document type"></TextField>
          </Grid>
          <Grid size={6}>
            <TextField value={scanResult?.capturedId.documentNumber} fullWidth placeholder="Document number"></TextField>
          </Grid>
        </Grid>
      </Card>
      <Dialog open={open}>
        <DialogTitle>Uspesno skeniranje</DialogTitle>
        <DialogContent>Da lahko preberemo stevilko vasega dokumenta prosim skenirajte se zadnjo stran</DialogContent>
        <Stack direction="row" spacing={2} sx={{ padding: 2 }} justifyContent={'flex-end'}>
          <Button
            onClick={() => {
              setOpen(false);
              startIdBolt(onCompletionCallback);
            }}
            variant="contained"
            sx={{ backgroundColor: '#34957B' }}>
            Skeniraj
          </Button>
        </Stack>
      </Dialog>
    </div>
  );
};

export default IDBoltScanner;
