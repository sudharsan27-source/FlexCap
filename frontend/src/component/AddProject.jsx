import React, { useContext, useState, useEffect } from "react";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, Button, Box } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getPort, showToast } from "../commonFunctions";
import { AuthContext } from "../context/AuthContext";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
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

const AddProject = ({ closeModal }) => {
  const { ishaveCompany, setIsHaveCompany, isLoading, setIsLoading } =
    useContext(AuthContext);

  const [path, setPath] = React.useState({ apiUrl: getPort() });

  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    projectKey: "",
    projectDescription: "",
    projectStartDate: "",
    projectEndDate: "",
    listedteamLead: ["A", "B"],
    listeteamMember: ["c", "d", "e"],
    teamLead: [],
    teamMember: [],
  });

  useEffect(() => {
    try {
      const initalCall = async () => {
        await checkCompanyInfo();
      };
      initalCall();
    } catch (ex) {
      console.log(ex);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamsChange = (event, value) => {
    setProjectInfo((prev) => ({
      ...prev,
      teams: value,
    }));
  };

  const handleClose = () => {
    setProjectInfo({
      projectName: "",
      projectKey: "",
      projectDescription: "",
      projectStartDate: "",
      projectEndDate: "",
      listedteamLead: [],
      listeteamMember: [],
      teamLead: [],
      teamMember: [],
    });
    closeModal((prev) => ({ ...prev, addProject: false }));
  };

  const handleSend = async () => {
    try {
      delete projectInfo.listedteamLead;
      delete projectInfo.listeteamMember;
      console.log("project info", projectInfo);
      let psotObj = {
        ...projectInfo,
        createdBy: JSON.parse(sessionStorage["auth"])["email"],
        createdOn: new Date().toLocaleDateString(),
      };

      const result = await axios.post(
        `${path.apiUrl}/insertProjectInfo`,
        psotObj
      );
      if (result.status === 200) {
        closeModal((prev) => ({ ...prev, addProject: false }));
        // toast.success(result.data.message); // Show success message
        showToast(result.data.message, "success");
      } else {
        closeModal((prev) => ({ ...prev, addProject: false }));
        showToast(result.data.message, "error");
      }
    } catch (ex) {
      console.log("Error in handleSend", ex);
    }
  };

  const handleReset = () => {
    setProjectInfo({
      companyName: "",
      CEOName: "",
      teams: [],
    });
  };

  const checkCompanyInfo = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/getTeamDetails`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (!response.data) {
        console.log("Network error");
        return;
      }
      setIsHaveCompany(true);
      let obj = response["data"];
      setProjectInfo((prev) => ({
        ...prev,
        companyName: obj["companyName"],
        listedteamLead: obj["teamLead"],
        listeteamMember: obj["teamMember"],
      }));
    } catch (ex) {
      console.log("Error in checkCompanyInfo", ex);
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
              Add Project
            </Typography>
            <CloseIcon style={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>

          <TextField
            id="projectName"
            label="Project Name"
            name="projectName"
            placeholder="Project Name"
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
            value={projectInfo.projectName}
            multiline
          />

          <TextField
            id="projectKey"
            label="Project Key"
            name="projectKey"
            placeholder="Project Key"
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
            value={projectInfo.projectKey}
            multiline
          />

          <TextField
            id="projectDescription"
            label="Project Description"
            name="projectDescription"
            placeholder="Project Description"
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
            value={projectInfo.projectDescription}
            multiline
          />

          <TextField
            id="projectStartDate"
            label="Start Date"
            name="projectStartDate"
            type="date"
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
                shrink: true, // This ensures the label stays above the field when a date is selected
              },
            }}
            onChange={handleInputChange}
            value={projectInfo.projectStartDate || new Date()}
          />

          <TextField
            id="projectEndDate"
            label="End Date"
            name="projectEndDate"
            type="date"
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
                shrink: true, // This ensures the label stays above the field when a date is selected
              },
            }}
            onChange={handleInputChange}
            value={projectInfo.projectEndDate || new Date()}
          />

          <TextField
            id="teamLead"
            select
            label="Team Lead"
            name="teamLead"
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
            SelectProps={{
              multiple: true, // Enable multiple selection
              renderValue: (selected) => selected.join(", "), // Display selected options as comma-separated values
            }}
            onChange={handleInputChange}
            value={projectInfo.teamLead || []} // Ensure value is an array
          >
            {projectInfo.listedteamLead.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={projectInfo.teamLead.indexOf(option) > -1} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="teamMember"
            select
            label="Team Members"
            name="teamMember"
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
            SelectProps={{
              multiple: true, // Enable multiple selection
              renderValue: (selected) => selected.join(", "), // Display selected options as comma-separated values
            }}
            onChange={handleInputChange}
            value={projectInfo.teamMember || []} // Ensure value is an array
          >
            {projectInfo.listeteamMember.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  checked={projectInfo.teamMember.indexOf(option) > -1}
                />
                <ListItemText primary={option} />
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
              {"Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddProject;
