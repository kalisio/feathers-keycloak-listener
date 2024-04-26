#!/bin/sh

# File: feathers-keycloak-listener/test/scripts/get_new_access_token.sh
#
# Run this script from the ./test directory, when a cache.json file is present,
# so it can obtain a new access token, linked to the new user, to perform tests.
#
# Usage:
#
#    ./scripts/get_new_access_token.sh
#

set -e

if [ ! -f cache.json ]; then
	echo "*** ERROR. A cache.json file should be present." >&2
	echo "    Maybe run \"npx mocha keycloak_create_new_user.js\" prior to running this script." >&2
	echo "    Exiting." >&2
	exit 1	
fi

# NEW_EMAIL=`cat cache.json | grep -o newEmail[^,]*, | sed s/.*:// | sed s/.// | sed s/\".*//`
# NEW_PASSWORD_IN_KAPP=`cat cache.json | grep -o newPasswordInKApp[^,]*, | sed s/.*:// | sed s/.// | sed s/\".*//`

NEW_EMAIL=`jq -r .newEmail cache.json`
NEW_PASSWORD_IN_KAPP=`jq -r .newPasswordInKApp cache.json`

echo "NEW_EMAIL: ${NEW_EMAIL}"
echo "NEW_PASSWORD_IN_KAPP: ${NEW_PASSWORD_IN_KAPP}"

KAPP_ACCESS_TOKEN2=`curl --location 'http://localhost:8082/api/authentication' \
     --header 'Content-Type: application/json' \
     --data-raw "{
         \"strategy\": \"local\",
         \"email\": \"${NEW_EMAIL}\",
         \"password\": \"${NEW_PASSWORD_IN_KAPP}\"
     }" \
  | jq -r .accessToken`
  
echo "KAPP_ACCESS_TOKEN2: ${KAPP_ACCESS_TOKEN2}"
