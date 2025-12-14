import StudentListTable from '@/components/dashboard/admin/StudentListTable';
import TitleSection from '@/components/dashboard/shared/TitleSection';
import React from 'react';

const page = () => {
    return (
        <div>

            <TitleSection bg={'#F9F5FF'}  title={"Student List"} />
            <StudentListTable/>
            
        </div>
    );
};

export default page;