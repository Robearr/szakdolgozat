import { Stack, Text } from '@fluentui/react';
import React from 'react';
import { Link } from 'react-router-dom';

interface IndexProps {}

const IndexView: React.FC<IndexProps> = () => {
  return (
    <Stack style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Stack style={{ width: '40vw' }}>
        <h1>Automatikus funkcionális tesztelés</h1>
        <Text style={{ fontSize: 'large' }}>Ezen az oldalon le tudod tesztelni az előre elkészített tesztekkel vagy tesztcsomagokkal a saját webalkalmazásod!</Text>
        <Text style={{ fontSize: 'large' }}>A <Link to='/packages'>Tesztcsomagok</Link> menüpontra kattintva az összes tesztcsomag megtekinthető illetve futtatható.</Text>
        <Text style={{ fontSize: 'large' }}>Mindkét esetben egy új képernyő fog megjelenni, ahol már a tesztek is fel vannak sorolva, a hozzájuk tartozó eredményekkel.</Text>
        <Text style={{ fontSize: 'large' }}>Teszteket egyesével, vagy tömegesen is lehet futtatni, ugyanazon a csomagon belül.</Text>
      </Stack>
    </Stack>
  );
};

export default IndexView;