"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/Vaildation";
import { useRouter } from "next/navigation";
import { createUser, registerUser } from "@/lib/actions/patients.action";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constant";
import { Label } from "../ui/label";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import FileUploder from "../FileUploder";
import { createAppointment, updateAppointment} from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";
export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const AppointmentForms = ({ type,userId,patientId,appointment,setOpen}: { 
    type: 'create'|'cancel'|'schedule';
    userId:string;
    patientId:string;
    appointment?:Appointment;
    setOpen : (open:boolean) => void;
 }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const AppointmentFormVaildation = getAppointmentSchema(type)
  const form = useForm<z.infer<typeof AppointmentFormVaildation>>({
    resolver: zodResolver(AppointmentFormVaildation),
    defaultValues: {
      primaryPhysician: appointment && appointment.primaryPhysician,
      schedule: appointment ? new Date(appointment.schedule): new Date(),
      reason: appointment ? appointment.reason : "",
      note: appointment ? appointment.note : "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });
  const onSubmit = async (values : z.infer<typeof AppointmentFormVaildation>) => {
    setisLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
    }
    try {
      if(type==='create' && patientId){
        const appointmentData={
          userId,
          patient:patientId,
          primaryPhysician:values.primaryPhysician,
          reason:values.reason!,
          schedule:new Date(values.schedule),
          note:values.note,
          status:status as Status
        }
        const appointment = await createAppointment(appointmentData);
        if(appointment){
          form.reset();
          router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      }else{
        const appointmentUpdate = {
          userId,
          appointmentId:appointment?.$id!,
          appointment:{
            primaryPhysician:values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status:status as Status,
            cancellationReason:values?.cancellationReason
          },
          type,
        }
        const updatedAppointment = await updateAppointment(appointmentUpdate);
        if(updatedAppointment){
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setisLoading(false);
  };
  let buttonlabel;
  switch (type) {
    case "cancel":
      buttonlabel='Cancel Appointment';
      break;
    case 'create':
      buttonlabel='Create Appointment';
      break;
    case 'schedule':
      buttonlabel='Schedule Appointment';
      break;
    default:
      break;
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-6"
      >
        {type === 'create' && <section className="space-y-4">
          <h1 className="header">Hi, There 👋</h1>
          <p className="text-dark-700">Let book your Appointment within 10sec.</p>
        </section>}
        {type !== 'cancel' && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label='Doctor'
              placeholder="Select a Doctor"
            >
              {Doctors.map((doc,i) => (
              <SelectItem key={doc.name+i} value={doc.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doc.image}
                    width={24}
                    height={24}
                    alt={doc.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doc.name}</p>
                </div>
              </SelectItem>
            ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label="Expected Appointment Date"
              showTimeSelect
              dateFormat="DD/MM/YYYY h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='reason'
                label="Purpose of visit"
                placeholder="Enter the reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Notes"
                placeholder="Enter Notes"
              />
            </div>
          </>
        )}
        {type==='cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter the Reason for cancellation"
          />
        )}
        <SubmitButton className={`${type === "cancel" ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`} isLoading={isLoading}>{buttonlabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForms;
