import React, { useState } from 'react';

import { Event } from '../../types/globalTypes';
import Icon from "../Icon";
import BaseButton from '../BaseButton';
import SelectInput from '../SelectInput';
import classNames from 'classnames';

interface EventHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  event: Event;
  onEdit: () => void;
  onBack: () => void;
};

export const EventHeader: React.FC<EventHeaderProps> = ({ 
  event, 
  onEdit,
  onBack,
  className
}) => {
  return (
    <div className={classNames(className, "flex items-center justify-between")}>
      <div className="flex items-center space-x-2">
        <BaseButton as="button" onClick={onBack}>
          <Icon name="ChevronLeft" size={20} color="gray" />
        </BaseButton>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <button
              className="bg-blue-500 text-white text-sm px-2 py-1 rounded-md shadow hover:bg-blue-600"
              onClick={onEdit}
              aria-label="Edit Event Name"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(event.startDate).toLocaleDateString()} -{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <SelectInput
        value="Draft"
        options={[
          { value: 'Draft', label: 'Draft' },
          { value: 'Published', label: 'Published' },
          { value: 'Archived', label: 'Archived' },
        ]}
        onChange={(e) => console.log(e)}
        placeholder="Draft"
        required
      />
    </div>
  );
};
