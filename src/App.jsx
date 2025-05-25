import { Stack, Typography, Button } from '@mui/material';
import './App.css';
import logo from './assets/smart-checkin.svg';
import IDBoltScanner from './IDBoltScanner';
import DynamSoftScanner from './DynamSoftScanner';
import { useState } from 'react';


function App() {
  const [idBolt, setIdBolt] = useState(false); // Default to ID Bolt scanner
  return (
    <div style={{ padding: '1rem' }}>
      <Button variant='contained' onClick={() => setIdBolt((value) => !value)} sx={{backgroundColor: '#34957B', '&:focus': { outline: 'none'}, position:'absolute', left: 20, top: 20}}>Change scanner</Button>
      <Typography fontSize={36} fontWeight={600} mb={4}>Document scanner</Typography>
      { idBolt ? (
        <IDBoltScanner />
      ) : (
        <DynamSoftScanner />
      )}
      <Stack alignItems={'end'} justifyContent={'flex-end'} display={'flex'} direction={'row'} spacing={1}>
        <Typography fontSize={11} sx={{color: '#111927'}}>Powered by</Typography>
        <img src={logo} alt="Logo" style={{ width: '100px', marginTop: '2rem' }} />
      </Stack>
      
    </div>
  );
}

export default App;
