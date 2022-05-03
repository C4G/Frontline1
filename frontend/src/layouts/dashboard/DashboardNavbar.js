import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import chevronUpFill from '@iconify/icons-eva/chevron-up-fill';
import chevronDownFill from '@iconify/icons-eva/chevron-down-fill';
import { alpha, styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, Menu, MenuItem, Link, IconButton } from '@mui/material';
// components
import { MHidden } from '../../components/@material-extend';
//
import AccountPopover from './AccountPopover';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const [anchor, setAnchor] = useState();
  const open = Boolean(anchor);
  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setAnchor(null);
  };

  const [anchor2, setAnchor2] = useState();
  const open2 = Boolean(anchor2);
  const handleClick2 = (event) => {
    setAnchor2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchor2(null);
  };

  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 2.0, sm: 6.0 }}>
          <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="/">HOME</Link>
          <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/join-us">JOIN US</Link>
          <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/contact-us">CONTACT US</Link>
          <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/donate">DONATE</Link>
          <div>
            <Link
              sx={{"color": "black", "fontFamily": "Sans-Serif"}}
              onClick={handleClick}
              underline="none"
            >
              WHO WE ARE {<Icon icon={open ? chevronUpFill : chevronDownFill} />}
            </Link>
            <Menu
              id="who-we-are"
              open={open}
              onClose={handleClose}
              anchorEl={anchor}
            >
              <MenuItem>              
                <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/about-us-1">About Us</Link>
              </MenuItem>
              <MenuItem>
              <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/our-team">Our Team</Link>
              </MenuItem>
            </Menu>
          </div>

          <div>
            <Link
              sx={{"color": "black", "fontFamily": "Sans-Serif"}}
              onClick={handleClick2}
              underline="none"
            >
              WHAT WE DO {<Icon icon={open2 ? chevronUpFill : chevronDownFill} />}
            </Link>
            <Menu
              id="what-we-do"
              open={open2}
              onClose={handleClose2}
              anchorEl={anchor2}
            >
              <MenuItem>              
                <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/programs">Programs</Link>
              </MenuItem>
              <MenuItem>
              <Link sx={{"color": "black", "fontFamily": "Sans-Serif"}} underline="none" href="https://frontlinehousing.org/success-stories">Success Stories</Link>
              </MenuItem>
            </Menu>
          </div>
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
