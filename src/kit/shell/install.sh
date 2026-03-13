#!/bin/bash
# Instalação básica do kit: marca os scripts como executáveis

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

chmod +x "$SCRIPT_DIR"/*.sh

echo "Todos os scripts em $SCRIPT_DIR foram marcados como executáveis."

echo "Opcional: adicione este diretório ao PATH para chamar diretamente (ex. export PATH=\"$SCRIPT_DIR:$PATH\")."
