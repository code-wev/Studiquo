'use client'
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { Suspense } from 'react';

const GoogleLoginpage = () => {

  const searchParams = useSearchParams()
 
  const token = searchParams.get('token');




  const setToken = async()=>{
    try {
           Cookies.set("token", token, {
          expires:7,
          secure:true,
          sameSite:"strict"
        });

     window.location.href = '/'

        


        
    } catch (error) {
        console.log(error);
    }
  };

  setToken();
  

  console.log(token, "ami tor tiken");
    return (
        <div>
            
        </div>
    );
};





const LoginWithGooglepage = () => {
  return (
    <div>
      <Suspense fallback={'Loading...'}>
        <GoogleLoginpage/>
      </Suspense>
      
    </div>
  );
};

export default LoginWithGooglepage;

