import React, { useState } from 'react';

const SearchBar = ({ onSearchChange, onFocus, searchQuery }) => {
  return (
    <div className="relative flex-1 max-w-md mx-4">
      <div className="relative flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          placeholder="Search..."
          className="flex-1 bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500 outline-none min-w-0"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
