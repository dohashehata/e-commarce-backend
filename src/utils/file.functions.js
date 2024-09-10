// import path from 'path'
// import fs from 'fs'
// export const deleteFile =(filepath)=>{
//     let fullPath= path.resolve(filepath)
// fs.unlinkSync(fullPath)
// }


export const deleteFile = (filepath) => {
    try {
        let fullPath = path.resolve(filepath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);  // Delete the file
        } else {
            console.warn(`File not found: ${fullPath}`);
        }
    } catch (err) {
        console.error(`Error deleting file: ${err.message}`);
    }
}

