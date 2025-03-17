import React, { useState } from 'react';

const languages = [
    { code: 'en', name: 'Eng (US)', flag: '/assets/icons/united.svg' },
    { code: 'es', name: 'Spanish', flag: '/assets/icons/united.svg' },
    { code: 'fr', name: 'French', flag: '/assets/icons/united.svg' },
    // Add more languages here
];

const DropdownLanguage: React.FC = () => {

    const [selectedLanguage, setSelectedLanguage] = useState<any>(languages[0]);

    const handleChange = (e: any) => {
        const languageCode = e.target.value;
        const language = languages.find((lang) => lang.code === languageCode);
        setSelectedLanguage(language);
    };

    return (
        <div className="relative hidden lg:inline-flex">
            <select
                className="px-2 py-2 focus:outline-none focus:ring focus:border-blue-300 font-semibold text-[13px]"
                onChange={handleChange}
                value={selectedLanguage.code}
            >
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {/* <img
                            src={language.flag}
                            alt={`${language.name} Flag`}
                            className="w-5 h-5 inline-block mr-2 "
                        /> */}
                        {language.name}
                    </option>
                ))}
            </select>
            {/* <div className="absolute inset-y-0 left-2 flex items-center pr-2 pointer-events-none">
                <span role="img" aria-label="Selected Language Flag">
                    <img src={selectedLanguage.flag} alt={`${selectedLanguage.name} Flag`} />
                </span>
            </div> */}
        </div>
    );
};

export default DropdownLanguage;
