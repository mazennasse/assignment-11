import crypto from "node:crypto"
import { ENC_KEY, IV_LENGTH } from "../../config.js"
export const encrypt =async(plaintext)=>{
    const iv=crypto.randomBytes(IV_LENGTH)
    const cipher=crypto.createCipheriv("aes-256-cbc",ENC_KEY,iv)
    let encrypted =cipher.update(plaintext,"utf-8","hex")
    encrypted +=cipher.final("hex")
    return  `${iv.toString("hex")}::${encrypted}`

}
export const decrypt=async(encryptedData)=>{
    const[iv,encrypteddata]=encryptedData.split("::")
    const iv_decrypt=Buffer.from(iv,"hex")
    const decrypteddata=crypto.createDecipheriv("aes-256-cbc",ENC_KEY,iv_decrypt)
    let plaintext=decrypteddata.update(encrypteddata,"hex","utf-8")
    plaintext+=decrypteddata.final("utf-8")
    return plaintext
}