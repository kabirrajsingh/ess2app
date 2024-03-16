import { useState } from 'react';
const Register = () => {
  const [form, setForm] = useState({
    EmployeeID: '',
    Email: '',
    Password: '',
    confirmpassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    try {
      if(form.Password !== form.confirmpassword){
        alert("Password and Confirm password should be same")
      }else{
        const response=await fetch('http://localhost:3000/api/register', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form),
        })
        .then((res) => res.json())
          .catch((err) => console.log(err))
          .finally(()=>{
            //set user in session and redirect to '/'
            router.replace("/");
          })
      }
      
    } catch (error) {
      console.log(error);
    }
  };
    

  return (
    <>
      <div className="w-full flex flex-col gap-2 tracking-wider">
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
      <div className="w-full flex flex-col gap-2 tracking-wider">
        <label className="text-md text-neutral-700">Company Email</label>
        <input
          className="w-full h-10 rounded-md px-4 text-base focus:outline-none"
          placeholder="Enter your email@tallysolutions.com"
          type="email"
          name="Email"
          value={form.Email}
          onChange={handleChange}
        />
      </div>
      <div className="w-full flex flex-col gap-2 tracking-wider">
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
      <div className="w-full flex flex-col gap-2 tracking-wider">
        <label className="text-md text-neutral-700">Confirm Password</label>
        <input
          className="w-full h-10 rounded-md px-4 text-base focus:outline-none"
          placeholder="Confirm your password"
          type="password"
          name="confirmpassword"
          value={form.confirmpassword}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleSubmit}
        className="p-4 mt-4 text-white rounded-md font-base text-xl text-center w-full bg-blue-primary hover:bg-blue-800 cursor-pointer"
  
      >
        Register
      </button>
    </>
  );
};

export default Register;
