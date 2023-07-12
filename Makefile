clean:
	echo "Provide the Clean command like mvn clean/rm -rf /repo/target/*"

compile:
	echo "Provide the Compile command like mvn compile"

prerequisites:
	echo "Provide the Pre-requisite commands before performing the PoP analysis scan like installing some required tools, install/download some required things."
	npm --version
	npm config set '//registry.synopsys.npme.io/:_authToken' ${NPM_TOKEN}
	npm i -g lerna
ifdef ${POP_BLACKDUCK_INPROGRESS}
	cd synopsys-task && npm ci --prefer-offline --no-audit && npm run build
else
	npm ci --prefer-offline --no-audit
	npm run build
endif

build: prerequisites
	echo "Provide the Build command like mvn install / go build / npm "

dependencies: prerequisites
	echo "Provide the Dependency command or env variables"
ifdef ${POP_BLACKDUCK_INPROGRESS}
	cd synopsys-task && npm run package
else
	npm run package
endif

image_scan:
	echo "Provide the commands for BD Docker Image Scan"

.PHONY: clean
