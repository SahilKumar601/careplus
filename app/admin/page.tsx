import {DataTable} from "@/components/table/DataTable";
import {StatCard} from "@/components/statCard";
import { columns } from "@/components/table/Columns";
import { getRecentAppointments } from "@/lib/actions/appointment.action";
import Image from "next/image";
import Link from "next/link";

const Admin = async() => {
    const appointments = await getRecentAppointments();
    return ( 
        <div className="mx-auto max-w-7xl flex-col space-y-14">
            <header className="admin-header">
                <Link href='/' className="cursor-pointer">
                    <Image
                     src='/assets/icons/logo-full.svg'
                     height={32}
                     width={126}
                     alt='icon'
                     className="h-8 w-fit"
                    />
                </Link>
                <p className="text-16-semibold">Admin Dashboard</p>
            </header>
            <main className="admin-main">
                <section className="w-full space-y-4">
                    <h1 className="header">Welcome,Admin 👋</h1>
                    <p className="text-dark-700">Start the day by managing new appointments</p>
                </section>
                <section className="admin-stat">
                    <StatCard
                     type='appointments'
                     count={appointments.scheduleCounts}
                     label='Scheduled Appointments'
                     icon='/assets/icons/appointments.svg'
                    />
                    <StatCard
                     type='pending'
                     count={appointments.pendingCounts}
                     label='Pending Appointments' 
                     icon='/assets/icons/pending.svg'
                    />
                    <StatCard
                     type='cancelled'
                     count={appointments.cancelledCounts}
                     label='Cancelled Appointments'
                     icon='/assets/icons/cancelled.svg'
                    />
                </section>
                <DataTable columns={columns} data={appointments.document} />
            </main>
        </div>
    );
}
 
export default Admin;