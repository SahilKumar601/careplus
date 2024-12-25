"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
export enum FormFieldType{
    INPUT = 'input',
    PHONE_INPUT = 'phoneInput',
    TEXTAREA = 'textarea',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
} 
 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})
 
const PatientForm = () => {
  const [isLoading, setisLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return(
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
                <h1 className="header">Hi There 👋</h1>
                <p className="text-dark-700">Shedule your first appointment</p>
            </section>
            <CustomFormField 
             control={form.control}
             fieldType={FormFieldType.INPUT}
             name="name"
             label='Full Name'
             placeholder="Enter your name"
             icon='/assets/icons/user.svg'
             iconAlt='User Image' 
            />
            <CustomFormField 
             control={form.control}
             fieldType={FormFieldType.INPUT}
             name="email"
             label='Email'
             placeholder="example@example.com"
             icon='/assets/icons/email.svg'
             iconAlt='emaild icon' 
            />
            <CustomFormField 
             control={form.control}
             fieldType={FormFieldType.PHONE_INPUT}
             name="Phone No."
             label='Phone Number'
             placeholder="+91 8887777XXX" 
            />
          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
        </Form>
  </>
  )
}
 
export default PatientForm;