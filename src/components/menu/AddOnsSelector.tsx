import React from 'react';
import { Check } from 'lucide-react';
import { AddOn } from '../../types';

interface AddOnsSelectorProps {
  value: string[];
  onChange: (addOnIds: string[]) => void;
  addOns: AddOn[];
}

const AddOnsSelector: React.FC<AddOnsSelectorProps> = ({ value = [], onChange, addOns }) => {
  const toggleAddOn = (addOnId: string) => {
    if (value.includes(addOnId)) {
      onChange(value.filter((id) => id !== addOnId));
    } else {
      onChange([...value, addOnId]);
    }
  };

  if (addOns.length === 0) {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Add-Ons
          <span className="text-xs text-gray-500 ml-2 font-normal">
            (Select add-ons available for this item)
          </span>
        </label>
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500">
            No add-ons available. Create add-ons first in the Add-Ons management page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Add-Ons
          <span className="text-xs text-gray-500 ml-2 font-normal">
            ({value.length} selected)
          </span>
        </label>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-2 border-gray-200 rounded-lg p-4 bg-white">
        {addOns.map((addOn) => {
          const isSelected = value.includes(addOn._id);
          const isAvailable = addOn.isAvailable;

          return (
            <label
              key={addOn._id}
              className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                !isAvailable
                  ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAddOn(addOn._id)}
                  disabled={!isAvailable}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${!isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>
                      {addOn.name}
                    </p>
                    {addOn.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {addOn.description}
                      </p>
                    )}
                    {!isAvailable && (
                      <span className="text-xs text-red-500 mt-1 inline-block">
                        Unavailable
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-indigo-600 ml-2 flex-shrink-0">
                    +${addOn.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default AddOnsSelector;
