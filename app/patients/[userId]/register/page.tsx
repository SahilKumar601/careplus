import RegisterForm from "@/components/forms/RegisterForms";
import { getUser } from "@/lib/actions/patients.action";
import Image from "next/image";
import Link from "next/link";

const Register = async({params:{userId}}:SearchParamProps) => {
  const user = await getUser(userId)
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

        <RegisterForm user={user}/>
        
         <p className="justify-items-end text-dark-600 xl:text-left">
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
export default Register;
