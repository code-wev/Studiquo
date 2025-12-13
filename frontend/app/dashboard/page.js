import Overview from '@/components/dashboard/admin/Overview';
import PendingApproval from '@/components/dashboard/admin/PendingApproval';
import TitleSection from '@/components/dashboard/shared/TitleSection';
import React from 'react';

const page = () => {
    return (
        <div>
            <TitleSection bg={'#FFFFFF'} title={"Dashboard"}/>
            <Overview/>
            <PendingApproval/>
            
        </div>
    );
};

export default page;