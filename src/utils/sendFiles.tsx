export type dictionary = {[key: string]: string};
type FileHashMap = Record<string, string>; // { key :fileHash = value: relativePath }

// function to find files to send FROM source TO destination
export function sendFiles(src: FileHashMap, dst: FileHashMap): [dictionary, dictionary] {
    const filesToSend: dictionary = {};
    const filesToDelete: dictionary = {};

    //reverse lookup
    const dstPathToHash: dictionary = Object.fromEntries(
        Object.entries(dst).map(([hash, path]) => [path, hash])
    );


    Object.entries(src).forEach(([key, value]) => {
        // if key is in destination
        if (key in dst) {
            if (src[key] !== dst[key]){
                // file is present but must be moved (for atomicity, delete file in dst and send file with new location)
                filesToSend[key] = value;
                filesToDelete[key] = dst[key];
            }
        }
        else{
            //src key is not in dst
            //check if there is a file path and name match
            if (value in dstPathToHash){
                const existingHash = dstPathToHash[value];
                filesToSend[key] = value;
                filesToDelete[existingHash] = value; // Remove the old version
            }else{
                //file is new to the best of our knowledge
                filesToSend[key] = value
            }

        }

    })
    return ([filesToSend, filesToDelete])
}