import React, { useContext, useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getPort, showToast } from "../commonFunctions";
import { AuthContext } from "../context/AuthContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NewUser = ({ closeModal, editData }) => {
  const status = [
    {
      value: "Active",
      label: "Active",
    },
    {
      value: "Inactive",
      label: "Inactive",
    },
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Suspended",
      label: "Suspended",
    },
    {
      value: "Deleted",
      label: "Deleted",
    },
  ];

  const { ishaveCompany, setIsHaveCompany, isLoading, setIsLoading } =
    useContext(AuthContext);
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    team: [],
    status: "Active", // Added status field
    listTeams: [],
  });

  useEffect(() => {
    try {
      const initalCall = async () => {
        if (editData) {
          setUserInfo((prev) => ({
            ...prev,

            name: editData.name,
            email: editData.email,
            team: [editData.team],
            status: editData.status,
          }));
        }
        await checkCompanyInfo();
      };
      initalCall();
    } catch (ex) {
      console.log(ex);
    }
  }, []);

  const checkCompanyInfo = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/checkCompanyInfo`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (response.data.success) {
        setIsHaveCompany(true);
        let obj = response["data"]["company"];
        setUserInfo((prev) => ({
          ...prev,
          companyName: obj["companyName"],
          listTeams: obj["teams"],
        }));
      }
    } catch (ex) {
      console.log("Error in checkCompanyInfo", ex);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setUserInfo((prev) => ({
      ...prev,
      name: "",
      email: "",
      team: [],
      status: "Active",
    }));
    closeModal((prev) => ({ ...prev, userModal: false }));
  };

  const handleSend = async () => {
    try {
      let psotObj = {
        ...userInfo,
        approvalByID: JSON.parse(sessionStorage["auth"])["email"],
        approvalByName: `${JSON.parse(sessionStorage["auth"])["firstName"]} ${
          JSON.parse(sessionStorage["auth"])["lastName"]
        }`,
      };
      // remove listTeams from the object
      delete psotObj.listTeams;

      console.log("add user", psotObj);

      const result = await axios.post(`${path.apiUrl}/insertUserInfo`, psotObj);
      if (result.status === 200) {
        // await checkCompanyInfo();
        // closeModal((prev) => ({ ...prev, companyModal: false }));
        // toast.success(result.data.message); // Show success message
        showToast(result.data.message, "success");
        setUserInfo((prev) => ({
          ...prev,
          name: "",
          email: "",
          team: [],
          status: "Active",
        }));
      } else {
        // closeModal((prev) => ({ ...prev, companyModal: false }));
        showToast(result.data.message, "error");
      }
    } catch (ex) {
      console.log("Error in handleSend", ex);
    }
  };

  const handleReset = () => {
    setUserInfo((prev) => ({
      ...prev,
      name: "",
      email: "",
      team: [],
      status: "Active",
    }));
  };

  return (
    <div>
      <Modal
        open={true}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              component="h6"
              style={{ marginBottom: "1rem" }}
            >
              New User
            </Typography>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <TextField
            id="name"
            label="Name"
            name="name"
            placeholder="Name"
            variant="standard"
            style={{
              width: "100%",
              marginBottom: "1rem",
            }}
            InputProps={{
              sx: {
                "&:before": {
                  borderBottomColor: "#333",
                },
                "&:after": {
                  borderBottomColor: "#333",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#333",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
                "&.Mui-focused": {
                  color: "#333",
                },
              },
            }}
            onChange={handleInputChange}
            value={userInfo.name}
            multiline
          />

          <TextField
            id="email"
            label="Email"
            name="email"
            placeholder="Email"
            type="email"
            variant="standard"
            style={{ width: "100%", marginBottom: "1rem" }}
            InputProps={{
              sx: {
                "&:before": {
                  borderBottomColor: "#333",
                },
                "&:after": {
                  borderBottomColor: "#333",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#333",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
                "&.Mui-focused": {
                  color: "#333",
                },
              },
            }}
            onChange={handleInputChange}
            value={userInfo.email}
            multiline
          />

          <TextField
            id="team"
            select
            label="Team"
            name="team"
            variant="standard"
            style={{ width: "100%", marginBottom: "1rem" }}
            InputProps={{
              sx: {
                "&:before": {
                  borderBottomColor: "#333",
                },
                "&:after": {
                  borderBottomColor: "#333",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#333",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
                "&.Mui-focused": {
                  color: "#333",
                },
              },
            }}
            onChange={handleInputChange}
            value={userInfo.team || ""} // Corrected value prop
          >
            {userInfo?.listTeams.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="status"
            select
            label="status"
            name="status"
            variant="standard"
            style={{ width: "100%", marginBottom: "1rem" }}
            InputProps={{
              sx: {
                "&:before": {
                  borderBottomColor: "#333",
                },
                "&:after": {
                  borderBottomColor: "#333",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "#333",
                },
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#333",
                "&.Mui-focused": {
                  color: "#333",
                },
              },
            }}
            onChange={handleInputChange}
            value={userInfo.status || ""} // Corrected value prop
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "end",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              style={{ border: "1px solid #333", color: "#333" }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              style={{ background: "#333" }}
            >
              {editData ? "Update" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default NewUser;
