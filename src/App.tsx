import { Avatar, Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';

const App: React.FC = () => {

  const [currentInputCoin, setCurrentInputCoin] = useState('');
  const [currencies, setCurrencies] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const open = Boolean(anchorEl);

  const [selectedOutputCurrency, setSelectedOutputCurrency] = useState<any>(null);
  const [anchorElOut, setAnchorElOut] = useState<null | HTMLElement>(null);
  const openOut = Boolean(anchorElOut);

  useEffect(() => {
    fetch('https://xmr-gate.onrender.com/api/v1/currencies')
      .then(res => res.json())
      .then(data => {
        setCurrencies(data.data);
        // По умолчанию выбираем BTC, если есть
        const btc = data.data.find((c: any) => c.code === 'BTC');
        if (btc) setSelectedCurrency(btc);
        else if (data.data.length > 0) setSelectedCurrency(data.data[0]);
        // Для OutputCoinForm тоже
        if (btc) setSelectedOutputCurrency(btc);
        else if (data.data.length > 0) setSelectedOutputCurrency(data.data[0]);
      });
  }, []);

  const handleCoinPickerClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (currency: any) => {
    setAnchorEl(null);
    if (currency) setSelectedCurrency(currency);
  };

  const handleOutputCoinPickerClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOut(event.currentTarget);
  };

  const handleMenuCloseOut = (currency: any) => {
    setAnchorElOut(null);
    if (currency) setSelectedOutputCurrency(currency);
  };

  return (
    <Box
      id='backgorund'
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #ff69b4 0%, #8e44ad 50%, #2ecc40 100%, #8e44ad 100%)',
        overflow: 'auto',
      }}
    >
      <Box
        id='mainBox'
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: { xs: '390px', sm: '368px' },
          margin: '0 auto',
          padding: { xs: '0 8px', sm: 0 },
        }}
      >
        <Box id= 'StatusForm' sx={{ position: 'relative'}}>
          <img id='ImgStatusForm' src="StatusForm.svg" alt="statusForm" style={{ width: '100%', height: '100%' }} />
          <Box id='StatusMonitor' sx={{ alignItems: 'center', display: 'flex',  position: 'absolute', top: '44%', left: '50%', transform: 'translate(-50%, -50%)', justifyContent: 'space-around', width: '90%' }}>
            <CircularProgress sx={{ color: '#fff', size: 70 }} style={{ width: 70, height: 70,  }} variant='indeterminate'></CircularProgress>
            <Box id='StatusTexts' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, maxHeight: '100%' }}>
              <Typography variant="h5" align='center' maxWidth={'220px'}>Waiting for approval</Typography>
              <Typography variant="body1" align='center' maxWidth={'220px'}>Please wait while we process your request</Typography>
            </Box>
          </Box>
        </Box>

        <Box id='inputCoinForm' sx={{ maxHeight: '180px', transform: 'translate(0,-20px)' }} >
          <img id= 'ImgInputCoinForm' src="InputCoinForm.svg" alt="inputCoinForm" />
          <Box id='ChoosingInputCoin' sx={{ alignItems: 'center', display: 'flex',  position: 'relative', transform: 'translate(0%, -128px)', justifyContent: 'space-between', marginLeft: '10px', marginRight: '15px' }}>
            <Box id='CoinPicker' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }} onClick={handleCoinPickerClick} style={{ cursor: 'pointer' }}>
              <Avatar sx={{ width: 54, height: 54 }} src={selectedCurrency ? selectedCurrency.logo : undefined} />
              <Box id='coinText' sx={{ display: 'flex', maxWidth: '100px', alignContent: 'start', flexDirection: 'column' }} >
                <Typography variant='h6' >{selectedCurrency ? selectedCurrency.code : 'CoinCode'}</Typography>
                <Typography variant='body2' >{selectedCurrency ? selectedCurrency.name : 'Coin desc'}</Typography>
              </Box>
            </Box>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose(null)}>
              {currencies.map((currency: any) => (
                <MenuItem key={currency.code} onClick={() => handleMenuClose(currency)}>
                  <img src={currency.logo} alt={currency.code} width={64} height={64} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {currency.name}
                </MenuItem>
              ))}
            </Menu>
            <Box id="YouPayTextField" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
              <TextField 
                id="YouPayAmount"  
                sx={{ maxWidth: '170px', 
                  '& .MuiOutlinedInput-root': {borderRadius: '32px'},
                  '& .MuiInputBase-input': {textAlign: 'right'}, 
                  '& .MuiInputLabel-outlined': {transform: 'translate(113px, -9px) scale(0.75)' }, 
                  '& .MuiOutlinedInput-notchedOutline': {textAlign: 'right'}
                }}
                label="Amount" 
                size='small' 
                focused
                slotProps={{ input: { inputMode: 'numeric', inputProps: { pattern: '[0-9]*' } } }}
              >
              </TextField>
              <Typography id="oppCodeAmount" variant='body2' >oppCode: </Typography>
            </Box>
          </Box>
        </Box>

        <Box id='MainButton' sx={{ position: 'relative', display: 'flex',  flexDirection: 'column', alignItems: 'center', transform: 'translate(0, -64px)' }}>
          <img id="mb" src="mainButton.svg" alt="MainButton" />
        </Box>

        <Box id='OutputCoinForm' sx={{ transform: 'translate(0, -108px)' }}>
          <img id='ImgOutputCoinForm' src="OutputCoinForm.svg" alt="outputCoinForm" />
          <Box id='ChoosingOutputCoin' sx={{ alignItems: 'center', display: 'flex',  position: 'relative', transform: 'translate(0%, -124px)', justifyContent: 'space-between', marginLeft: '10px', marginRight: '15px' }}>
            <Box id='CoinPickerOut' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }} onClick={handleOutputCoinPickerClick} style={{ cursor: 'pointer' }}>
              <Avatar sx={{ width: 54, height: 54 }} src={selectedOutputCurrency ? selectedOutputCurrency.logo : undefined} />
              <Box id='coinTextOut' sx={{ display: 'flex', maxWidth: '100px', alignContent: 'start', flexDirection: 'column' }} >
                <Typography variant='h6' >{selectedOutputCurrency ? selectedOutputCurrency.code : 'oppCode'}</Typography>
                <Typography variant='body2' >{selectedOutputCurrency ? selectedOutputCurrency.name : 'Coin desc'}</Typography>
              </Box>
            </Box>
            <Menu anchorEl={anchorElOut} open={openOut} onClose={() => handleMenuCloseOut(null)}>
              {currencies.map((currency: any) => (
                <MenuItem key={currency.code} onClick={() => handleMenuCloseOut(currency)}>
                  <img src={currency.logo} alt={currency.code} width={64} height={64} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {currency.name}
                </MenuItem>
              ))}
            </Menu>
            <Box id="YouGetTextField" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
              <Typography id="CoinCodeOut" variant='body2' >CoinCode: </Typography>
              <TextField 
                id="YouGetAmount"  
                sx={{
                  maxWidth: '170px',
                  transform: 'rotateZ(180deg) rotateY(180deg)', 
                  '& .MuiInputBase-input': {
                    transform: 'rotateZ(180deg) rotateY(180deg)', 
                    textAlign: 'right',
                  },
                  '& .MuiOutlinedInput-root': { borderRadius: '32px' },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(113px, 10px) scale(0.75) rotateY(180deg) rotateZ(180deg)'
                  },
                  '& .MuiOutlinedInput-notchedOutline': { textAlign: 'right' },
                  '& > legend': {
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    transform: 'translateY(-50%)'
                  }
                }} 
                label="Amount" 
                size='small' 
                focused
                slotProps={{ input: { inputMode: 'numeric', inputProps: { pattern: '[0-9]*' } } }}
              >
              </TextField>
            </Box>
          </Box>
        </Box>

        <Box id='zazor14px' sx={{ transform: 'translate(0, -188px)', display: 'flex', flexDirection: 'column' }}>
            <img id='ImgFinalStageForm' src="FinalStageForm.svg" alt="finalStageForm"  width='368px' />
            
            <Box id='FinalForm' sx={{ position: 'absolute', transform: 'translate(28px, 20px)', width: '312px' }} >
              <Box id='FinalButtonsAndText' display='flex' flexDirection='column' gap='8px' >
                <Box >
                  <img id='BookButtonImg' src='bookButton.svg' alt='boobButoon' width='100%'></img>
                </Box>
                <TextField
                  id="RecieveAddress"  
                  sx={{
                    transform: 'rotateZ(180deg) rotateY(180deg)', 
                    '& .MuiInputBase-input': {
                      transform: 'rotateZ(180deg) rotateY(180deg)', 
                      textAlign: 'left',
                    },
                    '& .MuiOutlinedInput-root': { borderRadius: '32px' },
                    '& .MuiInputLabel-root': {
                      transform: 'translate(132px, 10px) scale(0.75) rotateY(180deg) rotateZ(180deg)'
                    },
                    '& .MuiOutlinedInput-notchedOutline': { textAlign: 'center' },
                    '& > legend': {
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      transform: 'translateY(-50%)'
                    },
                    mb: 2
                  }} 
                  label="Address" 
                  size='small' 
                  focused>
                </TextField>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{ width: '100%' }}
                >
                  EXCHANGE
                </Button>
              </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

function setCurrentInputCoin() {
  console.log(`Работает`)
}

export default App; 

