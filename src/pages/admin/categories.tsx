import { AdminLayout } from "../../components/layout/admin";
import type { NextPageWithLayout } from "../_app";

const Categories: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Categories</h1>
      <div>
        <span className="relative isolate inline-flex items-center justify-center">
          <span className="animate-scale absolute z-0 h-8 w-8 rounded-full bg-indigo-400/60"></span>
          <span className="animate-scale animation-delay-1000 absolute z-10 h-8 w-8 rounded-full bg-indigo-400/60"></span>
        </span>
      </div>
  </div>
  );
}

Categories.getLayout = function (page) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default Categories;