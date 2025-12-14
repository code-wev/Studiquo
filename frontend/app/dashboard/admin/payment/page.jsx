import PaymentTable from '@/components/dashboard/admin/PaymentTable';
import TitleSection from '@/components/dashboard/shared/TitleSection';
import React from 'react';

const page = () => {
    return (
        <div>
            <TitleSection bg={"#F5FFF9"} title={"Payments"}/>
            <PaymentTable/>
            
        </div>
    );
};

export default page;


