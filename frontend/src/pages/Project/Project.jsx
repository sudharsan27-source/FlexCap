import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import "./Project.css";
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

  const handleEdit = (id) => {
debugger
projectDetails.find((d)=> d._id === id)

  }

  const getProjectCard = () => {
    console.log("prj", projectDetails);
    return (
      <>
        {projectDetails &&
          projectDetails.map((card) => {
            return (
              <div key={card._id} className="card-box">
                <div className="cardName-Editbutton">
                  <strong className="card-header">{card.projectName}</strong>
                  <button className="editbtn" onClick={()=> handleEdit(card._id)}>Edit</button>
                </div>
                <hr className="line" />
                <div>
                  <div className="flex-dvi">
                    <strong>Project Key:</strong> <p>{card.projectKey}</p>
                  </div>
                  <div className="flex-dvi">
                    <strong>Project Description:</strong>{" "}
                    <p>{card.projectDescription}</p>
                  </div>
                  <div className="flex-dvi">
                    <strong>Start Data:</strong> <p>{card.projectStartDate}</p>
                  </div>
                  <div className="flex-dvi">
                    <strong>End Data:</strong> <p>{card.projectEndDate}</p>
                  </div>
                </div>
                <div>
                  <strong>Team Lead</strong>
                  <div>
                    {card.teamLead &&
                      card.teamLead.map((TL) => {
                        return <span>{TL}</span>;
                      })}
                  </div>
                </div>
                <div>
                  <strong>Team Members</strong>
                  <div>
                    {card.teamMember &&
                      card.teamMember.map((TL) => {
                        return <span>{TL}</span>;
                      })}
                  </div>
                </div>
              </div>
            );
          })}
      </>
    );
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
          <div className="card-outer-div">{getProjectCard()}</div>
        )}
      </div>
      {modalOpen.addProject && <AddProject closeModal={setModalOpen} />}
    </>
  );
};

export default Project;
