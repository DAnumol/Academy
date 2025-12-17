# Searchable Select Implementation for GenericFormModal

## Step 1: Find the select field rendering in GenericFormModal

Look for code that renders select fields (around line 600-700). It will look something like:

```javascript
case 'select':
  return (
    <select
      value={formData[field.name] || ''}
      onChange={(e) => handleChange(field.name, e.target.value)}
      className="..."
    >
      <option value="">Select {field.label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
```

## Step 2: Add searchable select rendering

Replace the select case with this code that supports both regular and searchable selects:

```javascript
case 'select': {
  // If searchable is true, render searchable dropdown
  if (field.searchable) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    const filteredOptions = options.filter(opt =>
      opt.label?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const selectedOption = options.find(opt => opt.value === formData[field.name]);
    
    return (
      <div className="relative">
        <input
          type="text"
          value={selectedOption ? selectedOption.label : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={field.placeholder || `Search ${field.label}`}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        
        {isOpen && filteredOptions.length > 0 && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    handleChange(field.name, opt.value);
                    setSearchTerm('');
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Regular select dropdown
  return (
    <select
      value={formData[field.name] || ''}
      onChange={(e) => handleChange(field.name, e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
    >
      <option value="">Select {field.label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
```

## Step 3: Add state management at component level

At the top of GenericFormModal component, add state for searchable selects:

```javascript
const [searchStates, setSearchStates] = useState({});

const updateSearchState = (fieldName, state) => {
  setSearchStates(prev => ({ ...prev, [fieldName]: state }));
};
```

## Step 4: Update the searchable select code to use component state

```javascript
case 'select': {
  if (field.searchable) {
    const searchState = searchStates[field.name] || { term: '', isOpen: false };
    
    const filteredOptions = options.filter(opt =>
      opt.label?.toLowerCase().includes(searchState.term.toLowerCase())
    );
    
    const selectedOption = options.find(opt => opt.value === formData[field.name]);
    
    return (
      <div className="relative">
        <input
          type="text"
          value={selectedOption ? selectedOption.label : searchState.term}
          onChange={(e) => {
            updateSearchState(field.name, { term: e.target.value, isOpen: true });
          }}
          onFocus={() => updateSearchState(field.name, { ...searchState, isOpen: true })}
          placeholder={field.placeholder || `Search ${field.label}`}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        
        {searchState.isOpen && filteredOptions.length > 0 && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => updateSearchState(field.name, { ...searchState, isOpen: false })}
            ></div>
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    handleChange(field.name, opt.value);
                    updateSearchState(field.name, { term: '', isOpen: false });
                  }}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Regular select...
}
```

## Step 5: Usage in FeeManagementTable

Now you can use `searchable: true` in your field config:

```javascript
{
  name: 'studentId',
  label: 'Student',
  type: 'select',
  required: true,
  apiEndpoint: '/students',
  valueField: 'studentId',
  labelField: 'name',
  searchable: true,  // ← This enables searchable dropdown
  section: 'basic',
  sectionTitle: 'Student Information'
}
```

## Alternative: Simpler Implementation (If above is too complex)

If modifying GenericFormModal is too difficult, just add `size` attribute to make scrolling easier:

```javascript
<select
  size="10"  // Shows 10 options at once with scrollbar
  value={formData[field.name] || ''}
  onChange={(e) => handleChange(field.name, e.target.value)}
  className="..."
>
```

This makes it easier to find students in a long list without implementing full search functionality.
