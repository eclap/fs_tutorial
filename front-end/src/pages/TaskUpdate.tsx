import { useState, useEffect } from 'react';
import { Link, useParams } from "react-router";
import axios from 'axios';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ErrorText } from '../components/ErrorText';
import { SelectChangeEvent } from '@mui/material/Select';
import { SelectSingle } from '../components/SelectSingle';
import { useGlobalLoading } from '../contexts/GlobalLoadingContext';
import { useToaster } from '../contexts/ToasterContext';

export const TaskUpdate = () => {
  const [task, setTask] = useState({
    id: '',
    created_at: '',
    title: '',
    description: '',
    status: ''
  });
  const [taskStatuses, setTaskStatuses] = useState([]);
  const [errors, setErrors] = useState({
    status: [],
    description: [],
    title: [],
  });

  const params = useParams();
  const globalLoading = useGlobalLoading();
  const toaster = useToaster();

  const taskId = params.taskId;

  const handleSelectStatus = (ev: SelectChangeEvent) => {
    setTask({ ...task, status: ev.target.value as string });
  };

  const save = async () => {
    try {
      globalLoading.setIsLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/tasks/${taskId}`;
      await axios.put(url, {
        title: task.title, 
        description: task.description, 
        status: task.status, 
      });
      toaster.open('Update successful!');
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

  const fetchTask = async () => {
    const url = `${import.meta.env.VITE_API_URL}/tasks/${taskId}`;
    const response = await axios.get(url);
    return response; 
  };

  const init = async () => {
    try {
      globalLoading.setIsLoading(true);
      const responses = await Promise.all([fetchStatuses(), fetchTask()]);
      setTaskStatuses(responses[0].data.items);
      setTask(responses[1].data);
      console.log(responses[1]);
    } catch (err: any) {
      console.log('err', err);
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
        <Typography>Update Task</Typography>
        <TextField 
          label="Title" 
          variant="outlined" 
          type="text"
          value={task.title}
          onChange={ev => setTask({...task, title: ev.target.value})}
        />
        <ErrorText errors={errors['title']} />

        <TextField 
          label="Description" 
          variant="outlined" 
          type="text"
          value={task.description}
          onChange={ev => setTask({...task, description: ev.target.value})}
        />
        <ErrorText errors={errors['description']} />

        <SelectSingle 
          id="status"
          value={task.status} 
          handleChange={handleSelectStatus}
          label={'Status'}
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
