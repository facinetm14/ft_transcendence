import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Gear } from 'phosphor-react';
import { Group } from '../types';
import { enChatPrivacy } from '../enums';
import ChatGroupFormSetPasswd from './ChatGroupFormSetPasswd';
import chatDialogSlice, { updateChatDialogAddUser, updateChatDialogSetTitle } from '../redux/slices/chatDialogSlice';
import { useSelector } from 'react-redux';
import { selectChatDialogStore } from '../redux/store';
import { useDispatch } from 'react-redux';
import { updateChatDialogSetPasswd } from '../redux/slices/chatDialogSlice';

export default function ChatGroupActionBtn(privacy: string) {
  const chatDialogStore = useSelector(selectChatDialogStore)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const OnChangePasswd = () => {
    dispatch(updateChatDialogSetPasswd(true))
  }
  const OnSetTitle = () => {
    dispatch(updateChatDialogSetTitle(true))
  }
  const OnAddUser = () => {
    dispatch(updateChatDialogAddUser(true))
  }
  return (
    <div>
      <Button
        startIcon={ <Gear size={25}/>}
        fullWidth
        variant='outlined'
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
           Action   
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={OnAddUser}>Add User</MenuItem>
        <MenuItem onClick={OnSetTitle}>Rename Group Title</MenuItem>
        <MenuItem onClick={handleClose}>Delete Group</MenuItem>
        { privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={handleClose}>Show Password</MenuItem>}
        { privacy != enChatPrivacy.PROTECTED && <MenuItem onClick={OnChangePasswd}>Set Password</MenuItem>}
        { privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={handleClose}>Unset Password</MenuItem>}
        { privacy == enChatPrivacy.PROTECTED && <MenuItem onClick={OnChangePasswd}>Change Password</MenuItem>}
      </Menu>
    </div>
  );
}