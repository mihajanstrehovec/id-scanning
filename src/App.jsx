import { Stack, Typography } from '@mui/material';
import './App.css';
import logo from './assets/smart-checkin.svg';
import IDBoltScanner from './IDBoltScanner';

function App() {
  return (
    <div style={{ padding: '1rem' }}>
      
      <Typography fontSize={30} fontWeight={600} mb={4}>Document scanner</Typography>
      <IDBoltScanner />
      <Stack alignItems={'end'} justifyContent={'flex-end'} display={'flex'} direction={'row'} spacing={1}>
        <Typography fontSize={11} sx={{color: '#111927'}}>Powered by</Typography>
        <img src={logo} alt="Logo" style={{ width: '100px', marginTop: '2rem' }} />
      </Stack>
      
    </div>
  );
}

export default App;
