import bcrypt from "bcrypt"
export const hash=async(palintext,rounds=12,minor="b")=>{
    const salt=await bcrypt.genSalt(rounds,minor)
    return await bcrypt.hash(palintext,salt)
}

export const compare=async(plaintext,ciphertext)=>{
    return await bcrypt.compare(plaintext,ciphertext)
}