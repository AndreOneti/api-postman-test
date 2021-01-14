#!/bin/bash

#################################################################################################
#
# Author: Andre Luiz Oneti Carvalho (andreluiz@gea.inatel.br)
#
# Description: Script to test postman collections
#
#################################################################################################

exec_checkNewman() {
  which newman >/dev/null 2>&1
  if [ "$?" = "1" ]; then
    echo "[ ERROR ] Require newman installed to run regression tests - To install: 'npm install newman --global' "
    exit 0
  fi
}

verifyInputs() {
  if [ -z $1 ]; then
    echo "[ ERROR ] collection folder is required as argument"
    exit 0
  fi

  COLLECTIONS=$1
}

verifyInputs $1
exec_checkNewman

DATE_REPORT=`date +%Y-%m-%d_%H-%M-%S`
ROOT=`pwd`
LOG=$ROOT/result
FAILED_DIR=$LOG/failedCollections
HTML_JSON=$FAILED_DIR/html-json
TOTAL_DIR_ALLOW=1
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
YELLOW=$(tput setaf 3)
RESET=$(tput sgr0)

mkdir -p $LOG        # in case it is the first time on a particular server
mkdir -p $HTML_JSON
rm -f $LOG/*.json $LOG/*.html $LOG/*.xml $LOG/*.log $LOG/skipFiles.txt

#-------------------------------------------------------------------------------
runOne(){
	#runs a Postman collection
	#parameter 1: collection name
	collection=$1
	number=${collection:2:1}
	baseName=${collection%_postman_collection.json}
	baseName=${baseName%.postman_collection.json}
	name=${baseName:2}
	displayName=$number" "$name

	echo ------------------------------------------------------------------------------------------- | tee $LOG/result.log

	echo -e "Collection: " $displayName	$(date +'%F %H:%M:%S.%3N') | tee -a $LOG/result.log
	# get author and date of last commit
	commitInfo=$(git log -1 --date=short --pretty=format:"Last commit by %an on %ad" -- $collection)
	echo $commitInfo | tee -a $LOG/result.log
	# newman run "$collection" -e $POSTMAN/Environment.json --suppress-exit-code --reporters cli,html,json,junit --reporter-json-export "$LOG/$name.json" --reporter-junit-export "$LOG/$name.xml" --reporter-html-export "$LOG/$name.html" | tee -a $LOG/result.log
	newman run "$collection" --suppress-exit-code --reporters cli,html,json,junit --reporter-json-export "$LOG/$name.json" --reporter-junit-export "$LOG/$name.xml" --reporter-html-export "$LOG/$name.html" | tee -a $LOG/result.log
	echo -e Done with $displayName	$(date +'%F %H:%M:%S.%3N') | tee -a $LOG/result.log

    failedNum=$(egrep 'AssertionFailure|TypeError|SyntaxError' $LOG/result.log  | grep -v "in test-script" | wc -l)
    if [ ! -z "$failedNum" ] && [ "$failedNum" != 0 ]
	  then
	    cp $LOG/$name.html $LOG/$name.json $HTML_JSON/
	    name_mod=$(echo $name | awk -F '.postman_collection' '{print $1}')
		namenoslash=$(echo $name | awk -F/ '{print $NF}')
	    cp $LOG/result.log $FAILED_DIR/"$namenoslash".error
		echo " - "$name_mod" - TOTAL FAILED: $failedNum" >> $FAILED_DIR/000_COLLECTIONS_FAILED_SUMMARY_"$DATE_REPORT".log
    fi

	cat $LOG/result.log >> $LOG/console.log
}
#-------------------------------------------------------------------------------
#run all collections
rm -f $LOG/fileList.txt

cd $COLLECTIONS
find -type f -name "*"  | sort | while read pathName
do
   pattern=" |'"
   if [[ "$pathName" =~ $pattern ]]
     then
      echo " .. FILE NAME WITH SPACE IN PATH NOT PROCESSED: $pathName" >> $LOG/skipFiles.txt
      continue
   fi
	echo $(basename "$pathName")$'\t'$pathName >> $LOG/fileList.txt
done
sort $LOG/fileList.txt | while read line
do
	nIndex=`expr index "$line" $'\t'`
	runOne ${line:$nIndex}
done
echo "" >> $FAILED_DIR/000_COLLECTIONS_FAILED_SUMMARY_"$DATE_REPORT".log
