import React from "react";


const SECTIONS = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    content: (
      <>
        <p className="mb-4 text-gray-600">
    Studiquo Limited (“Studiquo”, “we”, “us”) is committed to protecting your personal information
and being transparent about how we use it. This Privacy Policy explains what data we
collect, how we use it, the legal basis for processing it, and the rights you hold under the UK
GDPR and UK data protection laws.


        </p>

        <p className="text-gray-600">
     By using www.studiquo.com or any related Studiquo services (the “Site”), you agree to the
terms of this Policy. <br /> <br />
Unless otherwise stated, any definitions used in our Terms & Conditions apply to this Policy.
        </p>
      </>
    ),
  },
  {
    id: "collecting-data",
    title: "Collecting and Using Your Personal Data",
    content: (
      <>
        <h3 className="mb-2 text-lg font-semibold">
          Types of Data Collected
        </h3>

        <h4 className="mt-4 font-semibold">  1. About This Policy</h4>
        <p className="mb-3 text-gray-600 mt-2">
    This Policy sets out how Studiquo processes personal data when you visit our Site, create
an account, book lessons, apply as a tutor, or interact with Studiquo in any way. We may
update this Policy at any time by publishing the revised version on this page.

        </p>
        <h4 className="mt-4 font-semibold">  2. Information We Collect</h4>
        <p className="mb-3 text-gray-600 mt-2">
 We collect several categories of information so we can deliver our services, meet legal
requirements, and improve the Studiquo experience.


        </p>
        <h4 className="mt-4 font-semibold">      <h4 className="mt-4 font-semibold">  2.1 Information you provide directly</h4>
       </h4>
        <p className="mb-3 text-gray-600 mt-2">
We process personal data that you voluntarily provide to us when creating or using a
Studiquo account. This includes:



        </p>


         <h4 className="mt-4 font-semibold">      <h4 className="mt-4 text-gray-500 py-4 font-semibold">  Account Details</h4>
       </h4>
       <ul className="ml-6 space-y-2 list-disc mt-2 text-gray-600 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Telephone Number</li>
          <li>Postal address</li>
          <li>Date of birth</li>

        </ul>
     <section>
            <h4 className="mt-4 font-semibold">      <h4 className="mt-4 text-gray-500 py-4 font-semibold">  Tutor application information</h4>
       </h4>

           <p className="mb-3 text-gray-600 mt-2">
If you apply to teach on Studiquo, we collect:



        </p>
       <ul className="ml-6 space-y-2 list-disc mt-2 text-gray-600 space-y-1">
          <li>Educational background and qualifications</li>
          <li>DBS details and right-to-work evidence</li>
          <li>Telephone Number</li>
          <li>Profile photos/videos</li>
          <li>Biography and resume</li>
          <li>Subjects taught, pricing, and availability</li>

        </ul>
     </section>

     {/*  */}
     <section>
            <h4 className="mt-4 font-semibold">      <h4 className="mt-4 text-gray-500 py-4 font-semibold">  Communication history</h4>
       </h4>

           <p className="mb-3 text-gray-600 mt-2">
We store: 



        </p>
       <ul className="ml-6 space-y-2 list-disc mt-2 text-gray-600 space-y-1">
          <li>Messages sent between users on the platform</li>
          <li>Messages exchanged with the Studiquo team</li>
          <li>Requests you submit and actions taken on your account</li>
    

        </ul>
     </section>

     {/*  */}
     <section>
            <h4 className="mt-4 font-semibold">      <h4 className="mt-4 text-gray-500 py-4 font-semibold">  Booking information</h4>
       </h4>

           <p className="mb-3 text-gray-600 mt-2">
To deliver tutoring services, we process:



        </p>
       <ul className="ml-6 space-y-2 list-disc mt-2 text-gray-600 space-y-1">
          <li>Lesson bookings and requests</li>
          <li>Subjects and levels</li>
          <li>Lesson recordings</li>
          <li>Interview and onboarding recordings for tutor</li>
          <li>Test results from your use of our online lesson tools</li>
    

        </ul>
     </section>

     {/*  */}
     <section>
            <h4 className="mt-4 font-semibold">      <h4 className="mt-4 text-gray-500 py-4 font-semibold">  Promotions and referrals</h4>
       </h4>

           <p className="mb-3 text-gray-600 mt-2">
We track:



        </p>
       <ul className="ml-6 space-y-2 list-disc mt-2 text-gray-600 space-y-1">
          <li>Educational background and qualifications</li>
          <li>DBS details and right-to-work evidence</li>
          <li>Profile photos/videos</li>
          <li>Biography and resume</li>
          <li>Subjects taught, pricing, and availability</li>
    

        </ul>

              <p className="mb-3 py-4 text-gray-600 mt-2">
If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.


        </p>
              <p className="mb-3 py-4 text-gray-600 mt-2">
You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.

        </p>
     </section>


        {/* <ul className="ml-6 list-disc text-gray-600 space-y-1">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Address, State, Province, ZIP/Postal code, City</li>
        </ul> */}
      </>
    ),
  },
  {
    id: "Cookies and Tracking",
    title: "Cookies and Tracking",
    content: (
      <>
        <p className="text-gray-600">
        We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:
        </p>


         <ul className="ml-6 list-disc py-4 text-gray-600 space-y-1">
          <li>Cookies or Browser Cookies. A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted Your browser setting so that it will refuse Cookies, our Service may use Cookies.</li>


          <li className="mt-6">Web Beacons. Certain sections of our Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of a certain section and verifying system and server integrity)</li>


            <p className="text-gray-600 mt-6">
    { ` Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. You can learn more about cookies on TermsFeed website article.`}
        </p>

<section className="py-8 space-y-4">

        <p className="text-gray-600">
  We use both Session and Persistent Cookies for the purposes set out below:
        </p>
    <p className="text-gray-600">
Necessary / Essential Cookies Type:
        </p>
    <p className="text-gray-600">
Session Cookies:
        </p>
    <p className="text-gray-600">
Administered by: Us
        </p>

                 <p className="text-gray-600 mt-6">
    { ` Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.`}
        </p>
</section>


{/*  */}
<section className="py-8 ">

        <p className="text-gray-600">
Cookies Policy / Notice Acceptance Cookies
        </p>
    <p className="text-gray-600">
Type: Persistent Cookies
        </p>
    <p className="text-gray-600">
Administered by: Us
        </p>
    <p className="text-gray-600">
Purpose: These Cookies identify if users have accepted the use of cookies on the Website.
        </p>

        
</section>


<section className="py-8 ">

        <p className="text-gray-600">
Functionality Cookies
        </p>
    <p className="text-gray-600">
Type: Persistent Cookies
        </p>
    <p className="text-gray-600">
Administered by: Us
        </p>
    <p className="text-gray-600 mt-4">
Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
        </p>
    <p className="text-gray-600">
For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.
        </p>

        
</section>

        
        </ul> 
      </>
    ),
  },
  {
    id: "Use of Your Personal Data",
    title: "Use of Your Personal Data",
    content: (
      <>
        <p className="mb-3 text-gray-600">
      The Company may use Personal Data for the following purposes:
        </p>

        <ul className="ml-6 list-disc space-y-4 text-gray-600 space-y-1">
          <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
          <li>To manage Your Account: to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
          <li>For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service..</li>
          <li>To contact You: To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>


          <li>To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information. </li>


          <li>To manage Your requests: To attend and manage Your requests to Us.</li>

          <li>For business transfers: We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Data held by Us about our Service users is among the assets transferred.</li>
          <li>For other purposes: We may use Your information for other  purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience..</li>
        </ul>
  <p className="mb-3 space-y-4 py-8 text-gray-600">
   We may share Your personal information in the following situations:
        </p>

         <ul className="ml-6 space-y-4 list-disc text-gray-600 space-y-1">
          <li>With Service Providers: We may share Your personal information with Service Providers to monitor and analyze the use of our Service, to contact You.</li>
          <li>For business transfers: We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of Our business to another company.</li>
          <li>With Affiliates: We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
          <li>With business partners: We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
          <li>With other users: when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity,  communicate with You and view Your profile.</li>

            <li>With Your consent: We may disclose Your personal information for any other purpose with Your consent.</li>
        </ul>

      </>
    ),
  },
  {
    id: "Retention of Your Personal Data",
    title: "Retention of Your Personal Data",
    content: (
      <>
     <section className="space-y-8">

           <p className="text-gray-600">
      The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
        </p>

        <p className="mt-2 text-gray-600">
   The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
        </p>
     </section>
      </>
    ),
  },
  {
    id: "Transfer of Your Personal Data",
    title: "Transfer of Your Personal Data",
    content: (
      <>
        <p className="text-gray-600">
        Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws  may differ than those from Your jurisdiction. 
        </p>

        <p className="mt-2 py-4 text-gray-600">
     Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer. 
        </p>

        <p className="mt-2 text-gray-600">
 The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of  Your data and other personal information.
        </p>
      </>
    ),
  },
  {
    id: "Delete Your Personal Data",
    title: "Delete Your Personal Data",
    content: (
      <>
        <p className="text-gray-600">
     You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.
        </p>

        <p className="mt-2 py-4 text-gray-600">
  Our Service may give You the ability to delete certain information about You from within the Service.
        </p>

        <p className="mt-2 text-gray-600">
You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section that allows you to manage Your personal information. You may also contact Us to request access to, correct, or delete any personal information that You have provided to Us.
        </p>
        <p className="mt-2 text-gray-600">
Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so.
        </p>
      </>
    ),
  },
];
const Page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT SIDE – SECTIONS */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 rounded-lg border bg-white p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500">
              Sections
            </h2>

            <ul className="space-y-2">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-rose-600 transition"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* RIGHT SIDE – CONTENT */}
        <main className="md:col-span-3 space-y-16">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24"
            >
              <h1 className="mb-4 text-2xl font-bold text-gray-900">
                {section.title}
              </h1>

              <div className="prose max-w-none">
                {section.content}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Page;
