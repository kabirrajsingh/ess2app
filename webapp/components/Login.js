"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    EmployeeID: "",
    Password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        EmployeeID: form.EmployeeID,
        Password: form.Password,
        redirect: false,
      });
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className=" w-full flex flex-col gap-2 tracking-wider">
        <label className="text-md text-neutral-700">Employee ID</label>
        <input
          className="w-full h-10 rounded-md px-4 text-base focus:outline-none"
          placeholder="Enter your employee id"
          type="text"
          name="EmployeeID"
          value={form.EmployeeID}
          onChange={handleChange}
        />
      </div>

      <div className=" w-full flex flex-col gap-2 tracking-wider">
        <label className="text-md text-neutral-700">Password</label>
        <input
          className="w-full h-10 rounded-md px-4 text-base focus:outline-none"
          placeholder="Enter your password"
          type="password"
          name="Password"
          value={form.Password}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} className="p-4 mt-4 text-white rounded-md text-xl font-base text-center w-full bg-blue-primary hover:bg-blue-800 cursor-pointer">
        Login
      </button>
      {error && (
        <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
          {error}
        </div>
      )}
    </>
  );
};

export default Login;
