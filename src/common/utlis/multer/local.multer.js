import multer from "multer";
import {randomUUID} from "crypto"
import{ mkdir, unlink, writeFile} from "fs/promises"
import { resolve } from "path";
import { readFile } from "fs";
import {fileTypeFromBuffer} from "file-type"
import { BadExecption } from "../../execption/index.js"
import { object } from "zod";
import { ne } from "zod/locales";
import { error } from "console";
export const fileValidtion={
    image:["image/jpeg","image/png","image/gif"],
    files:["application/json","application/pdf"]
}


export const localFileUpload=({maxFileSize=5}={})=>{

    const storage=multer.memoryStorage()
    return multer({storage,limits:{fileSize:maxFileSize * 1024 * 1024}}) // we call filefilter first to check the extention require or not then call storage to save then size to detect size
}

export const processFile = async ({ customPath,file, validation = [] }) => {
    const result = await fileTypeFromBuffer(file.buffer)

    if (!result || !validation.includes(result.mime)) {
        throw BadExecption("invalid file format type")
    }

    return result
}

export const processFiles = async ({ customPath,files = [], validation = [] }) => {

    const validatedFiles = []

    for (const file of files) {

        const result = await processFile({customPath,file,validation})
         validatedFiles.push({file,result})
    }

    return validatedFiles
}

export const saveFile = async ({ customPath="general",file, result }) => {
    await mkdir(resolve(`./assets/${customPath}`),{recursive:true})
    const finalPath = `./assets/${customPath}/${randomUUID()}.${result.ext}`

    await writeFile(
        resolve(`./${finalPath}`),
        file.buffer
    )

    file.FinalPath = finalPath

    return file
}
export const saveFiles = async ({ customPath,files = [] }) => {

    const savedFiles = []

    try {

        for (const item of files) {

            const savedFile = await saveFile({
                customPath,
                file: item.file,
                result: item.result
            })

            savedFiles.push(savedFile)
        }

        return savedFiles

    } catch (error) {

        for (const file of savedFiles) {

            await unlink(
                resolve(`./${file.FinalPath}`)
            )
        }

        throw error
    }
}

export const processFileds = async ({customPath, fields = {}, validation = [] }) => {

    const uploadedFiles = []

    for (const field of Object.keys(fields)) {

        const filesuploaded = await processFiles({
            customPath,
            files: fields[field],
            validation
        })

        uploadedFiles.push({
            field,
            filesuploaded
        })
    }

    return uploadedFiles
}


export const processFileMulterUpload = async({req, customPath="general",validation = [] }) => {

   

        let validatedFiles = []
        let filesToSave = []

        try {

            
            if (req.file) {

                const result = await processFile({
                    customPath,
                    file: req.file,
                    validation
                })

                validatedFiles.push({
                    file: req.file,
                    result
                })

            } else if (Array.isArray(req.files)) {

                validatedFiles = await processFiles({
                    customPath,
                    files: req.files,
                    validation
                })

            } else if (
                typeof req.files === "object" &&
                Object.keys(req.files)?.length
            ) {

                validatedFiles = await processFileds({
                    customPath,
                    fields: req.files,
                    validation
                })
            }


           

            if (req.file) {

                filesToSave = validatedFiles

            } else if (Array.isArray(req.files)) {

                filesToSave = validatedFiles

            } else if (
                typeof req.files === "object" &&
                Object.keys(req.files)?.length
            ) {

                for (const field of validatedFiles) {

                    filesToSave.push(...field.filesuploaded)

                }
            }


          

            const savedFiles = await saveFiles({
                customPath,
                files: filesToSave
            })



            

        } catch (error) {

          throw error
        }
    
}

