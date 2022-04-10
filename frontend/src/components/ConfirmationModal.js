// material
import {
  Box,
  Button,
  Modal,
  Typography,
} from '@mui/material';

// ----------------------------------------------------------------------

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ConfirmationModal(props) {
  return (
    <Modal
      open={props.modalOpen}
      onClose={props.handleModalClose}
    >
      <Box sx={modalStyle}>
        <Typography>Are you sure you want to delete this item?</Typography>
        <Button onClick={() => {props.handleSubmit(); props.handleModalClose();}}>Yes</Button>
        <Button onClick={props.handleModalClose}>No</Button>
      </Box>
    </Modal>
  );
}
