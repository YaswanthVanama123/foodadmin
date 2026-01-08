import React, { useState } from 'react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import SearchBar from '../common/SearchBar';
import { OrderFilters as OrderFiltersType } from '../../types';
import { ORDER_STATUS_CONFIG } from '../../utils/constants';
import { Filter, X } from 'lucide-react';

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFiltersType) => void;
  initialFilters?: OrderFiltersType;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<OrderFiltersType>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...Object.entries(ORDER_STATUS_CONFIG).map(([value, config]) => ({
      value,
      label: config.label,
    })),
  ];

  const handleFilterChange = (key: keyof OrderFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (search: string) => {
    handleFilterChange('search', search || undefined);
  };

  const handleClearFilters = () => {
    const clearedFilters: OrderFiltersType = {
      search: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.status || filters.startDate || filters.endDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by order number, table..."
            onSearch={handleSearchChange}
            defaultValue={filters.search || ''}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="md"
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Status"
              value={filters.status || ''}
              onChange={(e) =>
                handleFilterChange('status', e.target.value || undefined)
              }
              options={statusOptions}
            />
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate || ''}
              onChange={(e) =>
                handleFilterChange('startDate', e.target.value || undefined)
              }
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate || ''}
              onChange={(e) =>
                handleFilterChange('endDate', e.target.value || undefined)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
