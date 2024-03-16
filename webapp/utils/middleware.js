import { getSession } from 'next-auth/react';
import { NextResponse } from 'next/server';
const requireAuth = (handler) => async (req,{params}) => {
   console.log("require auth callede")
    const session = await getSession({ req });
    console.log(session)
    if (!session) {
      return NextResponse.redirect("http://localhost:3000/login");
    } 
    if (session.user.EmployeeID !== req.params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    return await handler(req, {params});
  };
  
  export default requireAuth;