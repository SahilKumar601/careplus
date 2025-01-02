'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, Database, DB_ID} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const new_appointment = await Database.createDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );
    return parseStringify(new_appointment);
  } catch (error) {
    console.error(error);
  }
};
export const getAppointment = async (appointmentId:string)=>{
  try {
    const appointment  = await Database.getDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
    )
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
}
