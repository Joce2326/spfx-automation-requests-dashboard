import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Field,
  Input,
  Select,
  Textarea,
  
} from '@fluentui/react-components';

import { INewRequestPanelProps } from './INewRequestPanelProps';
import { IRequestCreate } from '../models/IRequestCreate';
import { SharePointService } from '../services/SharePointService';

const NewRequestPanel: React.FC<INewRequestPanelProps> = ({
  isOpen,
  listName,
  context,
  item,
  onDismiss,
  onSaved
}) => {
  const [formData, setFormData] = useState<IRequestCreate>({
    title: '',
    department: '',
    requestType: '',
    priority: '',
    description: '',
    expectedBenefit: ''
  });

  const [loading, setLoading] = useState(false);

  const isEditMode = !!item;

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        department: item.department || '',
        requestType: item.requestType || '',
        priority: item.priority || '',
        description: item.description || '',
        expectedBenefit: item.expectedBenefit || ''
      });
    } else {
      setFormData({
        title: '',
        department: '',
        requestType: '',
        priority: '',
        description: '',
        expectedBenefit: ''
      });
    }
  }, [item]);

  const handleChange = (field: keyof IRequestCreate, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true);

      const service = new SharePointService(context);

      if (isEditMode && item) {
        await service.updateRequest(listName, item.id, formData);
      } else {
        await service.createRequest(listName, formData);
      }

      await onSaved();
    } catch (error) {
      console.error('Error saving request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
  return null;
}

return (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}
    onClick={onDismiss}
  >
    <div
      style={{
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '600px',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}
      onClick={(ev) => ev.stopPropagation()}
    >
      <h2 style={{ marginTop: 0 }}>
        {isEditMode ? 'Edit Request' : 'New Request'}
      </h2>

      <div style={{ display: 'grid', gap: '12px' }}>
        <Field label="Title" required>
          <Input
            value={formData.title}
            onChange={(_, data) => handleChange('title', data.value)}
          />
        </Field>

        <Field label="Department" required>
          <Select
            value={formData.department}
            onChange={(ev) =>
              handleChange('department', (ev.target as HTMLSelectElement).value)
            }
          >
            <option value="">Select department</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="Operations">Operations</option>
          </Select>
        </Field>

        <Field label="Request Type" required>
          <Select
            value={formData.requestType}
            onChange={(ev) =>
              handleChange('requestType', (ev.target as HTMLSelectElement).value)
            }
          >
            <option value="">Select request type</option>
            <option value="Approval Workflow">Approval Workflow</option>
            <option value="Notification">Notification</option>
            <option value="Document Process">Document Process</option>
            <option value="Integration">Integration</option>
          </Select>
        </Field>

        <Field label="Priority" required>
          <Select
            value={formData.priority}
            onChange={(ev) =>
              handleChange('priority', (ev.target as HTMLSelectElement).value)
            }
          >
            <option value="">Select priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Field>

        <Field label="Description" required>
          <Textarea
            value={formData.description}
            onChange={(_, data) => handleChange('description', data.value)}
          />
        </Field>

        <Field label="Expected Benefit">
          <Textarea
            value={formData.expectedBenefit}
            onChange={(_, data) => handleChange('expectedBenefit', data.value)}
          />
        </Field>

        <Field label="Status">
  <Select
    value={formData.status || 'New'}
    onChange={(ev) =>
      handleChange('status', (ev.target as HTMLSelectElement).value)
    }
  >
    <option value="New">New</option>
    <option value="Pending Approval">Pending Approval</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </Select>
</Field>


      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        <Button appearance="primary" onClick={handleSave} disabled={loading}>
          {isEditMode ? 'Update Request' : 'Create Request'}
        </Button>
        <Button onClick={onDismiss} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  </div>
);


};



export default NewRequestPanel;