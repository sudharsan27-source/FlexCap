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

const Admin = () => {
  const { ishaveCompany, setIsHaveCompany, isLoading } =
    React.useContext(AuthContext);
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [modalOpen, setModalOpen] = React.useState({
    companyModal: false,
    userModal: false,
  });
  const [data, setData] = React.useState([]);
  const [editData, setEditData] = React.useState(null);
  React.useEffect(() => {
    checkCompanyInfo();
  }, [modalOpen]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span
          style={{
            color: getStatusColor(params.value),
            fontWeight: "bold",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "approvalBy",
      headerName: "Approval By",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          // variant="contained"
          // color="primary"
          startIcon={<EditOutlinedIcon />}
          onClick={() => handleEdit(params.row)}
          variant="outlined"
          color="secondary"
          style={{ border: "1px solid #333", color: "#333" }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "red";
      case "Pending":
        return "blue";
      case "Suspended":
        return "orange";
      case "Deleted":
        return "gray";
      default:
        return "black";
    }
  };

  const handleCompanyModalOpen = (action) => {
    if (action === "userModal") {
      setEditData(null);
      setModalOpen((prev) => ({ ...prev, userModal: true }));
    } else {
      setModalOpen((prev) => ({ ...prev, companyModal: true }));
    }
  };

  const checkCompanyInfo = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/checkCompanyInfo`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (response.data.success) {
        setIsHaveCompany(true);
        await getCompanyUsers();
      }
    } catch (ex) {
      console.log("Error in checkCompanyInfo", ex);
    }
  };

  const getCompanyUsers = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/getCompanyUsers`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (response.data) {
        let ResultObj = response.data.map((user, index) => ({
          id: index + 1,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          team: user.team,
          status: user.status,
          approvalBy: user.approvalByName,
        }));
        setData(ResultObj);
      }
    } catch (ex) {
      console.log("Error in getCompanyUsers", ex);
    }
  };

  const handleEdit = (row) => {
    // Implement your edit logic here
    console.log("Editing row:", row);
    setEditData((prev) => ({
      ...prev,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      team: row.team,
      status: row.status,
    }));
    setModalOpen((prev) => ({ ...prev, userModal: true }));
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
              variant="outlined"
              startIcon={<AddBusinessOutlinedIcon />}
              style={{ border: "1px solid #333", color: "#333" }}
              onClick={() => handleCompanyModalOpen("companyModal")}
            >
              Company
            </Button>
          )}
          {isLoading && ishaveCompany ? (
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              sx={{ marginBottom: "1rem", borderRadius: "8px" }}
            />
          ) : (
            ishaveCompany && (
              <Button
                variant="contained"
                startIcon={<PersonAddOutlinedIcon />}
                style={{ background: "#333" }}
                onClick={() => handleCompanyModalOpen("userModal")}
              >
                Add User
              </Button>
            )
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
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            style={{
              marginTop: "1rem",
            }}
            autoHeight
          />
        )}
      </div>
      {modalOpen.companyModal && <Company closeModal={setModalOpen} />}
      {modalOpen.userModal && (
        <NewUser closeModal={setModalOpen} editData={editData} />
      )}
    </>
  );
};

export default Admin;
