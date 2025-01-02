import { Doctors } from "@/constant";
import { getAppointment } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";

const Success = async({params:{userId},searchParams}:SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string);
    const appointment = await getAppointment(appointmentId);

    const doctor = Doctors.find((doc)=> doc.name === appointment.primaryPhysician)
    return ( 
        <div className="flex h-screen max-h-screen px-[5%]">
          <div className="success-img">
            <Link
             href='/'
            >
                <Image
                 src='/assets/icons/logo-full.svg'
                 height={1000}
                 width={1000}
                 alt="logo"
                 className="h-10 w-fit"
                />
            </Link>

            <section className="flex flex-col items-center">
                <Image
                 src='/assets/gifs/success.gif'
                 height={400}
                 width={300}
                 alt="success"
                />
                <h2 className="header mb-6 max-w-[600px] text-center">
                    Your <span className="text-green-500">appointment request</span> has been successfully submitted.
                </h2>
                <p>We will be in touch shortly to confirm.</p>
            </section>
            <section className="request-details">
                <p>Request appointment details</p>
                <div className="flex items-center gap-3">

                </div>
            </section>
          </div>
        </div>
    );
}
 
export default Success;