import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <div>
            <Dashboard />
        </div>
    )
}