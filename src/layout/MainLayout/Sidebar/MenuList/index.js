// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import $ from 'jquery'
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  // const role = $('#p_role').text()
  let role = window.localStorage.getItem("role")
  console.log("menulist", role)
  let displayItem = [menuItem.items[0]];
  if(role == "1")
    displayItem = [menuItem.items[1]];
  else if(role == "2")
    displayItem = [menuItem.items[0]];
  else 
    displayItem = [menuItem.items[2]];

  const navItems = displayItem.map((item) => {
    console.log('sdfsdfdf', $('#p_role').text())
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
