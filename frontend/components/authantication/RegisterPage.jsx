// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { AiOutlineCheck } from "react-icons/ai";
// import illustration from "@/public/register.jpg";
// import { useCreateUserMutation } from "@/feature/UserApi";
// import toast from "react-hot-toast";

// export default function RegisterPage() {

//   const [createUser, {isLoading, iserror, error}] = useCreateUserMutation();

//   const [formData, setFormData] = useState({
//     year: "Tutor",
//     firstName: "",
//     lastName: "",
//     password: "",
//     confirmPassword: "",
//     email:"",
//     terms: false,
//   });

//   function handleChange(e) {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   }

// const handleSubmit = async(e) =>{
//     e.preventDefault();

//     const registrationData = {
//       ...formData,
//       role:formData.year.toLowerCase()
//     };

//   try {
//       const saved = await createUser(registrationData).unwrap();
//     console.log(saved, "saved---")
//     toast.success("Registration Successfull")

//   } catch (error) {
//     console.log(error, "tomi amar personal error")
//     toast.error(error?.data?.message || "Something went wrong!")
//   }

//     console.log("Form Data:", {
//       ...formData,
//       role: formData.year.toLowerCase()
//     });

//     console.log("Role:", formData.year === "Tutor" ? "teacher" : "student");
//   };

//   return (
//     <div className="w-full bg-white min-h-screen flex items-center justify-center">
//       <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6">

//         {/* Left Image */}
//         <div className="relative w-full flex items-center justify-center">
//           <Image
//             src={illustration}
//             alt="Register Illustration"
//             height={1600}
//             width={800}
//             className="object-contain"
//           />
//         </div>

//         {/* Right Form */}
//         <div className="flex flex-col justify-center max-w-md">
//           <h2 className="text-2xl font-semibold text-gray-900">
//             Join the Teaching Journey
//           </h2>
//           <p className="text-gray-500 text-sm mt-2">
//             Create an account to manage classes, bookings, and get personalized analytics.
//           </p>

//           {/* Toggle - Tutor, Student, Parent */}
//           <div className="flex gap-2 mt-6 bg-gray-100 rounded-lg p-1">
//             {["Tutor", "Student", "Parent"].map((type) => (
//               <button
//                 key={type}
//                 type="button"
//                 onClick={() => setFormData({ ...formData, year: type })}
//                 className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   formData.year === type
//                     ? "bg-white text-gray-900 shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 {type}
//               </button>
//             ))}
//           </div>

//           {/* FORM */}
//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">First name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="First name"
//               />
//             </div>

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">Last name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="Last name"
//               />
//             </div>

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="Email address"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="Write your password"
//               />
//             </div>

//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">Re-type password</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
//                 placeholder="Re-type your password"
//               />
//             </div>

//             {/* How did you hear about us dropdown */}
//             <div>
//               <label className="text-gray-900 text-sm font-medium block mb-2">How did you hear about us?</label>
//               <select
//                 name="hearAbout"
//                 className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 bg-white"
//               >
//                 <option value="">Select</option>
//                 <option value="social">Social Media</option>
//                 <option value="friend">Friend/Family</option>
//                 <option value="search">Search Engine</option>
//                 <option value="ad">Advertisement</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>

//             {/* Terms checkbox */}
//             <label className="flex items-start gap-3 text-sm mt-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="terms"
//                 checked={formData.terms}
//                 onChange={handleChange}
//                 className="h-4 w-4 mt-0.5 rounded border-gray-300"
//               />
//               <span className="text-blue-600 hover:underline">Terms and Conditions</span>
//             </label>

//             {/* Button */}
//             <button
//               type="submit"
//               className="w-full bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg mt-4 transition-colors"
//               disabled={isLoading}
//             >
//               {!isLoading ? "Sign up" : "loading..."}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCreateUserMutation } from "@/feature/UserApi";
import toast from "react-hot-toast";

import tutorImage from "@/public/-Signup/tutorImage.png";
import studentImage from "@/public/-Signup/studentImage.png";
import parentImage from "@/public/-Signup/parentImage.png";
import Link from "next/link";

export default function RegisterPage() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    role: "Tutor",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    hearAbout: "",
    otherHearAbout: "",
    dbsFile: null,
    studentId: "",
    terms: false,
  });

  // Define hearAbout options
  const hearAboutOptions = [
    "Instagram",
    "Facebook",
    "LinkedIn",
    "Friend/Family",
    "Search Engine",
    "Advertisement",
    "Other",
  ];

  // Image mapping based on role
  const roleImages = {
    Tutor: tutorImage,
    Student: studentImage,
    Parent: parentImage,
  };

  function handleChange(e) {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validate terms acceptance
    if (!formData.terms) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }

    // Prepare data based on role
    let registrationData = {
      role: formData.role.toLowerCase(),
      email: formData.email,
      password: formData.password,
      terms: formData.terms,
    };

    // Add role-specific fields
    if (formData.role === "Tutor") {
      registrationData = {
        ...registrationData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hearAbout: formData.hearAbout,
        otherHearAbout:
          formData.hearAbout === "Other" ? formData.otherHearAbout : "",
        dbsFile: formData.dbsFile,
      };
    } else if (formData.role === "Student") {
      registrationData = {
        ...registrationData,
        firstName: formData.firstName,
        lastName: formData.lastName,
        hearAbout: formData.hearAbout,
        otherHearAbout:
          formData.hearAbout === "Other" ? formData.otherHearAbout : "",
      };
    } else if (formData.role === "Parent") {
      registrationData = {
        ...registrationData,
        studentId: formData.studentId,
      };
    }

    try {
      const saved = await createUser(registrationData).unwrap();
      console.log(saved, "saved---");
      toast.success("Registration Successful!");
    } catch (error) {
      console.log(error, "tomi amar personal error");
      toast.error(error?.data?.message || "Something went wrong!");
    }

    console.log("Form Data:", registrationData);
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setFormData({
      ...formData,
      dbsFile: file,
    });
  };

  return (
    <div className="w-full bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {/* Left Image - Dynamic based on role */}
        <div className="relative w-full flex items-center justify-center">
          <Image
            src={roleImages[formData.role] || tutorImage}
            alt={`${formData.role} Registration Illustration`}
            height={1600}
            width={800}
            className="object-contain transition-opacity duration-500"
            priority
          />
        </div>

        {/* Right Form */}
        <div className="flex flex-col justify-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900">
            {formData.role === "Tutor"
              ? "Join the Teaching Journey"
              : formData.role === "Student"
              ? "Start Your Learning Journey"
              : "Connect with Your Child's Education"}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {formData.role === "Tutor"
              ? "Create an account to manage classes, bookings, and get personalized analytics."
              : formData.role === "Student"
              ? "Create an account to find tutors, book sessions, and track your progress."
              : "Create an account to monitor your child's progress and manage their tutoring."}
          </p>

          {/* Role Selection Tabs */}
          <div className="flex gap-2 mt-6 bg-gray-100 rounded-lg p-1">
            {["Tutor", "Student", "Parent"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: type,
                    // Reset role-specific fields when changing role
                    dbsFile: null,
                    studentId: "",
                    hearAbout: "",
                    otherHearAbout: "",
                  })
                }
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.role === type
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Common Fields for Tutor and Student */}
            {(formData.role === "Tutor" ||
              formData.role === "Student" ||
              formData.role === "Parent") && (
              <>
                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                    placeholder="First name"
                    required={formData.role !== "Parent"} // Make optional for Parent if needed
                  />
                </div>

                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                    placeholder="Last name"
                    required={formData.role !== "Parent"} // Make optional for Parent if needed
                  />
                </div>
              </>
            )}
            {/* Parent specific field */}
            {/* {formData.role === "Parent" && (
              <div>
                <label className="text-gray-900 text-sm font-medium block mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                  placeholder="Enter your child's student ID"
                  required
                />
              </div>
            )} */}
            {/* Email Field - Common for all */}
            <div>
              <label className="text-gray-900 text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                placeholder="Email address"
                required
              />
            </div>
            {/* Password Fields - Common for all */}
            <div>
              <label className="text-gray-900 text-sm font-medium block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                placeholder="Write your password"
                required
              />
            </div>
            <div>
              <label className="text-gray-900 text-sm font-medium block mb-2">
                Re-type password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                placeholder="Re-type your password"
                required
              />
            </div>
            {/* DBS File Upload - Tutor only */}
            {formData.role === "Tutor" && (
              <div>
                <label className="text-gray-900 text-sm font-medium block mb-2">
                  DBS Certificate (PDF only)
                </label>
                <input
                  type="file"
                  name="dbsFile"
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {formData.dbsFile && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ File selected: {formData.dbsFile.name}
                  </p>
                )}
              </div>
            )}
            {/* How did you hear about us - Tutor and Student only */}
            {(formData.role === "Tutor" || formData.role === "Student") && (
              <>
                <div>
                  <label className="text-gray-900 text-sm font-medium block mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400 bg-white"
                    required
                  >
                    <option value="">Select an option</option>
                    {hearAboutOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other specify field */}
                {formData.hearAbout === "Other" && (
                  <div>
                    <label className="text-gray-900 text-sm font-medium block mb-2">
                      Please specify
                    </label>
                    <input
                      type="text"
                      name="otherHearAbout"
                      value={formData.otherHearAbout}
                      onChange={handleChange}
                      className="w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400"
                      placeholder="Please specify how you heard about us"
                      required
                    />
                  </div>
                )}
              </>
            )}
            {/* Terms checkbox - Common for all */}
            <label className="flex items-start gap-3 text-sm mt-2 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4 mt-0.5 rounded border-gray-300"
                required
              />
              <span>
                I agree to the{" "}
                <span className="text-blue-600 hover:underline">
                  Terms and Conditions
                </span>
              </span>
            </label>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
            <p className="mt-5 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link href={"/login"}>
                <span className="text-blue-600 cursor-pointer hover:underline font-medium transition-colors">
                  Login
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
