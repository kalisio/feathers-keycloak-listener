# File: feathers-keycloak-listener/test/kApp.Dockerfile
#
# Used to create the "tmp/kapp" image used during the tests.
#
# Build context: feathers-keycloak-listener/.

FROM debian:10.8

# 1. STANDARD PACKAGES

RUN apt-get update --fix-missing

RUN apt-get install -y\
	apt-utils \
	curl \
	git \
	gnupg2 \
	libxml2-utils \
	software-properties-common


# 2. LOCALES

RUN apt-get install -y locales

RUN locale-gen "en_US.UTF-8"

RUN echo "LANG=en_US.UTF-8" >> /etc/default/locale
RUN echo "LC_ALL=en_US.UTF-8" >> /etc/default/locale


# 3. USERS

RUN useradd -m -s /bin/bash develop

USER develop
WORKDIR /home/develop


# 4. NVM, NODE, NPM, YARN

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

ENV NVM_DIR=/home/develop/.nvm

RUN . "${NVM_DIR}/nvm.sh" && nvm install 20

ENV NODE_VERSION="$(ls -1 /home/develop/.nvm/versions/node)"

RUN . "${NVM_DIR}/nvm.sh" && node -v # v20.12.0

RUN . "${NVM_DIR}/nvm.sh" && npm -v # 10.5.0

RUN . "${NVM_DIR}/nvm.sh" && npm install --global yarn

RUN . "${NVM_DIR}/nvm.sh" && yarn -v # 1.22.22


# 5. SOURCE CODE

WORKDIR /home/develop

RUN git clone https://github.com/kalisio/kdk.git

WORKDIR /home/develop/kdk

RUN . "${NVM_DIR}/nvm.sh" && yarn install

RUN . "${NVM_DIR}/nvm.sh" && yarn link

WORKDIR /home/develop

COPY --chown=develop lib feathers-keycloak-listener/lib/
COPY --chown=develop package.json feathers-keycloak-listener/

WORKDIR /home/develop/feathers-keycloak-listener

RUN . "${NVM_DIR}/nvm.sh" && yarn install

RUN . "${NVM_DIR}/nvm.sh" && yarn link

WORKDIR /home/develop

RUN git clone https://github.com/kalisio/kApp.git

WORKDIR /home/develop/kApp/api

RUN . "${NVM_DIR}/nvm.sh" && yarn install

RUN . "${NVM_DIR}/nvm.sh" && yarn link @kalisio/kdk
RUN . "${NVM_DIR}/nvm.sh" && yarn link @kalisio/feathers-keycloak-listener

WORKDIR /home/develop/kApp

RUN . "${NVM_DIR}/nvm.sh" && yarn install

RUN . "${NVM_DIR}/nvm.sh" && yarn link @kalisio/kdk


# 6. SCRIPTS

USER root
WORKDIR /home/develop

COPY test/scripts/start_api.sh .
COPY test/scripts/start_frontend.sh .

RUN chmod +x start_api.sh
RUN chmod +x start_frontend.sh

RUN chown develop:develop start_api.sh
RUN chown develop:develop start_frontend.sh


# 7. BUILDINFO

# COPY buildinfo /


# 9. END

USER develop
WORKDIR /home/develop
