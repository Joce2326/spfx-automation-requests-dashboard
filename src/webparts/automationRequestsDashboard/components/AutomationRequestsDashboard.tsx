import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Spinner,
  Text,
  Title1,
  Subtitle1,
  Badge,
  Input,
  Select,
  Button,
  Tab,
  TabList
} from '@fluentui/react-components';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import { SharePointService } from '../services/SharePointService';
import { IRequestItem } from '../models/IRequestItem';

import NewRequestPanel from './NewRequestPanel';
//import { Dropdown, Option } from '@fluentui/react-components';

//import { Input } from '@fluentui/react-components';

export interface IAutomationRequestsDashboardProps {
  context: WebPartContext;
  listName: string;
}

const AutomationRequestsDashboard: React.FC<IAutomationRequestsDashboardProps> = ({ context, listName }) => {
  const [items, setItems] = useState<IRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
const [selectedPriority, setSelectedPriority] = useState<string>('All');

const [searchText, setSearchText] = useState<string>('');

const [selectedItem, setSelectedItem] = useState<IRequestItem | null>(null);

const [isFormOpen, setIsFormOpen] = useState(false);
const [editingItem, setEditingItem] = useState<IRequestItem | null>(null);

const [itemToDelete, setItemToDelete] = useState<IRequestItem | null>(null);
const [isDeleting, setIsDeleting] = useState(false);

const [selectedStatus, setSelectedStatus] = useState<string>('All');

const loadData = async (): Promise<void> => {
  try {
    setLoading(true);
    setError('');

    const service = new SharePointService(context);
    const data = await service.getRequests(listName);

    setItems(data);
  } catch (err) {
    console.error('Error loading requests:', err);
    setError('Failed to load Automation Requests.');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  void loadData();
}, [context, listName]);


  const getPriorityAppearance = (priority?: string): "filled" | "tint" | "outline" => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'filled';
      case 'medium':
        return 'tint';
      default:
        return 'outline';
    }
  };

  const openNewForm = (): void => {
  setEditingItem(null);
  setIsFormOpen(true);
};

const openEditForm = (item: IRequestItem): void => {
  setEditingItem(item);
  setIsFormOpen(true);
};

const closeForm = (): void => {
  setEditingItem(null);
  setIsFormOpen(false);
};

const priorityOrder: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3
};

  const filteredItems = items.filter((item) => {
  const matchDepartment =
    selectedDepartment === 'All' || item.department === selectedDepartment;

  const matchPriority =
    selectedPriority === 'All' || item.priority === selectedPriority;

  const search = searchText.toLowerCase();

  const matchStatus =
      selectedStatus === 'All' || item.status === selectedStatus;

const matchSearch =
  !searchText ||
  item.title?.toLowerCase().includes(search) ||
  item.description?.toLowerCase().includes(search) ||
  item.department?.toLowerCase().includes(search) ||
  item.requestType?.toLowerCase().includes(search);

  return matchDepartment && matchPriority && matchSearch && matchStatus;

  
})

 .sort((a, b) => {
    const aPriority = priorityOrder[a.priority?.toLowerCase() || 'low'] || 99;
    const bPriority = priorityOrder[b.priority?.toLowerCase() || 'low'] || 99;
    return aPriority - bPriority;
  });

const totalRequests = filteredItems.length;

const highPriorityCount = filteredItems.filter(
  (item) => item.priority?.toLowerCase() === 'high'
).length;

const mediumPriorityCount = filteredItems.filter(
  (item) => item.priority?.toLowerCase() === 'medium'
).length;

const lowPriorityCount = filteredItems.filter(
  (item) => item.priority?.toLowerCase() === 'low'
).length;

const confirmDelete = (item: IRequestItem): void => {
  setItemToDelete(item);
};

const cancelDelete = (): void => {
  setItemToDelete(null);
};

const handleDelete = async (): Promise<void> => {
  if (!itemToDelete) {
    return;
  }

  try {
    setIsDeleting(true);

    const service = new SharePointService(context);
    await service.deleteRequest(listName, itemToDelete.id);

    if (selectedItem?.id === itemToDelete.id) {
      setSelectedItem(null);
    }

    setItemToDelete(null);
    await loadData();
  } catch (error) {
    console.error('Error deleting request:', error);
  } finally {
    setIsDeleting(false);
  }
};

  return (
  <div
  style={{
    padding: '24px',
    maxWidth: '1200px'
  }}
>
    {/* TITLE */}
    <Title1>Automation Requests Dashboard</Title1>
<Subtitle1 style={{ marginTop: '8px', marginBottom: '20px', display: 'block' }}>
  View and track automation requests submitted by the business.
</Subtitle1>

    {/* SEARCH */}
   <div
  style={{
    marginBottom: '16px',
    maxWidth: '420px'
  }}
>
  <Input
    placeholder="Search by title..."
    value={searchText}
    onChange={(_, data) => setSearchText(data.value)}
    style={{ width: '100%' }}
  />
</div>

  {isFormOpen && (
  <NewRequestPanel
    isOpen={isFormOpen}
    item={editingItem}
    listName={listName}
    context={context}
    onDismiss={closeForm}
    onSaved={async () => {
      closeForm();
      await loadData();
    }}
  />

  
)}

<div
  style={{
    background: '#fff',
    border: '1px solid #e1dfdd',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  }}
>
   
  <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '12px',
    flexWrap: 'wrap'
  }}
>
  <Text weight="semibold">Filters</Text>

  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
    <Button appearance="primary" onClick={openNewForm}>
      New Request
    </Button>

    <Button
      appearance="secondary"
      onClick={() => {
        setSelectedDepartment('All');
        setSelectedPriority('All');
        setSelectedStatus('All');
        setSearchText('');
        setSelectedItem(null);
      }}
    >
      Clear filters
    </Button>
  </div>
</div>

<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '20px'
  }}
>
  <div>
    <Text size={200} style={{ display: 'block', marginBottom: '6px' }}>
      Department
    </Text>
    <Select
      value={selectedDepartment}
      onChange={(ev) =>
        setSelectedDepartment((ev.target as HTMLSelectElement).value)
      }
      style={{ width: '100%' }}
    >
      <option value="All">All Departments</option>
      <option value="IT">IT</option>
      <option value="HR">HR</option>
      <option value="Operations">Operations</option>
      <option value="Finance">Finance</option>
    </Select>
  </div>

  <div>
    <Text size={200} style={{ display: 'block', marginBottom: '6px' }}>
      Priority
    </Text>
    <Select
      value={selectedPriority}
      onChange={(ev) =>
        setSelectedPriority((ev.target as HTMLSelectElement).value)
      }
      style={{ width: '100%' }}
    >
      <option value="All">All Priorities</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </Select>
  </div>
</div>

<div>
  <Text
    weight="semibold"
    style={{ display: 'block', marginBottom: '8px' }}
  >
    Status
  </Text>

  <TabList
    selectedValue={selectedStatus}
    onTabSelect={(_, data) => setSelectedStatus(String(data.value))}
  >
    <Tab value="All">All</Tab>
    <Tab value="New">New</Tab>
    <Tab value="Pending Approval">Pending Approval</Tab>
    <Tab value="Approved">Approved</Tab>
    <Tab value="Rejected">Rejected</Tab>
  </TabList>
</div>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '12px'
    }}
  >
   
  </div>
</div>


   {/* KPI CARDS */}
{!loading && !error && (
 <div
  style={{
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  }}
>
    {/* TOTAL */}
    <Card
      style={{
  padding: '12px',
  borderLeft: '6px solid #605e5c',
  borderRadius: '10px',
  minWidth: '150px',
  maxWidth: '150px',   // 👈 important
  flex: '1 1 160px'    // 👈 important
}}
    >
      <Text weight="semibold">Total Requests</Text>
      <Text size={600} weight="semibold" style={{ marginTop: '10px' }}>
        {totalRequests}
      </Text>
    </Card>

    {/* HIGH */}
    <Card
      style={{
  padding: '12px',
  borderLeft: '6px solid #d13438',
  borderRadius: '10px',
  minWidth: '150px',
  maxWidth: '180px',   // 👈 important
  flex: '1 1 160px'    // 👈 important
}}
    >
      <Text weight="semibold">High Priority</Text>
      <Text size={600} weight="semibold" style={{ marginTop: '10px', color: '#d13438' }}>
        {highPriorityCount}
      </Text>
    </Card>

    {/* MEDIUM */}
    <Card
      style={{
  padding: '12px',
  borderLeft: '6px solid #ff8c00',
  borderRadius: '10px',
  minWidth: '150px',
  maxWidth: '180px',   // 👈 important
  flex: '1 1 160px'    // 👈 important
}}
    >
      <Text weight="semibold">Medium Priority</Text>
      <Text size={600} weight="semibold" style={{ marginTop: '10px', color: '#ff8c00' }}>
        {mediumPriorityCount}
      </Text>
    </Card>

    {/* LOW */}
    <Card
      style={{
  padding: '12px',
  borderLeft: '6px solid #107c10',
  borderRadius: '10px',
  minWidth: '150px',
  maxWidth: '180px',   // 👈 important
  flex: '1 1 160px'    // 👈 important
}}
    >
      <Text weight="semibold">Low Priority</Text>
      <Text size={600} weight="semibold" style={{ marginTop: '10px', color: '#107c10' }}>
        {lowPriorityCount}
      </Text>
    </Card>
  </div>
)}

{!loading && !error && items.length > 0 && (
  <>
    <Text style={{ display: 'block', marginBottom: '12px' }}>
      Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> requests
    </Text>

    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
      {selectedDepartment !== 'All' && (
        <Badge appearance="tint">Department: {selectedDepartment}</Badge>
      )}

      {selectedPriority !== 'All' && (
        <Badge appearance="tint">Priority: {selectedPriority}</Badge>
      )}

      {selectedStatus !== 'All' && (
        <Badge appearance="tint">Status: {selectedStatus}</Badge>
      )}

      {!!searchText && (
        <Badge appearance="tint">Search: {searchText}</Badge>
      )}
    </div>

    {filteredItems.length === 0 ? (
      <Card style={{ padding: '20px', marginTop: '16px' }}>
        <Text weight="semibold">No matching requests found</Text>
        <Text>
          Try changing the search text or clearing one or more filters.
        </Text>
      </Card>
    ) : (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              cursor: 'pointer',
              padding: '16px',
              borderRadius: '10px',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <CardHeader
              header={<Text weight="semibold">{item.title}</Text>}
              description={
                <Text>
                  {item.department || '-'} | {item.requestType || '-'}
                </Text>
              }
            />

            <div style={{ marginTop: '12px', marginBottom: '12px' }}>
              <Badge appearance={getPriorityAppearance(item.priority)}>
                {item.priority || 'No Priority'}
              </Badge>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <Text>
                <strong>Description:</strong> {item.description || '-'}
              </Text>

              <Text>
                <strong>Expected Benefit:</strong> {item.expectedBenefit || '-'}
              </Text>

              <Text>
                <strong>Requested By:</strong> {item.requestedByName || '-'}
              </Text>
            </div>

            <div
  style={{
    marginTop: '16px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px'
  }}
>
  <Button
    appearance="secondary"
    onClick={(ev) => {
      ev.stopPropagation();
      openEditForm(item);
    }}
  >
    Edit
  </Button>

  <Button
    appearance="secondary"
    onClick={(ev) => {
      ev.stopPropagation();
      confirmDelete(item);
    }}
  >
    Delete
  </Button>
</div>
          </Card>
        ))}
      </div>
    )}
  </>
)}

{selectedItem && (
  <Card style={{ marginTop: '20px', padding: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title1>{selectedItem.title}</Title1>
      <button onClick={() => setSelectedItem(null)}>Close</button>
    </div>

    <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
      <Text><strong>Department:</strong> {selectedItem.department || '-'}</Text>
      <Text><strong>Request Type:</strong> {selectedItem.requestType || '-'}</Text>
      <Text><strong>Priority:</strong> {selectedItem.priority || '-'}</Text>
      <Text><strong>Description:</strong> {selectedItem.description || '-'}</Text>
      <Text><strong>Expected Benefit:</strong> {selectedItem.expectedBenefit || '-'}</Text>
      <Text><strong>Requested By:</strong> {selectedItem.requestedByName || '-'}</Text>
    </div>
  </Card>
)}

    {/* STATES */}
    {loading && <Spinner label="Loading requests..." />}
    {!loading && error && <Text>{error}</Text>}
    {!loading && !error && items.length === 0 && (
      <Text>No requests found.</Text>
    )}

    

  

    {/* DETAILS DIALOG */}
  {/*  {selectedItem && (
  <Dialog
    open
    onOpenChange={(_, data) => !data.open && setSelectedItem(null)}
  >
    <DialogSurface>
      <DialogBody>
        <DialogTitle>{selectedItem.title}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gap: '12px' }}>
            <Text><strong>Department:</strong> {selectedItem.department || '-'}</Text>
            <Text><strong>Request Type:</strong> {selectedItem.requestType || '-'}</Text>
            <Text><strong>Priority:</strong> {selectedItem.priority || '-'}</Text>
            <Text><strong>Description:</strong> {selectedItem.description || '-'}</Text>
            <Text><strong>Expected Benefit:</strong> {selectedItem.expectedBenefit || '-'}</Text>
            <Text><strong>Requested By:</strong> {selectedItem.requestedByName || '-'}</Text>
          </div>
        </DialogContent>
      </DialogBody>
    </DialogSurface>
  </Dialog>
)}*/}

{itemToDelete && (
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
    onClick={cancelDelete}
  >
    <div
      style={{
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '420px',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}
      onClick={(ev) => ev.stopPropagation()}
    >
      <h3 style={{ marginTop: 0 }}>Delete Request</h3>

      <Text>
        Are you sure you want to delete{' '}
        <strong>{itemToDelete.title}</strong>?
      </Text>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: '20px'
        }}
      >
        <Button onClick={cancelDelete} disabled={isDeleting}>
          Cancel
        </Button>

        <Button appearance="primary" onClick={handleDelete} disabled={isDeleting}>
          Delete
        </Button>
      </div>
    </div>
  </div>
)}

  </div>
);
};

export default AutomationRequestsDashboard;