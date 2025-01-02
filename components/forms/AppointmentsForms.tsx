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
export enum FormFieldType {
  INPUT = "input",
  PHONE_INPUT = "phoneInput",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const AppointmentForms = ({ type,userId,patientId }: { 
    type: 'create'|'cancel'|'schedule',
    userId:string,
    patientId:string,
 }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const AppointmentFormVaildation = getAppointmentSchema(type)
  const form = useForm<z.infer<typeof AppointmentFormVaildation>>({
    resolver: zodResolver(AppointmentFormVaildation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
    },
  });
  const onSubmit = async (values : z.infer<typeof AppointmentFormVaildation>) => {
    setisLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status='schedule'
        break;
      case 'create':
        status='create'
        break;
      case 'cancel':
        status='cancel'
        break;
      default:
        status='pending'
        break;
    }
    try {
      if(type==='create' && patientId){
        const appointmentData={
          userId,
          patient:patientId,
          primaryPhysician:values.primaryPhysician,
          reason:values.reason,
          schedule:new Date(values.schedule),
          note:values.note,
          status:status as Status
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
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Hi, There 👋</h1>
          <p className="text-dark-700">Let book your Appointment within 10sec.</p>
        </section> 
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
