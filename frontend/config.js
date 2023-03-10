import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const API = publicRuntimeConfig.PRODUCTION ? publicRuntimeConfig.API_PRODUCTION : publicRuntimeConfig.API_DEVELOPMENT;
export const TRY = 'http://localhost:8000';
export const APP_NAME = publicRuntimeConfig.APP_NAME;