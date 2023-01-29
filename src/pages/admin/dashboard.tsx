import { AdminLayout } from "../../components/layout/admin";
import type { NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

Dashboard.getLayout = function (page) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Dashboard;