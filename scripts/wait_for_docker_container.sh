#!/bin/sh

# File: feathers-keycloak-listener/scripts/wait_for_docker_container.sh
#
# Usage:
#
#     $ wait_for_docker_container.sh <containerId> <logMessage>
#
# Example:
#
#     $ wait_for_docker_container.sh selenium "Started Selenium Standalone"
#
# This script will wait a maximum of 30 seconds for a given message to appear in
# the logs of a given running Docker container.
# Its purpose is to prevent CI jobs to fail because a container didn’t have time
# to start its services properly, and to help debug the CI jobs by providing
# the last 10 lines from the logs of each container.
#

containerId="${1}"
logMessage="${2}"

echo "${containerId}:"

LOOP=xxxxxx # Wait for 6 x 5 seconds

while [ -n "${LOOP}" ]; do

    echo "..."

    echo -n "... " && date

    echo "..."

    if docker logs -n 10 "${containerId}" | grep -q "${logMessage}"; then

         LOOP=

    else

        sleep 5;

        LOOP=`echo $LOOP | cut -c 2-`

    fi

done

echo "..."

docker logs -n 10 "${containerId}"
