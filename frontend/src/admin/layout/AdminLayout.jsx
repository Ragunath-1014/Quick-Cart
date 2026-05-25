import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function AdminLayout() {
    return (
        <div className="flex h-screen overflow-hidden">

            {/* SIDEBAR */}
            <Sidebar />

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;