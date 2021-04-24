import { INavLink, INavLinkGroup, INavStyles, Nav } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax from '../utils/ajax';

interface MenuProps {}

const Menu: React.FC<MenuProps> = ({ children }) => {

  const [packageLinks, setPackageLinks] = useState<INavLink[]>();
  const [cookies, setCookies, removeCookies] = useCookies(['token']);
  const history = useHistory();
  const { showMessage } = useContext(MessageBoxContext);

  useEffect(() => {
    (async () => {
      const result = await ajax.get('packages');

      if (result.severity) {
        result.messages.forEach(
          (message: string) => showMessage(result.severity, message)
        );
        return;
      }

      setPackageLinks(result.map(
        (pckg, i) => ({
          name: pckg.name,
          url: `/package/${i}`
        })
      ));

    })();
  }, []);

  // TODO
  const navStyle: Partial<INavStyles> = {
    root: {
      width: '12vw',
      height: '100vh',
      boxSizing: 'border-box',
      border: '1px solid #eee',
      overflowY: 'auto',
      float: 'left',
    }
  };

  const groups: INavLinkGroup[] = [{
    links: [
      {
        name: 'Kezdőlap',
        url: '/',
      },
      {
        name: 'Tesztcsomagok',
        url: '/packages',
      }
    ]
  }];

  if (packageLinks?.length) {
    groups[0].links[1].links = packageLinks;
  }

  if (!cookies?.token) {
    groups.push({
      links: [{
        name: 'Belépés',
        url: '/login'
      }]
    });
  } else {
    groups[0].links.push({
      name: 'Statisztikák',
      url: '/statistics',
    });

    groups.push({
      links: [{
        name: 'Kilépés',
        url: ''
      }]
    });
  }

  const handleLinkClick = (e?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    if (e && item?.name === 'Kilépés') {
      e.preventDefault();
      removeCookies('token');
      history.push('/');
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <Nav
        groups={groups}
        styles={navStyle}
        onLinkClick={handleLinkClick}
      />
      <div style={{ float: 'left' }}>
        {children}
      </div>
    </div>
  );
};

export default Menu;