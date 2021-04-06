#!/bin/sh

if [ ! -z ${API_BASE} ]; then
  whoami
  ls -l build
cat <<END >> build/env.js
window.RUNTIME_API_BASE='${API_BASE}';
END
fi

serve -s /usr/src/app/build -d
