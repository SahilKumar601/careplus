'use server'
import { Databases, ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, Database, DB_ID, Messaging} from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

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
export const getRecentAppointments = async ()=>{
  try {
    const appointments = await Database.listDocuments(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc('$createdAt')]
    );
    const intialCounts={
      scheduleCounts:0,
      pendingCounts:0,
      cancelledCounts:0
    }
    const counts = (appointments.documents as Appointment[]).reduce((acc,appointment)=>{
      if(appointment.status === 'scheduled'){
        acc.scheduleCounts++;
      }
      if(appointment.status === 'pending'){
        acc.pendingCounts++;
      }
      if(appointment.status === 'cancelled'){
        acc.cancelledCounts++;
      }
      return acc; 
    },intialCounts)
    const data={
      totalCount:appointments.total,
      ...counts,
      document:appointments.documents,
    }

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
}
export const updateAppointment = async({appointmentId,userId,appointment,type}:UpdateAppointmentParams)=>{
  try {
    const updateAppointment = await Database.updateDocument(
      DB_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    )
    if(!updateAppointment){
      throw new Error("Appointment not found");
    }
    
    const smsMessage = `Hi, It's CarePlus, ${type==='schedule' ? `Your Appointment on ${formatDateTime(appointment.schedule!).dateTime} with Doctor ${appointment.primaryPhysician}.`
      :`We regret to inform you that your appointment has been cancelled for the reason ${appointment.cancellationReason}.`
    }`
    await sendSms(userId,smsMessage);
    revalidatePath('/admin');
    return parseStringify(updateAppointment);
  } catch (error) {
    console.log(error);
  }
} 
export const sendSms = async (userId:string,content:string)=>{
  try {
    const message = await Messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    )
    return parseStringify(message);
  } catch (error) {
    console.log(error);
  }
}