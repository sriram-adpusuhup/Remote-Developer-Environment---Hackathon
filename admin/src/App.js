import { useState } from 'react';
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';

function App() {
  
  const [email, setEmail] =  useState('');

  const [response, setResponse] = useState(null);

  const onClick = async e => {
    console.log({ email })
    
    const { data = {} } = await axios.post(`http://localhost:8080/setup?user=${email}`);

    setResponse({
      ip: data.ip,
      username: data.username,
      password: data.password
    })

  }

  return (
    <Container className="App" sx={{ textAlign: 'center', margin: 'auto', width: '50%', border: '3px solid green', padding: '10px', height: '100vh' }}>
    <FormControl sx={{ margin: '0', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <TextField fullWidth id="filled-basic" label="Email" variant="filled" helperText="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <Button onClick={onClick}>Spin up VM</Button>
      {response != null && (
        <Box>
          <div>IP: {response.ip}</div>
          <div>Username: {response.username}</div>
          <div>Password: {response.password}</div>
        </Box>
      )}
    </FormControl>
    </Container>
  );
}

export default App;
