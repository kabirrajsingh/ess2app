import Provider from "@components/Provider";
import UserState from "@context/userState";
import { Inter } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tally ESS2",
  description: "Create Logs automatically",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ToastContainer />
        <UserState>
          <Provider>{children}</Provider>
        </UserState>
      </body>
    </html>
  );
}
