#!/usr/bin/env bash

# What type of build do you want to do? Push or Deploy?
# P: Push (Scratch Orgs with deltas)
# D: Deploy (Metadata API deploys without deltas)
MODE="P"

# Name output file
outputFile="Build.json"
# Make unique output file
# outputFile="Build-"`date '+%Y%m%d-%H%M'`".json"

# Command to execute
cmd=""
if [ ${MODE} = "P" ]; then
	cmd="sfdx force:source:push --json > ${outputFile} 2>&1"
elif [ ${MODE} = "D" ]; then
	# cmd="sfdx force:source:deploy --loglevel fatal --json --sourcepath ./force-app/main/default > ${outputFile} 2>&1"
	
	sandbox="dhDEX601"
	folders="./force-app/Exercises/"
	echo "FOLDERS: ${folders}"
	echo "SANDBOX: ${sandbox}"
	echo ""
	cmd='sfdx force:source:deploy --loglevel fatal --json --sourcepath "${folders}" --targetusername ${sandbox} > ${outputFile} 2>&1'
else 
	echo "What mode (2)?"
	exit 2;
fi

# Execute it!
if [ ${MODE} = "P" ]; then
	echo "BUILD (push) STARTED: "`date '+%Y-%b-%d %T %Z'`
elif [ ${MODE} = "D" ]; then
	echo "BUILD (deploy) STARTED: "`date '+%Y-%b-%d %T %Z'`
else 
	echo "What mode (1)?"
	exit 1;
fi
echo "${cmd}"
eval ${cmd}
exitCode=$?
# code "${outputFile}"
if [ ${MODE} = "P" ]; then
	echo "BUILD (push) COMPLETED: "`date '+%Y-%b-%d %T %Z'`
elif [ ${MODE} = "D" ]; then
	echo "BUILD (deploy) COMPLETED: "`date '+%Y-%b-%d %T %Z'`
else 
	echo "What mode (1)?"
	exit 5;
fi

# Show resutls
RED='\033[1;31m'
GREEN='\033[1;32m'
BLUE='\033[1;34m'
NO_COLOR='\033[0m'
if [ ${exitCode} != 0 ]; then
	echo -e "${RED}Errors during building!${NO_COLOR}"
	jq ".result[]" ${outputFile}
	echo -e "${RED}Errors during building!${NO_COLOR}"
else
	jsonSection=""
	if [ ${MODE} = "P" ]; then
		jsonSection="pushedSource"
	elif [ ${MODE} = "D" ]; then
		jsonSection="deployedSource"
	else 
		echo "What mode (3)?"
		exit 3;
	fi
	fileCount=`jq .result.${jsonSection} ${outputFile} | jq length`
	if [[ ${fileCount} -gt 0 ]]; then
		echo "Build Successful."
		if [ ${MODE} = "P" ]; then
			echo "${fileCount} file(s) PUSHED"
		elif [ ${MODE} = "D" ]; then
			echo "${fileCount} file(s) DEPLOYED"
		else 
			echo "What mode (4)?"
			exit 4;
		fi
		jq ".result.${jsonSection}[]" ${outputFile} | jq -r .filePath
	else
		echo -e "${GREEN}No changes made!${NO_COLOR}"
	fi
fi