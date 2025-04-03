import { useEffect, useState, ChangeEvent } from 'react';
import { Link } from "react-router";
import moment, { Moment } from 'moment';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useGlobalLoading } from '../contexts/GlobalLoadingContext';
import { TaskResponse } from '../types/TaskResponse';
import { useToaster } from '../contexts/ToasterContext';

export const Tasks = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);
  const [paginationQuery, setPaginationQuery] = useState({
    currentPage: 0,
    total: 0,
    perPage: 0, 
  });

  const globalLoading = useGlobalLoading();
  const toaster = useToaster();

  const fetchTasks = async (page: number) => {
    globalLoading.setIsLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_URL}/tasks`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        params: {
          start_date: startDate != null ? moment(startDate).unix() : null,
          end_date: endDate != null ? moment(endDate).unix() : null,
          page
        } 
      });
      setTasks(response.data.items);
      setPaginationQuery({
        total: response.data.total,
        perPage: response.data.per_page,
        currentPage: response.data.current_page,
      });
    } catch (err: any) {
      console.log(err);
      toaster.open(`Error: ${err.message}`);
    } finally {
      globalLoading.setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      globalLoading.setIsLoading(true);
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`);
      await fetchTasks(paginationQuery.currentPage);
    } catch (err: any) {
      console.error('err', err);
      toaster.open(`Error: ${err.message}`);
    } finally {
      globalLoading.setIsLoading(false);
    }
  };

  const clickPagination = async (
    event: ChangeEvent<unknown>, 
    value: number
  ) => {
    console.log(event);
    fetchTasks(value);
  };

  useEffect(() => {
    fetchTasks(1);
  }, []);

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2,
          width: '50%' 
        }} 
        mb={2}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Start date"
            value={startDate}
            onChange={(newDate) => setStartDate(newDate)}
          /> 
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="End date"
            value={endDate}
            onChange={(newDate) => setEndDate(newDate)}
          /> 
        </LocalizationProvider>
        <Button variant="contained" onClick={_ => fetchTasks(1)}>Filter</Button>
      </Box>
      <Box>
        <Link to="/create">
          <Button variant="contained">New Task</Button>
        </Link>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map(task => {
              return (
                <TableRow
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    {moment.unix(task.created_at).format('YYYY-MM-DD hh:mm:ss')}
                  </TableCell>
                  <TableCell>
                    {task.title}
                  </TableCell>
                  <TableCell>
                    {task.description}
                  </TableCell>
                  <TableCell>
                    {task.status}
                  </TableCell>
                  <TableCell>
                    <Link to={`/${task.id}`}>
                      <Button sx={{ marginRight: 1 }} variant="contained">
                        Update
                      </Button>
                    </Link>
                    <Button onClick={() => deleteTask(task.id)} variant="contained">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <Pagination 
          count={Math.ceil(paginationQuery.total / paginationQuery.perPage)} 
          onChange={clickPagination}
          page={paginationQuery.currentPage}
          size="large" 
          shape="rounded" 
          variant="outlined" 
        />
      </Box>
    </Box>
  );
};
