import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router";
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectSingle } from '../components/SelectSingle';
import { ErrorText } from '../components/ErrorText';
import { useGlobalLoading } from '../contexts/GlobalLoadingContext';
import { useToaster } from '../contexts/ToasterContext';

export const TaskCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [errors, setErrors] = useState({
    status: [],
    description: [],
    title: [],
  });

  const navigate = useNavigate();
  const globalLoading = useGlobalLoading();
  const toaster = useToaster();

  const handleSelectStatus = (ev: SelectChangeEvent) => {
    setSelectedStatus(ev.target.value as string);
  };

  const save = async () => {
    try {
      globalLoading.setIsLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/tasks`;
      await axios.post(url, {
        title, description, status: selectedStatus
      });
      toaster.open('Task created!');
      navigate('/');
    } catch (err: any) {
      console.log('err', err);
      if (err.status != 422) {
        toaster.open(`Error: ${err.message}`);
        return;
      }
      setErrors({
        title: err.response.data.errors.title ?? [],
        status: err.response.data.errors.status ?? [],
        description: err.response.data.errors.description ?? [],
      });
      
    } finally {
      globalLoading.setIsLoading(false);
    }
  };

  const fetchStatuses = async () => {
    const url = `${import.meta.env.VITE_API_URL}/task-statuses`;
    const response = await axios.get(url);
    return response;
  };

  const init = async () => {
    try {
      globalLoading.setIsLoading(true);
      const response = await fetchStatuses();
      setTaskStatuses(response.data.items);
    } catch (err: any) {
      console.error('err', err);
      toaster.open(`Error: ${err.message}`);
    } finally {
      globalLoading.setIsLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} mb={4} mt={4}>
        <Typography>Create New Task</Typography>
        <Typography>* Required</Typography>
        <TextField 
          label="* Title" 
          variant="outlined" 
          type="text"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
        />
        <ErrorText errors={errors['title']} />

        <TextField 
          label="Description" 
          variant="outlined" 
          type="text"
          value={description}
          onChange={ev => setDescription(ev.target.value)}
        />
        <ErrorText errors={errors['description']} />

        <SelectSingle 
          id="status"
          value={selectedStatus} 
          handleChange={handleSelectStatus}
          label={'* Status'}
          options={taskStatuses.map(status => ({ value: status, label: status}))}
        />
        <ErrorText errors={errors['status']} />

      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={save}
          size="large" 
          variant="contained"
        >
          Save
        </Button>
        <Button 
          component={Link} 
          to="/" 
          size="large" 
          variant="contained"
        >
          Back
        </Button>
      </Box>
    </Container>
  );
};
