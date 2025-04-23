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
  CancellationReason
} from '@scandit/web-id-bolt';
import { Button, Card, Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';

const ID_BOLT_URL = 'https://app.id-scanning.com';

const LICENSE_KEY =
  'AmwVWgZUIP8dMB2qSD7QVLkuOZoqF/reWyp7ND49rkUERqdcciNzWv5z+6eHQB4b0XXAGh4W19rAd0I0smNKs1Q47kKFecZCnn0694ZBDrKzbSYbRkZ4+ZlMDmOgddngwW73yj4knj24NxitxD5GkYouSnnUYLAWx1nzIc16F3hOQ6uXxTc9m4h++w1dVa9nb3nAqaM/57GMC8ShVBAS+4RVpL+YX2xsq3OXcflUxJ7MI/gPN1YU72tWVgsWRUfnmyaqY14VhjIjNbu+YUz9DvRydEJUf8h6pFrvsetusm4WBeVWjWTr8SVJWBnLXoTHCmOeMe1HGfriMGLTv1+wdKMc8IOKWjyluhNhOSdq1a8EZfRFMVQQh0M9g1FOUKekQ17HeDoyyO3ZVlFfH38FN/AtXFradxATP0xwWHIh5rn8eKIO8QKyJr1NRnfXbdzvJXVeZ1x8iZ1cZCdnZXMgIGloPwzNEr+rbkGjcBU0w/axSTUnQWDDzMhZB2edZXyD/Gxnx/N2FLNJekcDFHNskZtMAoe5WLWgjWT8LA9NvVxjYPk1XA+cZGhIgsrMpikwIRLepnfNzK/aSg7NuIKS40chTGp0F+0WLvPwyo0Q4M9VoY7uri1Nj6JghEfSxqbN24gRkbTU9j3JqKuL9ocWUzNz8DnfigKq1oCpc9Baxb9xJobGBHB3IHhyNCEFhbuGwUXXnYY/8LtZs5hhmAofrel2WrQziEIh9JFtOjl92YkWCV0IstemdguXhbQLqQdosJHL+bOLCrVTHuY47E9XCGSTCYuTJMJiMWp+ThP5pHMNlbt07NuAMVKKTvBgbIlXM1m3j8fAsqzEePbJEXCrDkr0m4iVHlzK1J/Qs5zVDVlp+H/uzfqnvP4C/BzwZSxROjjIizodvujDYhSJ+gQMFgXVQtHDBwnXTgMHPjPLvnt4p+oui2MouCx9MVmR5SVc2JMUny02kRREkBDzf6vhNIaIVt3OnPbdGoPfuFkremwi0gs7J1TuWK3RsIvL17efXFxKfHfy2vehmSmxCfcOQmCSkym47hPyll5KB2GCi6OzbpGfC+C0VmpEfkEdoSuzhVqoTc0Q2CELI4K2VT5nQji/6GzsCQCPbBjpCp59wN53osytXI2VwHVE+YgHFIZQlEHMG6utlFf0dT7v0c8qxK5itzjk7X5XrKUf/iq1uWL++80VSCpk7g1ZUldnshaLaNECO62xYnbSekSljN24nG8Y1FEGnhjTxw==';

const mapScanditDocumentType = {
  Passport: 'P',
  IdCard: 'I',
  DriverLicense: 'D'
};

const mapScanditGender = {
  male: 'M',
  female: 'F'
};

const documentSelection = DocumentSelection.create({
  accepted: [new Passport(Region.Any), new DriverLicense(Region.Any), new IdCard(Region.Any)]
});

const createIDBoltSession = (onCompletionCallback) => {
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
      'texts.HELP_SUPPORTED_DOCUMENTS_INCLUDE_LIST_BRIEF': 'Please scan the front side of your document'
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

const startIdBolt = async (setResult) => {
  IdBoltSession.terminate();
  const session = createIDBoltSession(setResult);
  await session.start();
};

const IDBoltScanner = () => {
  const [scanResult, setResult] = useState(null);
  const [open, setOpen] = useState(null);
  const onCompletionCallback = (result) => {
    setResult(result);
    if (result.capturedId.documentType === 'IdCard' && result.capturedId.nationality === 'SI' && result.capturedId.documentNumber === '') {
      console.log('Slovenian ID card detected');
      IdBoltSession.terminate();
      setOpen(true);
    }
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
