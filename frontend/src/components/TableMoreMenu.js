import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
// material
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';

// ----------------------------------------------------------------------

export default function TableMoreMenu({openModal, deleteEnabled = false, deleteHandler = null, passwordEnabled = false, passwordHandler = null}) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onEdit = () => {
    openModal();
    setIsOpen(false);
  };

  const deleteMenu = deleteEnabled ? (
    <MenuItem onClick={deleteHandler} sx={{ color: 'text.secondary' }}>
      <ListItemIcon>
        <Icon icon={trash2Outline} width={24} height={24} />
      </ListItemIcon>
      <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }}/>
    </MenuItem>
  ): null;

  const passwordMenu = passwordEnabled ? (
    <MenuItem onClick={passwordHandler} sx={{ color: 'text.secondary' }}>
      <ListItemIcon>
        <Icon icon={lockFill} width={24} height={24}  />
      </ListItemIcon>
      <ListItemText primary="Change Password" primaryTypographyProps={{ variant: 'body2' }} />
    </MenuItem>
  ): null;

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        {deleteMenu}

        <MenuItem onClick={onEdit} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {passwordMenu}

      </Menu>
    </>
  );
}
