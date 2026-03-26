import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import { NavLink, useLocation } from 'react-router-dom'

const DRAWER_WIDTH = 220

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
  { label: 'Pièces', icon: <MeetingRoomIcon />, to: '/rooms' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {NAV_ITEMS.map(({ label, icon, to }) => (
          <ListItem key={to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={to}
              selected={location.pathname === to}
              end
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
