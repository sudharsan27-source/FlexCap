import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import OtpInput from 'react-otp-input';
import Alert from '@mui/material/Alert';
import axios from "axios"
import { getPort } from "../commonFunctions";
import { Link } from '@mui/material';
const style = {
  width: '90%',
  maxWidth: '500px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const OtpModel = ({ handleCloseModal, signUpInfo }) => {
  const {firstName, lastName, email, password } = signUpInfo;
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [otp, setOtp] = React.useState('');
  const [alert, setAlert] = React.useState({type:'', message:''});

  const otpInputStyle = {
    width: '100%',
    display: 'flex',
    height: '50px',
    justifyContent: 'center',
    '& input': {
      flex: 1,
      height: '40px',
      margin: '0 5px',
      textAlign: 'center',
      fontSize: '18px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      ':first-of-type': {
        border: 'none', // Remove border for the first input
      },
      '@media (max-width: 600px)': {
        height: '35px',
        fontSize: '16px',
      },
    },
  };

  const handleVerifyUser = async () => {
    try {
      if (!otp) {
        setAlert({
          type: 'error',
          message: 'Please enter OTP'
        });
        return;
      }
      let obj = {
        firstName,
        lastName,
        email,
        password,
        otp
      }
      const response = await axios.post(
        `${path.apiUrl}/verifyOtp`,
        obj
      );
      if (response.status === 200) {
        console.log(response.data);
        setAlert({
          type:'success',
          message: 'Your account has been verified. Please login to continue'
        });
      }else if(response.status === 400){
        setAlert({
          type: 'error',
          message: response.data.message
        });
      }
    } catch (Ex) {
      console.log("Error in handle verify user", Ex);
      setAlert("An error occurred during verification");
    }
  };

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Verify Your Account
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            We've sent a one-time password to your email. Please enter it below to complete your sign-up.
          </Typography>
          <Box sx={{ width: '75%', mx: 'auto', mt: 2 }}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={false}
              renderInput={(props) => <input {...props} />}
              inputStyle={otpInputStyle}
            />
          </Box>
         
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            justifyContent: "flex-end",
            flexWrap: "wrap"
          }}>
            <Button variant="outlined" onClick={handleCloseModal}>Go Back</Button>
            <Button variant="contained" onClick={handleVerifyUser}>Verify</Button>
          </div>
          {alert && (
            <Alert severity={alert.type || ""} sx={{ mt: 2 }}>
              {alert.message || ""}
            </Alert>
          )}
          {alert.type ==='success' && (
            <div style={{display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            flexWrap: "wrap"}}>
           <Link href="/" variant="body2">
           To Login
         </Link>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default OtpModel;
