import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  border: "2px solid #333",
  borderRadius: "8px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

export default function InfoModal({ infoMessage }) {
  const [open, setOpen] = React.useState(infoMessage?.modalOpen || false);

  React.useEffect(() => {
    setOpen(infoMessage?.modalOpen || false);
  }, [infoMessage]);

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div style={{ marginBottom: "1rem" }}>
            <CloseIcon
              onClick={handleClose}
              style={{ float: "right", cursor: "pointer" }}
            />
          </div>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {`Hi ${infoMessage?.userName}, Welcome to FlexCap!`}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {infoMessage?.message || "Text in a modal"}
          </Typography>
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {infoMessage?.type === "error" ? "An error occurred" : "Info"}
          </Typography> */}
        </Box>
      </Modal>
    </div>
  );
}
