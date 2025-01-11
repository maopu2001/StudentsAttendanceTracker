/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare namespace NodeJS {
  export interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET_KEY: string;
  }
}
