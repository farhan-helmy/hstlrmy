import type { ReactElement } from "react";
import { AdminLayout } from "../../components/layout/admin";
import React from "react";
import type { NextPageWithLayout } from "../_app";
import Products from "../../components/admin/Products";

const AdminProduct: NextPageWithLayout = () => {
  return (
  <>
    <Products />
  </>
  )

}

AdminProduct.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>{page}</AdminLayout>
  )
};

export default AdminProduct;