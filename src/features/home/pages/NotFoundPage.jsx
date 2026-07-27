import { Link } from 'react-router-dom';
import { Button } from '../../../shared/components';

export const NotFoundPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center', padding: 24 }}>
    <h1 style={{ fontSize: 32 }}>Esta página se perdió en el camino</h1>
    <p style={{ color: 'var(--color-ink-soft)', maxWidth: 360 }}>
      No encontramos lo que buscas. Volvamos a un lugar conocido.
    </p>
    <Link to="/">
      <Button>Ir al inicio</Button>
    </Link>
  </div>
);
