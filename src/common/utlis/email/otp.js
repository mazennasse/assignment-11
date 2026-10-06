import {randomInt} from "node:crypto"
export const createOTP=()=>{
    return randomInt(
        100000,
        1000000
    ).toString()
}