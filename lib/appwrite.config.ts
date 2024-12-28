import * as sdk from 'node-appwrite';
export const {
    PROJECT_ID,
    API_KEY,
    DB_ID,
    PATIENTS_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_ENDPOINT:ENDPOINT,
} = process.env;

const client = new  sdk.Client();

client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!)

export const Database = new sdk.Databases(client);
export const Storage = new sdk.Storage(client);
export const User = new sdk.Users(client);
export const Messaging = new sdk.Messaging(client);