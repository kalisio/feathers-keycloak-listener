#!/bin/sh

# File: feathers-keycloak-listener/test/scripts/start_api.sh
#
# When running the Docker container, just do:
#
#     $ docker run -p 8081:8081 \
#              -e DB_URL=mongodb://172.17.0.1:27017/kapp \
#              tmp/kapp ./start_api.sh
#

set -e

echo "NVM_DIR: ${NVM_DIR}"

. "${NVM_DIR}/nvm.sh"

cd /home/develop/kApp/api

if [ -n "${KEYCLOAK_URL}" ]; then # e.g. KEYCLOAK_URL=http://localhost:8080/

	KEYCLOAK_URL_ESCAPED=`echo "${KEYCLOAK_URL}" | sed s/\\\//\\\\\\\\\\\//g`

	# e.g. The following:
	#
	# authorize_url: 'https://keycloak.portal.kalisio.com/realms/Kalisio/protocol/openid-connect/auth',
	# access_url: 'https://keycloak.portal.kalisio.com/realms/Kalisio/protocol/openid-connect/token',
	# profile_url: 'https://keycloak.portal.kalisio.com/realms/Kalisio/protocol/openid-connect/userinfo',
	#
	# become:
	#
	# authorize_url: 'http://localhost:8080/realms/Kalisio/protocol/openid-connect/auth',
	# access_url: 'http://localhost:8080/realms/Kalisio/protocol/openid-connect/token',
	# profile_url: 'http://localhost:8080/realms/Kalisio/protocol/openid-connect/userinfo',
	#
	sed -i s/https:\\\/\\\/keycloak\.portal\.kalisio\.com\\\//${KEYCLOAK_URL_ESCAPED}/ \
		config/default.cjs

fi

if [ -n "${SERVICES_JS_FILE}" ]; then # e.g. SERVICES_JS_FILE=/opt/kApp/api/src/services.js

	cp "${SERVICES_JS_FILE}" src/services.js

fi

yarn dev
