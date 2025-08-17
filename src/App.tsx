import { Avatar, Button, Dialog, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import bcrypt from 'bcryptjs'

const App: React.FC = () => {

  const [openAccount, setOpenAccount] = useState(false);
  const [loged, setLoged] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [currentInputCoin, setCurrentInputCoin] = useState("0.001");
  const [currentOutputCoin, setCurrentOutputCoin] = useState("0.001");
  const [currencies, setCurrencies] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const open = Boolean(anchorEl);

  const [selectedOutputCurrency, setSelectedOutputCurrency] = useState<any>(null);
  const [anchorElOut, setAnchorElOut] = useState<null | HTMLElement>(null);
  const openOut = Boolean(anchorElOut);

  const salt = "4MMC"

  let jwt_token: string | null = null;
  let logged = false;

  useEffect(() => {
    fetch('https://xmr-gate.onrender.com/api/v1/currencies')
      .then(res => res.json())
      .then(data => {
        setCurrencies(data.data);

        const btc = data.data.find((c: any) => c.code === 'BTC');
        const xmr = data.data.find((c: any) => c.code === 'XMR');
        if (btc) setSelectedCurrency(btc);
        else if (data.data.length > 0) setSelectedCurrency(data.data[0]);
        // Для OutputCoinForm тоже
        if (xmr) setSelectedOutputCurrency(xmr);
        else if (data.data.length > 0) setSelectedOutputCurrency(data.data[0]);
      });
    jwt_token = localStorage.getItem('jwt');

    console.log(jwt_token)

    if (jwt_token != null) setLoged(true);
  }, []);

  function loginUserPass(username: string, password: string) {
    fetch('https://xmr-gate.onrender.com/api/v1/login', {
      method: 'GET',
      body: JSON.stringify(
        { username: username,
          password: password }
      )
      }).then(res => {
        if (!res.ok) {
          throw new Error('Login failed');
        }
        return res.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setLoged(true);
          setUsername(data.username)
        } else {
          throw new Error('No token received');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
      });
    
  }

  function registerUserPass(username: string, password: string) {
     fetch('https://xmr-gate.onrender.com/api/v1/register', {
      method: 'POST',
      body: JSON.stringify(
        { username: username,
          password: bcrypt.hashSync(password, salt) }
      )
      }).then(res => {
        if (!res.ok) {
          throw new Error('Register failed');
        }
      })
      .catch(error => {
        console.error('RegError:', error);
        alert('Register failed: ' + error.message);
      });
  }

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
        justifyItems: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg,rgb(214, 32, 250) 0%,rgb(0, 165, 137) 100%)',
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
          width: '96%',
          maxWidth: '470px',
          minWidth: '320px',
          marginTop: '4px',
          ml: '6px',
          mr: '6px',
        }}
      >

        <Box
        id='AccountShower'
        sx={{
          height: '36px',  
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          zIndex: 1000,
          flexDirection: 'row',
          bottom: '12px',
        }}
        onClick={() => setOpenAccount(true)}
        style={{ cursor: 'pointer' }}>
        <PersonIcon></PersonIcon>
        <Typography variant='h6' sx={{ fontSize: '16px', fontWeight: 500, color: '#000' }} >
          { loged ? username : 'SIGN IN' }
        </Typography>
        </Box>

        <Dialog
          id="accountWindow"
          open={openAccount}
          onClose={() => setOpenAccount(false)}
          aria-labelledby="account-modal-title"
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute'}}
        >
          <Typography id="account-modal-title" variant="h6" component="h2" sx={{mb: '10%', ml: '6%'}}>
                Log-in
          </Typography>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px',justifyContent: 'center'}}>
              <TextField
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                focused
                sx={{ ml: '16px', mr: '16px'}}
              >
              </TextField>
              <TextField
                id="passowrd"
                label="Password"
                autoComplete=''
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                focused
                sx={{ ml: '16px', mr: '16px'}}
              >
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', mb: '10%'}}>
              <Button
                variant="contained"
                sx={{ marginTop: '16px', width: '42%' }}
                onClick={() => {
                  if (password) {
                    registerUserPass(username, password);
                    loginUserPass(username, password);
                  }
                }}>
                Register
              </Button>
              <Button
                variant="contained"
                sx={{ marginTop: '16px', width: '42%' }}
                onClick={() => {
                  if (password) {
                    loginUserPass(username, password);
                    setOpenAccount(false);
                  }
                }}>
                Log In
              </Button>
            </Box>
          </form>
        </Dialog>

        <Box id= 'StatusForm' sx={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}  >
          <img id='ImgStatusForm' src="statusForm.svg" alt="statusForm" style={{ width: '100%', height: '100%' }}/>
          <Box id='StatusMonitor' sx={{ alignItems: 'center', display: 'flex',  position: 'absolute', justifyContent: 'space-around', width: '90%', mt: '-5%' }}>
            <CircularProgress sx={{ color: '#fff' }} style={{ width: '96px', height: '96px' }} variant='indeterminate'></CircularProgress>
            <Box id='StatusTexts' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, maxHeight: '100%' }}>
              <Typography variant="h5" align='center' maxWidth={'220px'}>Quick  steps</Typography>
              <Typography variant="body1" align='center' maxWidth={'220px'}>To exchange</Typography>
            </Box>
          </Box>
        </Box>

        <Box id='inputCoinForm' sx={{ display: 'flex', width: '100%', maxWidth: 470, alignItems: 'center', marginTop: '-4%' }} >
          <img id= 'ImgInputCoinForm' src="InputCoinForm.svg" alt="inputCoinForm" style={{ width: '100%', maxWidth: 470}}/>
          <Box id='ChoosingInputCoin' sx={{ alignItems: 'center', display: 'flex', position: 'absolute', justifyContent: 'space-between', marginLeft: '10px', marginRight: '15px', width: '93%' }}>
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
                sx={{ maxWidth: '200px', 
                  '& .MuiOutlinedInput-root': {borderRadius: '32px'},
                  '& .MuiInputBase-input': {textAlign: 'right', padding: '10px 10px', fontSize: '22px', transform: 'translateX(-5px)'}, 
                  '& .MuiInputLabel-outlined': {transform: 'translate(142px, -9px) scale(0.75)'}, 
                  '& .MuiOutlinedInput-notchedOutline': {textAlign: 'right'}
                }}
                label="Amount" 
                size='medium'
                value={currentInputCoin}
                onChange={(e) => setCurrentInputCoin(e.target.value)} 
                focused
                slotProps={{ input: { inputMode: 'numeric', inputProps: { pattern: '[0-9]*' } } }}
              >
              </TextField>
              <Typography id="oppCodeAmount" variant='caption' >{selectedOutputCurrency ? selectedOutputCurrency.code + ':' + currentOutputCoin : 'oppCode...'}</Typography>
              <Typography id="textsome" variant='caption'>USDT:</Typography>
            </Box>
          </Box>
          </Box>

        {/* <Box id='MainButton' sx={{ transform: 'translateY(2px)', position: 'relative', display: 'flex',  flexDirection: 'column', alignItems: 'center', marginBottom: '-49px', marginTop: '-49px', width: '98px', height: '98px', justifyContent: 'center', zIndex: 1, cursor: 'pointer' }} >
          <img id="mb" src="label.svg" alt="MainButton" style={{ width: '75px', height: '75px'}}/>
        </Box> */}

        <Box id='OutputCoinForm' sx={{ display: 'flex', marginTop: '2px', width: '100%', maxWidth: 470, alignItems: 'center' }}>
          <img id='ImgOutputCoinForm' src="OutputCoinForm.svg" alt="outputCoinForm" style={{ width: '100%', maxWidth: 470 }}/>
          <Box id='ChoosingOutputCoin' sx={{ alignItems: 'center', display: 'flex',  position: 'absolute', justifyContent: 'space-between', marginLeft: '10px', marginRight: '15px', width: '93%' }}>
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
              <Typography id="GetDouble" variant='caption'>USDT: </Typography>
              <Typography id="CoinCodeOut" variant='caption' >{selectedCurrency ? selectedCurrency.code + ':' + currentInputCoin : 'coinCode...'}</Typography>
              <TextField 
                id="YouGetAmount"  
                sx={{
                  maxWidth: '200px',
                  transform: 'rotateZ(180deg) rotateY(180deg)', 
                  '& .MuiInputBase-input': {
                    transform: 'rotateZ(180deg) rotateY(180deg) translateX(-5px)', 
                    textAlign: 'right',
                    padding: '10px 10px',
                    fontSize: '22px',
                  },
                  '& .MuiOutlinedInput-root': { borderRadius: '32px' },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(142px, 10px) scale(0.75) rotateY(180deg) rotateZ(180deg)'
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
                size='medium'
                value={currentOutputCoin}
                onChange={(e) => setCurrentOutputCoin(e.target.value)} 
                focused
                slotProps={{ input: { inputMode: 'numeric', inputProps: { pattern: '[0-9]*' } } }}
              >
              </TextField>
            </Box>
          </Box>
        </Box>

        <Box id='LastBlock' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateY(-6.5%)', width: '100%' }}>
            <img id='ImgFinalStageForm' src="FinalStageForm.svg" alt="finalStageForm" style={{width: '100%'}}/>
            
            <Box id='FinalForm' sx={{ position: 'absolute', marginTop: '12px', width: '92%' }} >
              <Box id='FinalButtonsAndText' display='flex' flexDirection='column' gap='8px' alignItems='center' >
                <Box sx={{ display:'flex', justifyContent:'center', width: '100%' }}>
                  <img id='BookButtonImg' src='bookButton.svg' alt='boobButoon' width='100%'></img>
                </Box>
                <TextField
                  id="RecieveAddress"  
                  sx={{
                    width: '100%',
                    transform: 'rotateZ(180deg) rotateY(180deg)', 
                    '& .MuiInputBase-input': {
                      transform: 'rotateZ(180deg) rotateY(180deg)', 
                      textAlign: 'center',
                    },
                    '& .MuiOutlinedInput-root': { borderRadius: '32px' },
                    '& .MuiInputLabel-root': {
                      transform: 'scale(0.75) rotateY(180deg) rotateZ(180deg) translateY(64%)',
                      transformOrigin: 'center',
                      textAlign: 'center',
                      width: '100%'
                    },
                    '& .MuiOutlinedInput-notchedOutline': { textAlign: 'center' },
                    '& > legend': {
                      position: 'absolute',
                      top: '100%',
                      right: '0',
                      transform: 'translateY(-50%) translateX(-50%)'
                    },
                    mb: 2
                  }} 
                  label="Address" 
                  size='medium' 
                  focused>
                </TextField>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  style={{
                    width: '100%'
                  }}
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


export default App; 

