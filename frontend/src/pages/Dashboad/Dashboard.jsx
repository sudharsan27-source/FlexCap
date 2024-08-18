import { useEffect, useState } from "react";
import { getPort } from "../../commonFunctions";
import InfoModal from "../../component/InfoModal";
import axios from "axios";

const Dashboard = () => {
  const [path, setPath] = useState({ apiUrl: getPort() });
  const [infoMessage, setInfoMessage] = useState(null);

  useEffect(() => {
    const initialFunctionCall = async () => {
      await checkCompanyInfo();
    };
    initialFunctionCall();
  }, []);

  const checkCompanyInfo = async () => {
    try {
      const response = await axios.post(`${path.apiUrl}/checkCompanyInfo`, {
        registerEmailId: JSON.parse(sessionStorage["auth"])["email"],
      });
      if (!response.data.success) {
        setInfoMessage({
          modalOpen: true,
          message: "Please register your company in the Admin menu.",
          type: "error",
          userName: `${JSON.parse(sessionStorage["auth"])["firstName"]} 
            ${JSON.parse(sessionStorage["auth"])["lastName"]}`,
        });
      } else {
        sessionStorage.setItem("isCompanyInfo", true);
      }
    } catch (ex) {
      console.log("Error in checkCompanyInfo", ex);
    }
  };

  return (
    <>
      <div>
        <h1>Dashboard</h1>
      </div>
      {infoMessage?.modalOpen &&
        !JSON.parse(sessionStorage["auth"])["isUser"] && (
          <InfoModal infoMessage={infoMessage} />
        )}
    </>
  );
};

export default Dashboard;
