import { INavLink, INavLinkGroup, INavStyles, Nav } from '@fluentui/react';
import React, { CSSProperties, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';
import { MessageBoxContext } from '../MessageBoxProvider';
import ajax from '../utils/ajax';
import { throttle } from 'lodash';

interface MenuProps {}

const Menu: React.FC<MenuProps> = ({ children }) => {

  const [packageLinks, setPackageLinks] = useState<INavLink[]>([]);
  const [cookies, setCookies, removeCookies] = useCookies(['token']);
  const [navWidth, setNavWidth] = useState<number>(150);
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

  const navStyle: Partial<INavStyles> = {
    root: {
      width: navWidth,
      height: '100vh',
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

  const resizeMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.clientX < 150 || Math.abs(navWidth - e.clientX) < 20) {
      return;
    }

    setNavWidth(e.clientX);
  };

  const styles: Record<string, CSSProperties> = {
    dragHandle: {
      cursor: 'ew-resize',
      float: 'left',
      width: 6,
      height: '100vh',
      userSelect: 'none',
    },
    rightSide: {
      left: navWidth
    }
  };


  return (
    <div style={{ overflow: 'hidden' }}>
      <Nav
        groups={groups}
        styles={navStyle}
        onLinkClick={handleLinkClick}
      />

      <div
        style={styles.dragHandle}
        draggable
        onDrag={throttle(resizeMenu, 100)}
      >
          &nbsp;
      </div>

      <div style={styles.rightSide}>
        {children}
      </div>
    </div>
  );
};

export default Menu;