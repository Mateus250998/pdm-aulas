import React, { useState } from 'react';

import { TelaLogin } from './screens/TelaLogin';
import { TelaPrincipal } from './screens/TelaPrincipal';

export function NavegadorPrincipal() {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  function entrar(usuario) {
    setUsuarioAutenticado(usuario);
  }

  function sair() {
    setUsuarioAutenticado(null);
  }

  if (!usuarioAutenticado) {
    return <TelaLogin aoEntrar={entrar} />;
  }

  return (
    <TelaPrincipal
      usuario={usuarioAutenticado}
      aoSair={sair}
    />
  );
}