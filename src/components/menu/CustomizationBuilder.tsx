import React, { useState } from 'react';
import { Plus, Trash, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import { Customization, CustomizationOption } from '../../types';

interface CustomizationBuilderProps {
  value: Customization[];
  onChange: (customizations: Customization[]) => void;
}

const CustomizationBuilder: React.FC<CustomizationBuilderProps> = ({ value = [], onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addCustomization = () => {
    onChange([
      ...value,
      {
        name: '',
        type: 'single',
        required: false,
        options: [],
      },
    ]);
    setExpandedIndex(value.length);
  };

  const updateCustomization = (index: number, updates: Partial<Customization>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeCustomization = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const addOption = (customizationIndex: number) => {
    const customization = value[customizationIndex];
    updateCustomization(customizationIndex, {
      options: [
        ...customization.options,
        { label: '', priceModifier: 0 },
      ],
    });
  };

  const updateOption = (
    customizationIndex: number,
    optionIndex: number,
    updates: Partial<CustomizationOption>
  ) => {
    const customization = value[customizationIndex];
    const updatedOptions = [...customization.options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], ...updates };
    updateCustomization(customizationIndex, { options: updatedOptions });
  };

  const removeOption = (customizationIndex: number, optionIndex: number) => {
    const customization = value[customizationIndex];
    updateCustomization(customizationIndex, {
      options: customization.options.filter((_, i) => i !== optionIndex),
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Customization Options
        </label>
        <Button type="button" variant="outline" size="sm" onClick={addCustomization}>
          <Plus className="h-4 w-4 mr-1" />
          Add Group
        </Button>
      </div>

      <div className="space-y-3">
        {value.map((customization, index) => (
          <div
            key={index}
            className="border-2 border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex-1 text-left font-medium text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {customization.name || `Customization Group ${index + 1}`}
                <span className="text-sm text-gray-500 ml-2">
                  ({customization.options.length} options)
                </span>
              </button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomization(index)}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                <Input
                  label="Group Name"
                  placeholder="e.g., Size, Toppings"
                  value={customization.name}
                  onChange={(e) =>
                    updateCustomization(index, { name: e.target.value })
                  }
                />

                <Select
                  label="Selection Type"
                  value={customization.type}
                  onChange={(e) =>
                    updateCustomization(index, {
                      type: e.target.value as 'single' | 'multiple',
                    })
                  }
                  options={[
                    { value: 'single', label: 'Single Choice' },
                    { value: 'multiple', label: 'Multiple Choice' },
                  ]}
                />

                <Checkbox
                  label="Required"
                  checked={customization.required}
                  onChange={(e) =>
                    updateCustomization(index, { required: e.target.checked })
                  }
                />

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Options
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(index)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {customization.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-end gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <Input
                            placeholder="Option name"
                            value={option.label}
                            onChange={(e) =>
                              updateOption(index, optionIndex, {
                                label: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={option.priceModifier}
                            onChange={(e) =>
                              updateOption(index, optionIndex, {
                                priceModifier: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index, optionIndex)}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    {customization.options.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-2">
                        No options added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {value.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">
              No customization options added yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizationBuilder;
