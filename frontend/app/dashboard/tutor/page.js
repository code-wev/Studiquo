import TitleSection from '@/components/dashboard/shared/TitleSection';
import Overview from '@/components/dashboard/tutor/Overview';
import React from 'react';

const page = () => {
    return (
        <div>
            <TitleSection bg={'#FFFFFF'} title={"Tutor"}/>
            <Overview/>      
        </div>
    );
};

export default page;