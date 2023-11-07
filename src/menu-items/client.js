// assets
// import { IconBrandChrome, IconHelp } from '@tabler/icons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TaskIcon from '@mui/icons-material/Task';
import SupportIcon from '@mui/icons-material/Support';
import PeopleIcon from '@mui/icons-material/People';
import EuroIcon from '@mui/icons-material/Euro';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import TableViewIcon from '@mui/icons-material/TableView';
// constant
const icons = { AccountCircleIcon, TableViewIcon, CloudCircleIcon, AccountBoxIcon, PeopleIcon, EuroIcon, TaskIcon, SettingsIcon, SupportIcon };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const client = {
  id: 'client',
  type: 'group',
  children: [
    {
      id: 'c_profile',
      title: 'Perfil',
      type: 'item',
      url: '/dashboard/client/profile',
      icon: icons.AccountBoxIcon,
      breadcrumbs: false
    },
    {
      id: 'c_table',
      title: 'PDF/Excel',
      type: 'item',
      url: '/dashboard/client/table',
      icon: icons.TableViewIcon,
      breadcrumbs: false

    },
    {
      id: 'c_billing',
      title: 'Facturación',
      type: 'item',
      url: '/dashboard/client/billing',
      icon: icons.EuroIcon,
      breadcrumbs: false
    },
    {
      id: 'c_userAccounts',
      title: 'Usuarios',
      type: 'item',
      url: '/dashboard/client/user_accounts',
      icon: icons.AccountCircleIcon,
      breadcrumbs: false
    },
    {
      id: 'c_task',
      title: 'Tarea',
      type: 'item',
      url: '/dashboard/client/task',
      icon: icons.TaskIcon,
      breadcrumbs: false
    },
    {
      id: 'c_support',
      title: 'Apoyo',
      type: 'item',
      url: '/dashboard/client/support',
      icon: icons.SupportIcon,
      breadcrumbs: false
    },
    {
      id: 'c_cloud',
      title: 'Nube',
      type: 'item',
      url: '/dashboard/client/cloud',
      icon: icons.CloudCircleIcon,
      breadcrumbs: false
    },
  ]
};

export default client;
