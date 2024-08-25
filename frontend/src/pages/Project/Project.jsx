import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Company from "../../component/Company";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { getPort } from "../../commonFunctions";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import NewUser from "../../component/NewUser";
import AddProject from "../../component/AddProject";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const Project = () => {
  const { ishaveCompany, setIsHaveCompany, isLoading } =
    React.useContext(AuthContext);
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [modalOpen, setModalOpen] = React.useState({
    addProject: false,
  });
  const [projectDetails, setProjectDetails] = React.useState([]);
  React.useEffect(() => {
    const getinitData = async () => {
      await getProjectInfo();
    };
    getinitData();
    console.log('projhect', projectDetails)
  }, []);

  const getProjectInfo = async () => {
    try {
      let obj = { email: JSON.parse(sessionStorage["auth"])["email"] };
      const result = await axios.post(`${path.apiUrl}/getProjectInfo`, obj);
      if (result.data.success) {
        setProjectDetails(result.data.project);
      }
    } catch (ex) {
      console.log("Error in get project info", ex);
    }
  };

  const handleModalOpen = () => {
    setModalOpen((prev) => ({ ...prev, addProject: true }));
  };

  return (
    <>
      <div style={{ width: "100%", marginTop: "20px" }}>
        <Stack direction="row" spacing={2}>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              sx={{ marginBottom: "1rem", borderRadius: "8px" }}
            />
          ) : (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              style={{ background: "#333" }}
              onClick={() => handleModalOpen("companyModal")}
            >
              Project
            </Button>
          )}
        </Stack>
        {isLoading ? (
          <Box sx={{ marginTop: "1rem" }}>
            {Array.from(new Array(5)).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={"100%"}
                height={40}
                sx={{ marginBottom: "1rem", borderRadius: "8px" }}
              />
            ))}
          </Box>
        ) : (
          <div>
            <h1>Hi</h1>
          </div>
        )}
      </div>
      {modalOpen.addProject && <AddProject closeModal={setModalOpen} />}
    </>
  );
};

export default Project;
