
import AppointmentForms from "@/components/forms/AppointmentsForms";
import { getPatient, getUser } from "@/lib/actions/patients.action";
import Image from "next/image";
import Link from "next/link";

const Appointment = async({params:{userId}}:SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
    <section className="remove-scrollbar container">
      <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
        <Image
          src='/assets/icons/logo-full.svg'
          height={1000}
          width={1000}
          alt='patient'
          className="mb-12 h-10 w-fit"
        />
         <AppointmentForms type='create' userId={userId} patientId={patient?.$id} />
         <p className="copyright mt-10 py-12">
          ©2024 CarePlus  
         </p>
      </div>
    </section>
    <Image
      src='/assets/images/register-img.png'
      height={1000}
      width={1000}
      alt="patient"
      className="side-img max-w-[30%]"
    />
  </div>
  )
}
export default Appointment;
