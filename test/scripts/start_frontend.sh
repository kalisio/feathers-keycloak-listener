#!/bin/sh

# File: feathers-keycloak-listener/test/scripts/start_frontend.sh
#
# When running the Docker container, just do:
#
#     $ docker run -p 8080:8080 \
#              -e PORT=8081 \
#              tmp/kapp ./start_frontend.sh
#

set -e

echo "NVM_DIR: ${NVM_DIR}"

. "${NVM_DIR}/nvm.sh"

cd /home/develop/kApp

yarn dev
