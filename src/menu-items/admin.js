// assets
// import { IconBrandChrome, IconHelp } from '@tabler/icons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TaskIcon from '@mui/icons-material/Task';
import SupportIcon from '@mui/icons-material/Support';
import PeopleIcon from '@mui/icons-material/People';
import EuroIcon from '@mui/icons-material/Euro';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
// constant
const icons = { AccountCircleIcon, AccountBoxIcon, PeopleIcon, EuroIcon, TaskIcon, SettingsIcon, SupportIcon };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const admin = {
  id: 'admin',
  type: 'group',
  children: [
    {
      id: 'a_agencyClients',
      title: 'Gestorias/Asesorias',
      type: 'item',
      url: '/dashboard/admin/agency_clients',
      icon: icons.AccountBoxIcon,
      breadcrumbs: false
    },
    {
      id: 'a_userClients',
      title: 'Usuarios',
      type: 'item',
      url: '/dashboard/admin/user_clients',
      icon: icons.PeopleIcon,
      breadcrumbs: false

    },
    {
      id: 'a_billng',
      title: 'Facturación',
      type: 'item',
      url: '/dashboard/admin/billing',
      icon: icons.EuroIcon,
      breadcrumbs: false
    },
 
    {
      id: 'a_task',
      title: 'Tarea',
      type: 'item',
      url: '/dashboard/admin/task',
      icon: icons.TaskIcon,
      breadcrumbs: false
    },
    {
      id: 'a_support',
      title: 'Apoyo',
      type: 'item',
      url: '/dashboard/admin/support',
      icon: icons.SupportIcon,
      breadcrumbs: false
    },
    {
      id: 'a_settings',
      title: 'Ajustes',
      type: 'item',
      url: '/dashboard/admin/settings',
      icon: icons.SettingsIcon,
      breadcrumbs: false
    },
  ]
}
export default admin 
