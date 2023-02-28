import Stats from "../../components/admin/Stats";
import { AdminLayout } from "../../components/layout/admin";
import type { NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div>
      <Stats />
    </div>
  );
};

Dashboard.getLayout = function (page) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Dashboard;