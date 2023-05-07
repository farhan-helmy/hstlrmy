import { type NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import NavBar from "../components/NavBar";
import Notification from "../components/Notification";

import useNotificationStore from "../store/notification";
import BannerSlider from "../components/BannerSlider";
import ProductFilter from "../components/ProductFilter";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  //const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const notificationStore = useNotificationStore()

  useEffect(() => {
    setTimeout(() => {
      notificationStore.closeNotification()
    }
      , 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notificationStore.show]);

  return (
    <>
      <Head>
        <title>Demo Kedai</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <meta property="og:title" content="Ecommerce Demo" />
        <meta property="og:description" content="Ecommerce demo by Farhan Helmy" />
        <meta property="og:image" content="https://hustlermy-dev.s3.ap-southeast-1.amazonaws.com/seothumb.png" />
        <meta property="og:url" content="https://shopdemo.farhanhelmy.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary"></meta>
        <meta name="twitter:creator" content="@farhanhelmycode"></meta>
        {/* <script src="https://beamanalytics.b-cdn.net/beam.min.js" data-token="985d914f-a13a-4d21-9289-bf51f9d27097" async></script> */}
      </Head>
      <NavBar />
      <BannerSlider />
      <ProductFilter />
      <Footer />
      <Notification show={notificationStore.show} title={notificationStore.title} message={notificationStore.message} success={notificationStore.success} />
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined },
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
