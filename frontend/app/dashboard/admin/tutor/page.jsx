"use client";

import TutorTable from "@/components/dashboard/admin/TutorTable";
import TitleSection from "@/components/dashboard/shared/TitleSection";

const page = () => {
  return (
    <div>
      <TitleSection bg={"#FFF6F5"} title={"Tutor List"} />
      <TutorTable />
    </div>
  );
};

export default page;
