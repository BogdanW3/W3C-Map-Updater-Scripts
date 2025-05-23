#!/bin/bash

# Exit the script if an error occurs.
set -e

mapExtractionPath="./maps/map.w3x"
cleanMapPath="./maps/w3c_maps/clean_maps"
outputMapPath="./maps/w3c_maps/output"
mpqPath="./MPQEditor.exe"
currentDateTime=$(date '+%y%m%d_%H%M')

rm -rf "$outputMapPath" && mkdir "$outputMapPath"

for fullPath in $(find $cleanMapPath -name '*.w3m' -or -name '*.w3x'); do
    fileName="$(basename $fullPath)"
    dirName="$(dirname $fullPath)"
    printf "$dirName\n"

    printf "Processing $fileName... \n\n"
    rm -rf "$mapExtractionPath" && mkdir "$mapExtractionPath"
    printf "Running command: \"$mpqPath\" extract \"$fullPath\" \"*\" \"$mapExtractionPath\" \"/fp\" \n"
    "$mpqPath" extract "$fullPath" "*" "$mapExtractionPath" "/fp"
    rm -rf dist/ && npm run build "$dirName"

    outpath=$outputMapPath

    if [[ $dirName == *"tournament" ]]; then
        outpath="${outputMapPath}/tournament"
    elif [[ $dirName == *"all-the-randoms" ]]; then
        outpath="${outputMapPath}/all-the-randoms"
    elif [[ $dirName == *"reign-of-chaos" ]]; then
        outpath="${outputMapPath}/reign-of-chaos"
    fi

    # Create the directory if it doesn't exist
    if [[ ! -e $outpath ]]; then
        mkdir "$outpath"
    fi

    printf "\nMoving map to $outpath/$fileName \n\n"
    mv "./maps/w3c_maps/map.w3x" "$outpath/w3c_${currentDateTime}_$fileName"
done

cleanMapsCount=$(find $cleanMapPath -name '*.w3m' -or -name '*.w3x' | wc -l)
completedMapsCount=$(find $outputMapPath -name '*.w3m' -or -name '*.w3x' | wc -l)
echo "Processed $cleanMapsCount maps and output $completedMapsCount maps."

echo "Map updates completed successfully."
