# Execute in Mac using: ./EXFiles/scripts/CreateOrg.sh
echo "*** Creating scratch Org..."
sfdx force:org:create --definitionfile config/project-scratch-def.json --setalias LDS --setdefaultusername
echo "*** Opening scratch Org..."
sfdx force:org:open
echo "*** Pushing metadata to scratch Org..."
sfdx force:source:push
# echo "*** Assigning permission set to your user..."
sfdx force:user:permset:assign --permsetname LDS
# echo "*** Creating required users..."
# sfdx force:apex:execute -f EXFiles/data/CreateUsers.txt
# echo "*** Creating data using ETCopyData plugin"
sfdx ETCopyData:import -c ./@ELTORO.IT/data
