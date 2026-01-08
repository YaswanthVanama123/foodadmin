import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import Button from '../ui/Button';
import Card, { CardBody } from '../ui/Card';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (startDate: Date, endDate: Date) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(format(startDate, 'yyyy-MM-dd'));
  const [tempEndDate, setTempEndDate] = useState(format(endDate, 'yyyy-MM-dd'));

  const presets = [
    {
      label: 'Last 7 Days',
      getValue: () => ({
        start: subDays(new Date(), 6),
        end: new Date(),
      }),
    },
    {
      label: 'Last 30 Days',
      getValue: () => ({
        start: subDays(new Date(), 29),
        end: new Date(),
      }),
    },
    {
      label: 'This Month',
      getValue: () => ({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      }),
    },
    {
      label: 'Last Month',
      getValue: () => {
        const lastMonth = subMonths(new Date(), 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      },
    },
  ];

  const handlePresetClick = (preset: typeof presets[0]) => {
    const { start, end } = preset.getValue();
    onChange(start, end);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);

    if (start > end) {
      alert('Start date must be before end date');
      return;
    }

    onChange(start, end);
    setShowCustom(false);
  };

  return (
    <Card>
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Date Range</span>
            </div>
            <div className="text-sm text-gray-600">
              {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustom(!showCustom)}
            >
              Custom Range
            </Button>
          </div>

          {showCustom && (
            <div className="space-y-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustom(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCustomApply}>
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default DateRangePicker;
