'use client';

import { useState } from 'react';

export default function Radio() {
  const [selected, setSelected] = useState('admin');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.value);
  };

  return (
    <div className="flex justify-center items-center gap-12 md:gap-15">
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="admin"
          value="admin"
          name="radio-role"
          className="w-6 h-6 accent-gray-900 cursor-pointer hover:accent-gray-700 focus:accent-gray-700 active:accent-gray-700"
          checked={selected === 'admin'}
          onChange={handleChange}
        />
        <label
          htmlFor="admin"
          className={`text-16 cursor-pointer ${selected === 'admin' ? 'text-gray-900 font-bold' : 'text-gray-700'}`}
        >
          admin
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="radio"
          id="student"
          value="student"
          name="radio-role"
          className="w-6 h-6 accent-gray-900 cursor-pointer hover:accent-gray-700 focus:accent-gray-700 active:accent-gray-700"
          checked={selected === 'student'}
          onChange={handleChange}
        />
        <label
          htmlFor="student"
          className={`text-16 cursor-pointer ${selected === 'student' ? 'text-gray-900 font-bold' : 'text-gray-700'}`}
        >
          student
        </label>
      </div>
    </div>
  );
}
