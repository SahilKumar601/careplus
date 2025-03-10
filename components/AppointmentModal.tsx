import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import clsx from "clsx";
import { Appointment } from "@/types/appwrite.types";
import AppointmentForms from "./forms/AppointmentsForms";

const AppointmentModal = ({
    type,
    patientId,
    userId,
    appointment,
}:{
    type:'schedule' | 'cancel',
    patientId:string,
    userId:string,
    appointment?:Appointment,

}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant='ghost' className={`capitalize ${type === 'schedule' && 'text-green-500'}`}>
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader  className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointments</DialogTitle>
          <DialogDescription>
            Please fill in the following information about details to {type} appointments
          </DialogDescription>
        </DialogHeader>
        <AppointmentForms 
         userId={userId}
         patientId={patientId}
         type={type}
         appointment={appointment}
         setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
