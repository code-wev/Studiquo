import React from 'react';

const TitleSection = ({bg, title}) => {
    return (
        <div className={`bg-[${bg}] py-10  px-8`}>
            <h4 className='text-[#000000] text-2xl'>Studiquo</h4>
            <h4 className='text-[#AAAAAA] mt-2 text-3xl'>{title}</h4>
            
        </div>
    );
};

export default TitleSection;