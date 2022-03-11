import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Box, Button, Container, Modal, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { CreateSavingsForm } from '../components/authentication/create';

// ----------------------------------------------------------------------
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Savings() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleCreateModalOpen = () => setCreateModalOpen(true);
  const handleCreateModalClose = () => setCreateModalOpen(false);

  return (
    <Page title="Savings | Financial Achievement Club">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Savings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Icon icon={plusFill} />}
          onClick={handleCreateModalOpen}
        >
          Add Savings
        </Button>
        <Modal
          open={createModalOpen}
          onClose={handleCreateModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <CreateSavingsForm onSubmitHandler={handleCreateModalClose}/>
          </Box>
        </Modal>
      </Container>
    </Page>
  );
}
