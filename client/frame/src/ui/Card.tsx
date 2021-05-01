import React, { CSSProperties } from 'react';

interface CardHeaderProps {}
interface CardBodyProps {}
interface CardFooterProps {}
interface CardChildren {
  Header: React.FC<CardHeaderProps>,
  Body: React.FC<CardBodyProps>,
  Footer: React.FC<CardFooterProps>
}
interface CardProps {}


const Header: React.FC<CardHeaderProps> = ({ children }) => {
  return (
    <div style={styles.header}>{children}</div>
  );
};

const Body: React.FC<CardBodyProps> = ({ children }) => {
  return (
    <div style={styles.body}>{children}</div>
  );
};

const Footer: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <div style={styles.footer}>{children}</div>
  );
};


const Card: React.FC<CardProps> & CardChildren = ({ children }) => {
  return (
    <div style={styles.card}>
      {React.Children.map(children, (child) => (
        //@ts-ignore
        ['CardHeader', 'CardBody', 'CardFooter'].includes(child?.type?.displayName) ? child : null
      ))}
    </div>
  );
};

Header.displayName = 'CardHeader';
Body.displayName = 'CardBody';
Footer.displayName = 'CardFooter';

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

const styles: Record<string, CSSProperties> = {
  card: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    height: '50vh',
    overflow: 'auto'
  },
  header: {
    alignSelf: 'center',
    borderBottom: '1px solid black',
    textAlign: 'center',
    marginBottom: '1vh',
    width: '80%'
  },
  body: {},
  footer: {
    flex: 1
  }
};

export default Card;