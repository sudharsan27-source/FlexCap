import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Company from "../../component/Company";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { getPort } from "../../commonFunctions";
const Admin = () => {
  const { ishaveCompany, setIsHaveCompany } = React.useContext(AuthContext);
  const [path, setPath] = React.useState({ apiUrl: getPort() });
  const [modalOpen, setModalOpen] = React.useState({
    companyModal: false,
    userModal: false,
  });
  React.useEffect(() => {
    checkCompanyInfo();
  }, []);
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 130,
    },
  ];

  const rows = [
    {
      id: 1,
      firstName: "Jon",
      lastName: "Snow",
      email: "jon.snow@example.com",
    },
    {
      id: 2,
      firstName: "Cersei",
      lastName: "Lannister",
      email: "cersei.lannister@example.com",
    },
    {
      id: 3,
      firstName: "Jaime",
      lastName: "Lannister",
      email: "jaime.lannister@example.com",
    },
    {
      id: 4,
      firstName: "Arya",
      lastName: "Stark",
      email: "arya.stark@example.com",
    },
    {
      id: 5,
      firstName: "Daenerys",
      lastName: "Targaryen",
      email: "daenerys.targaryen@example.com",
    },
    {
      id: 6,
      firstName: "unknown",
      lastName: "Melisandre",
      email: "unknown.melisandre@example.com",
    },
    {
      id: 7,
      firstName: "Ferrara",
      lastName: "Clifford",
      email: "ferrara.clifford@example.com",
    },
    {
      id: 8,
      firstName: "Rossini",
      lastName: "Frances",
      email: "rossini.frances@example.com",
    },
    {
      id: 9,
      firstName: "Harvey",
      lastName: "Roxie",
      email: "harvey.roxie@example.com",
    },
  ];

  const handleCompanyModalOpen = () => {
    setModalOpen((prev) => ({ ...prev, companyModal: true }));
  };

  const checkCompanyInfo = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/checkCompanyInfo`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (response.data.success) {
        setIsHaveCompany(true);
      }
    } catch (ex) {
      console.log("Error in checkCompanyInfo", ex);
    }
  };

  return (
    <>
      <div style={{ width: "100%", marginTop: "20px" }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<AddBusinessOutlinedIcon />}
            style={{ border: "1px solid #333", color: "#333" }}
            onClick={handleCompanyModalOpen}
          >
            Company
          </Button>
          {ishaveCompany && (
            <Button
              variant="contained"
              startIcon={<PersonAddOutlinedIcon />}
              style={{ background: "#333" }}
            >
              Add User
            </Button>
          )}
        </Stack>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
          style={{
            marginTop: "1rem",
          }}
        />
      </div>
      {modalOpen.companyModal && <Company closeModal={setModalOpen} />}
    </>
  );
};

export default Admin;
