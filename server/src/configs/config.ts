require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

export const applicationConfig = {
    PORT: process.env.PORT || 8080,
    MONGODB_URI: process.env.MONGODB_URI || 'localhost://27017',
    HOST: process.env.HOST || 'localhost',
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'asfndklasnkld23',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'fasdfasasdf32',
    ORIGIN: process.env.ORIGIN || 'http://localhost:3000',
    ENV: process.env.ENV || 'dev'
}