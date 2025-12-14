// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import illustration from "@/public/login.jpg";
// import toast from "react-hot-toast";
// import { useUserLoginMutation } from "@/feature/UserApi";
// import Link from "next/link";
// import { signIn } from "next-auth/react";

// export default function LoginPage() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [activeRole, setActiveRole] = useState("Student");

//   const [login, { isLoading, isError }] = useUserLoginMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitted Data:", form);
//     try {
//       const logged = await login(form).unwrap();
//       console.log(logged, "tomi amar personal logged");
//       toast.success("Login Success");

//       const res = await signIn("credentials", {
//         redirect: false,
//         email: logged?.data?.email,
//         role: logged?.data?.role,
//         id: logged?.data?._id,
//       });
//       console.log(res, "tui ki res re madari kroe den aplease");
//     } catch (error) {
//       console.log(error, "joy bangla marka error");
//       toast.error(error?.data?.message);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({
//       ...form,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="w-full bg-white min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
//         {/* Left Image */}
//         <div className="relative w-full flex items-center justify-center">
//           <Image
//             src={illustration}
//             alt="Login Illustration"
//             height={1600}
//             width={800}
//             className="object-contain"
//           />
//         </div>

//         {/* Right Form */}
//         <div className="flex flex-col justify-center max-w-md">
//           <h2 className="text-2xl font-semibold text-gray-900">
//             Good to see you back, Saad Rayhan !
//           </h2>
//           <p className="text-gray-500 text-sm mt-2">
//             Let’s continue your learning journey right where you left off.
//           </p>

//           {/* Role Selection Tabs */}
//           <div className="flex gap-2 mt-6 bg-gray-100 rounded-lg p-1">
//             <button
//               type="button"
//               onClick={() => setActiveRole("Tutor")}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 activeRole === "Tutor"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Tutor
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveRole("Student")}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 activeRole === "Student"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Student
//             </button>
//             <button
//               type="button"
//               onClick={() => setActiveRole("Parent")}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//                 activeRole === "Parent"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Parent
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="m@example"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="••••••"
//               />
//               <div className="text-right mt-1">
//                 <a
//                   href="#"
//                   className="text-xs text-gray-500 hover:text-gray-700"
//                 >
//                   Forget password?
//                 </a>
//               </div>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg mt-4 transition-colors"
//               disabled={isLoading}
//             >
//               {isLoading ? "Loading..." : "Log in"}
//             </button>

//             {/* Google Login Button */}
//             <button
//               type="button"
//               className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700 font-medium"
//             >
//               <svg className="w-5 h-5" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//               Log in with google
//             </button>

//             <p className="mt-5 text-sm text-center text-gray-600">
//               Don’t have an account?{" "}
//               <Link href={"/register"}>
//                 <span className="text-blue-600 cursor-pointer hover:underline font-medium">
//                   Sign in
//                 </span>
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import Image from "next/image";
import illustrationTutor from "@/public/-Tutor/illustrationTutor.png";
import illustrationStudent from "@/public/-Student/illustrationStudent.png";
import illustrationParent from "@/public/-Parent/illustrationParent.png";
import forgotTutor from "@/public/-Tutor/forgotTutor.png";
import forgotStudent from "@/public/-Student/forgotStudent.png";
import forgotParent from "@/public/-Parent/forgotParent.png";
import toast from "react-hot-toast";
import { useUserLoginMutation } from "@/feature/UserApi";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [activeRole, setActiveRole] = useState("Tutor");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Key to force image re-render

  const [login, { isLoading, isError }] = useUserLoginMutation();

  // Define image mapping
  const roleImages = {
    Tutor: illustrationTutor,
    Student: illustrationStudent,
    Parent: illustrationParent,
  };

  const forgotImages = {
    Tutor: forgotTutor,
    Student: forgotStudent,
    Parent: forgotParent,
  };

  // Get current image based on role and forgot password state
  const getCurrentImage = () => {
    if (isForgotPassword) {
      return forgotImages[activeRole] || forgotImages.Tutor;
    }
    return roleImages[activeRole] || roleImages.Tutor;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", form);
    try {
      const logged = await login(form).unwrap();
      console.log(logged, "tomi amar personal logged");
      toast.success("Login Success");

      const res = await signIn("credentials", {
        redirect: false,
        email: logged?.data?.email,
        role: logged?.data?.role,
        id: logged?.data?._id,
      });
      console.log(res, "tui ki res re madari kroe den aplease");
    } catch (error) {
      console.log(error, "joy bangla marka error");
      toast.error(error?.data?.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    // Reset forgot password state when changing role
    setIsForgotPassword(false);
    // Force image to re-render by changing the key
    setImageKey(prev => prev + 1);
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    // Force image to re-render
    setImageKey(prev => prev + 1);
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    // Force image to re-render
    setImageKey(prev => prev + 1);
  };

  return (
    <div className="w-full bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {/* Left Image with Animation */}
        <div className="relative w-full flex items-center justify-center overflow-hidden">
          <div 
            key={imageKey} // Key forces re-render of this div
            className="relative w-full h-125 md:h-150"
          >
            <div className="relative w-full h-full">
              <Image
                src={getCurrentImage()}
                alt={`${activeRole} ${isForgotPassword ? 'Forgot Password' : 'Login'} Illustration`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
          {/* Overlay for animation effect */}
          <div 
            className={`absolute inset-0 bg-white transition-opacity duration-500 pointer-events-none ${
              imageKey > 0 ? 'opacity-0' : 'opacity-0'
            }`}
          />
        </div>

        {/* Right Form */}
        <div className="flex flex-col justify-center max-w-md">
          {isForgotPassword ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">
                Reset Your Password
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Enter your email to receive password reset instructions for your {activeRole} account.
              </p>

              <form className="mt-6 space-y-4">
                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                    placeholder="m@example.com"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-900">
                Good to see you back, Saad Rayhan!
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Let’s continue your learning journey right where you left off.
              </p>

              {/* Role Selection Tabs */}
              <div className="flex gap-2 mt-6 bg-gray-100 rounded-lg p-1">
                {["Tutor", "Student", "Parent"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeRole === role
                        ? "bg-white text-gray-900 shadow-sm transform scale-[1.02]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                    placeholder="m@example"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                    placeholder="You password"
                  />
                  <div className="text-right mt-1">
                    <Link
                    href={"/forgot-password"}
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Forget password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg mt-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>

                {/* Google Login Button */}
                <button
                  type="button"
                  className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-gray-700 font-medium"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Log in with google
                </button>

                <p className="mt-5 text-sm text-center text-gray-600">
                  Don’t have an account?{" "}
                  <Link href={"/register"}>
                    <span className="text-blue-600 cursor-pointer hover:underline font-medium transition-colors">
                      Sign in
                    </span>
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}