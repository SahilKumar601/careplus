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
import { PatientFormValidation } from "@/lib/Vaildation";
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

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });
  const onSubmit = async (values : z.infer<typeof PatientFormValidation>) => {
    setisLoading(true);
    let formData;
    if(values.identificationDocument && values.identificationDocument.length>0){
      const blob = new Blob([values.identificationDocument[0]],{type:values.identificationType})
      formData = new FormData();
      formData.append('blobFile',blob);
      formData.append('fileName',values.identificationDocument[0].name);
    }
    try {
      const patientData={
        ...values,
        userId:user.$id,
        birthDate:new Date(values.birthDate),
        identificationDocument:formData
      }
      // @ts-ignore
      const patient = await registerUser(patientData);
      if(patient){
        router.push(`/patients/${user.$id}/new-appointment`)
      }  
    } catch (error) {
      console.log(error);
    }
    setisLoading(false);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information.</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Birth Date"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((options) => (
                    <div key={options} className="radio-group">
                      <RadioGroupItem value={options} id={options} />
                      <Label htmlFor={options} className="cursor-pointer">
                        {options}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
        <div className="flex felx-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="177A Bleecker Street, Manhattan, New York City"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Doctor"
          />
        </div>
        <div className="flex felx-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian Name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(555) 123-4567"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information.</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select your Physician"
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
        <div className="flex flex-col gap-2 xl:flex-row">
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="allergies"
            label="Allergies (If any)"
            placeholder="Peanuts, Mushrooms, etc.."
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="currentMedication"
            label="Current Medications"
            placeholder="Write any Medication you follow"
          />
        </div>
        <div className="flex flex-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="LIC Life Insurance"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="(888)XXX"
          />
        </div>
        <div className="flex felx-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Mention any previous Medical History"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History (If any)"
            placeholder="Mention any family Medical History"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <div className="flex felx-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select Document Type"
          >
            {[
              IdentificationTypes.map((types) => (
                <SelectItem key={types} value={types}>
                  {types}
                </SelectItem>
              )),
            ]}
          </CustomFormField>
        </div>
        <div className="flex felx-col gap-2 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="7888 84XX XXXX"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploder files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment to my health condition"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use of disclosure to my information for treatment purposes"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I reviewed and agree to the privacy policy"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
