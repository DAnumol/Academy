import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';

const SearchableStudentSelect = ({ name, label, required, value, onChange, error }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/fee-payments/pending-students');
        const data = response.data || response;
        setStudents(data.data || data || []);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => 
    s.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.rollNo?.toLowerCase().includes(search.toLowerCase())
  );

  const selected = students.find(s => s.studentId === value);

  return (
    <div className="w-full space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder="Search student..."
          value={selected ? selected.name : search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (selected) onChange(null);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {isOpen && filtered.length > 0 && (
          <div className="absolute z-10 w-full mt-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto">
            {filtered.map(student => (
              <div
                key={student.studentId}
                onClick={() => {
                  onChange(student.studentId);
                  setSearch('');
                  setIsOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="text-sm text-gray-900 dark:text-white">{student.name}</div>
                {/* <div className="text-xs text-gray-500 dark:text-gray-400">{student.rollNo}</div> */}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableStudentSelect;
