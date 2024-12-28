"use server";
import { ID, Query } from "node-appwrite";
import { BUCKET_ID, Database, DB_ID, ENDPOINT, PATIENTS_COLLECTION_ID, PROJECT_ID, Storage, User } from "../appwrite.config";
import { parseStringify } from "../utils";
import {InputFile} from 'node-appwrite'
export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await User.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newUser);
  } catch (error: any) {
    if (error && error?.code === 409) {
      const docs = await User.list([Query.equal("email", [user.email])]);
      return docs?.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};
export const getUser = async (userId: string) => {
  try {
    const user = await User.get(userId);
    return parseStringify(user);
  }catch (error) {
    console.log(error);
  }
};
export const registerUser = async ({identificationDocument,...patient}:RegisterUserParams)=>{
  try {
    let file;
    if(identificationDocument){
      const inputFile = InputFile.fromBlob(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string 
      )
      file = await Storage.createFile(BUCKET_ID!,ID.unique(),inputFile)
    }
    const new_patient = await Database.createDocument(
      DB_ID!,
      PATIENTS_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId:file?.$id || null,
        identificationDocumentUrl:`${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
        ...patient
      }
    )
    return parseStringify(new_patient);
  } catch (error) {
    console.log(error)
  }
}