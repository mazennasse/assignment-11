import { config } from "dotenv";
import { resolve } from "path";

export const NODE_ENV = process.env.NODE_ENV ?? "development";

config({
    path: resolve(`.env.${NODE_ENV}`)
});

export const PORT = parseInt(process.env.PORT ?? "9000");
export const DB_URI=process.env.DB_URI
export const ENC_KEY = Buffer.from(
    process.env.ENC_KEY,
    "hex"
)

export const IV_LENGTH = parseInt(
    process.env.IV_LENGTH ?? "16"
)

export const ACCESS_USER_TOKEN_SIGNTURE=process.env.ACCESS_USER_TOKEN_SIGNTURE
export const ACCESS_ADMIN_TOKEN_SIGNTURE=process.env.ACCESS_ADMIN_TOKEN_SIGNTURE
export const REFRESH_ADMIN_TOKEN_SIGNTURE=process.env.REFRESH_ADMIN_TOKEN_SIGNTURE
export const REFRESH_USER_TOKEN_SIGNTURE=process.env.REFRESH_USER_TOKEN_SIGNTURE


export const  ACCESS_TOKEN_EXPIRES_IN= parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1800");
export const  REFRESH_TOKEN_EXPIRES_IN= parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? "31536000");


export const WEB_CLIENT_IDS=process.env.WEB_CLIENT_IDS.split(",")

export const REDIS_URI=process.env.REDIS_URI


export const APP_PASSWORD=process.env.APP_PASSWORD
export const APP_EMAIL=process.env.APP_EMAIL


export const INSTGRAM_LINK=process.env.INSTGRAM_LINK
export const TWITTER_LINK=process.env.TWITTER_LINK
export const FACEBOOK_LINK=process.env.FACEBOOK_LINK