clean:
	echo "Provide the Clean command like mvn clean/rm -rf /repo/target/*"

compile:
	echo "Provide the Compile command like mvn compile"


build:
	echo "Provide the Build command like mvn install / go build / npm "

dependencies:
	echo "change directory to synopsys-task"
ifdef POP_BLACKDUCK_INPROGRESS
	cd synopsys-task
endif

image_scan:
	echo "Provide the commands for BD Docker Image Scan"

.PHONY: clean
