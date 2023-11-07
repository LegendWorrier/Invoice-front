// assets
// import { IconBrandChrome, IconHelp } from '@tabler/icons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import UploadIcon from '@mui/icons-material/Upload';
import TaskIcon from '@mui/icons-material/Task';
import SupportIcon from '@mui/icons-material/Support';
// constant
const icons = { AccountCircleIcon, CloudCircleIcon, UploadIcon, TaskIcon, SupportIcon };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const user = {
  id: 'user',
  type: 'group',
  children: [
    {
      id: 'u_profile',
      title: 'Perfil',
      type: 'item',
      url: '/dashboard/user/profile',
      icon: icons.AccountCircleIcon,
      breadcrumbs: false
    },
    {
      id: 'u_cloud',
      title: 'Nube',
      type: 'item',
      url: '/dashboard/user/cloud',
      icon: icons.CloudCircleIcon,
      breadcrumbs: false

    },
    {
      id: 'u_upload',
      title: 'Subir documento',
      type: 'item',
      url: '/dashboard/user/upload_doc',
      icon: icons.UploadIcon,
      breadcrumbs: false
    },
    {
      id: 'u_task',
      title: 'Tarea',
      type: 'item',
      url: '/dashboard/user/task',
      icon: icons.TaskIcon,
      breadcrumbs: false
    },
    {
      id: 'u_support',
      title: 'Apoyo',
      type: 'item',
      url: '/dashboard/user/support',
      icon: icons.SupportIcon,
      breadcrumbs: false
    },
  ]
};

export default user;
