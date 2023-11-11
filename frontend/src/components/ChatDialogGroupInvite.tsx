import { Tabs, Dialog, Stack, Tab } from '@mui/material';
import { useState, useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectChatDialogStore, selectChatStore } from "../redux/store";
import { ChatUserComp, ChatUserFriendComp, ChatUserFriendRequestComp } from './ChatUserComp';
import Cookies from 'js-cookie';
import { Group, JoinGroup, User } from "../types";
import { updateChatDialogGroupInvite } from '../redux/slices/chatDialogSlice';
import { ChatGroupDialogEntryComp, ChatGroupDialogInviteEntryComp, ChatGroupDialogRequestEntryComp } from './ChatGroupComp';
import { ChatGroupMemberList } from '../data/ChatData';
import { enChatGroupInviteStatus } from '../enums';

const ChatGroupList = ()=> {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore)

    return (
        <>
            {chatStore.chatGroupList.map((group) => {
                if (group)
                    return <ChatGroupDialogEntryComp  key={group.channelId} {...group} />
                })
            }
        </>
    )
}

function GetJoinGroupListForLoggedUser () : JoinGroup[] {
    const userId = Cookies.get('userId') ? Cookies.get('userId') : '';
    const chatStore = useSelector(selectChatStore);

    // api call to fetch all JoinGroup elements for filtering
    const JoinGroupList = chatStore.chatGroupMembers

    const affiliatedJoinGroupList = JoinGroupList.filter(el => 
        (userId && (el.userId.toString()) == userId))

    return affiliatedJoinGroupList
}

function GetGroupDataById(groupList: (Group | null)[], groupId: number): Group | null
{
    let group = {} as Group | null
    let resultList : (Group | null)[]= []
    if (groupList)
    {
        resultList = groupList.filter(el => el && el.channelId == groupId)

    }
    if (resultList.length == 1)
    {
        group = resultList[0]
    }
    return group
}

const ChatGroupInviteList = ()=> {
    const chatStore = useSelector(selectChatStore)
    const groups = chatStore.chatGroupList
    const affliatedJoinGroupList = GetJoinGroupListForLoggedUser()
    const inviteList = affliatedJoinGroupList.filter(el => 
        el.status == enChatGroupInviteStatus.INVITE
        )
    let group = {} as Group | null

    return (
        <>
            {inviteList.map((el) => {
                if (groups)
                {
                    group = GetGroupDataById(groups, el.channelId)
                    console.log("invite", "-", group)
                    if (group)
                        return <ChatGroupDialogInviteEntryComp 
                                    key={group.channelId} {...group}
                                />
                }
            }) 
            }
        </>
        )
}

const ChatGroupRequestList = ()=> {
    const chatStore = useSelector(selectChatStore)
    const groups = chatStore.chatGroupList
    const affliatedJoinGroupList = GetJoinGroupListForLoggedUser()
    const requestList = affliatedJoinGroupList.filter(el => 
        el.status == enChatGroupInviteStatus.PENDING
        )
    let group = {} as Group | null

    return (
        <>
            {requestList.map((el) => {
                if (groups)
                {
                    group = GetGroupDataById(groups, el.channelId)
                    if (group)
                        return <ChatGroupDialogRequestEntryComp
                                    key={group.channelId} {...group}
                                />
                }
            }) 
            }
        </>
    )
}


const ChatDialogGroupInvite = ()=>{

    const [value, setValue] = useState<Number>(0);

    const handleChange = (event: React.SyntheticEvent<Element, Event>,
                         newValue: Number
                         ) =>{
        setValue(newValue);

    }
    const chatDialogStore = useSelector(selectChatDialogStore)
    const dispatch = useDispatch()
    const open = chatDialogStore.chatDialogGroupInvite
    const handleClose = ()=>{
        dispatch(updateChatDialogGroupInvite(false));
    }


    return (
        <>
        <Dialog fullWidth  open={open} keepMounted
            onClose={handleClose} sx={{p: 4}}
        >
            <Stack p={2} sx={{width: "100%"}}>
                <Tabs value={value} centered onChange={handleChange}>
                    <Tab label={"Groups"} />
                    <Tab label={"Invites"} />
                    <Tab label={"Requests"} />
                </Tabs>
            </Stack>
            {/* Dialog content  */}
            <Stack sx={{height: "100%"}} p={2}>
                <Stack spacing={1}>
                    {(()=>{
                        switch (value)
                        {
                            case 0:
                                return (<>
                                    <ChatGroupList />
                                </>);
                            case 1:
                                return (<>
                                    <ChatGroupInviteList />
                                </>);
                            case 2:
                                return (<>
                                    <ChatGroupRequestList />
                                </>);
                            default: break
                        }
                    })()}
                </Stack>
            </Stack>
        </Dialog>
        </>
    )
}






export default ChatDialogGroupInvite