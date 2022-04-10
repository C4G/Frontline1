import LoadingIcons from 'react-loading-icons';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Scrollbar from 'src/components/Scrollbar';
import TableListHead from 'src/components/TableListHead';
import { fDateTime } from 'src/utils/formatTime';
import { AuthenticatedUser } from 'src/providers/UserProvider';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'uploadDate', label: 'Upload Date', alignRight: false },
  { id: 'savingsType', label: 'Type', alignRight: false },
  { id: 'value', label: 'Value', alignRight: false },
  { id: 'file', label: 'File', alignRight: false },
  { id: 'fileValidated', label: 'Validated', alignRight: false },
  { id: '' }
];

const savingTypes = ["Income", "Credit Score", "Savings"];

// ----------------------------------------------------------------------

export default function UserSavingsTable(props) {
  const navigate = useNavigate();
  const { role, headers } = useContext(AuthenticatedUser);
  const [page, setPage] = useState(0);
  const [validatedMap, setValidatedMap] = useState(new Map());
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [savings, setSavings] = useState([]);
  const [totalSavings, setTotalSavings] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch data for user savings.
  useEffect(() => {
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Savings/" + props.userID, { headers: headers })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then(data => {
        setSavings(data);
        let totalSaved = 0;
        for (let i = 0; i < data.length; i++) {
          let savings = data[i];
          if (savings.savingsType === 2) {
            totalSaved += savings.value;
          }
          if (savings.files) {
            for (let j = 0; j < savings.files.length; j++) {
                let file = savings.files[j];
                let map = new Map(validatedMap.set(file.id, file.isValidated));
                setValidatedMap(map);
            }
          }
        }
        setTotalSavings(totalSaved);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.userID, headers]);

  if (role !== "Administrator" && role !== "Volunteer") {
    navigate('/404', { replace: true });
    return <></>;
  }

  const handleValidatedClick = (event, file) => {
    const isValidated = validatedMap.get(file.id);
    // Make API Request.
    fetch(process.env.REACT_APP_API_SERVER_PATH + "/Files/" + file.id, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        fileId: file.id,
        isValidated: !isValidated,
      }),
    });
    // Update state map.
    const newMap = new Map(validatedMap.set(file.id, !isValidated));
    setValidatedMap(newMap);
  };
    
  const displayFileValidated = (files, index) => {
    if (files && files.length > index) {
      let file = files[index];
      const isValidated = validatedMap.get(file.id);
      return (
        <Checkbox
          checked={isValidated}
          disabled={role === "Volunteer"}
          onChange={(event) => handleValidatedClick(event, file)}
        />
      );
    }
    return "Not Uploaded";
  };

  const displayFileName = (files, index) => {
    if (files && files.length > index) {
      let file = files[index];
      let type = "";
      if (file.name.endsWith(".png")) {
        type = "image/png";
      } else if (file.name.endsWith(".jpg")) {
        type = "image/jpeg";
      }
      var blob = new Blob([Buffer.from(file.content, 'base64')], {type: type});
      return (
        <a download={file.name} href={URL.createObjectURL(blob)}>{file.name}</a>
      );
    }
    return "-";
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - savings.length) : 0;

  if (loading) {
    return <LoadingIcons.SpinningCircles />;
  }

  // Sort savings by index.
  savings.sort(function(a, b){
    return a.createdDate - b.createdDate;
  });

  return (
      <Container sx={{minWidth: 1500}}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h3" gutterBottom>
            Savings
          </Typography>
          <Typography variant="h3" gutterBottom>
            Total Saved: ${totalSavings}
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {savings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, createdDate, value, savingsType, files } = row;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                        >
                          <TableCell align="left">{fDateTime(createdDate)}</TableCell>
                          <TableCell align="left">{savingTypes[savingsType]}</TableCell>
                          <TableCell align="left">{value}</TableCell>
                          <TableCell align="left">{displayFileName(files, 0)}</TableCell>
                          <TableCell align="left">{displayFileValidated(files, 0)}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={savings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
  );
}
