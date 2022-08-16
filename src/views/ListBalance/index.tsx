import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Backdrop,
    Box,
    Fade,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { tokens } from 'config/constants/tokens';
import Modal from '@mui/material/Modal';
import ModalBalance from './ModalBalance';
import { ConfigBalance } from './config';
import { GetTokenBalance } from './hook/fetchBalance';

const style = {
    borderRadius: '10px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ListBalance = () => {

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [ID, setID] = useState(0);
     
    function handleClick(e: any) {
        setOpen(true);
        setID(e) 
      }

    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3, color: '#fff' }}>#</TableCell>
                            <TableCell sx={{ color: '#fff' }}>Address</TableCell>
                            <TableCell align="center" sx={{ pr: 3, color: '#fff' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ConfigBalance &&
                            ConfigBalance.map((item) => (
                                <TableRow hover key={item.id}>
                                    <TableCell sx={{ pl: 3, color: '#fff' }}>{item.id}</TableCell>
                                    <TableCell sx={{ color: '#fff' }}>{item.address}</TableCell>
                                    <TableCell align="center" sx={{ pr: 3 }}>
                                        <Stack direction="row" justifyContent="center" alignItems="center">
                                            <Tooltip placement="top" title="Show"
                                                    onClick={() => handleClick(item.id)}
                                            >
                                                <IconButton color="primary" aria-label="delete" size="large">
                                                    <VisibilityIcon  sx={{ fontSize: '2rem' }} 
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip placement="top" title="Delete">
                                                <IconButton
                                                    color="primary"
                                                    size="large"
                                                >
                                                    <DeleteIcon sx={{ fontSize: '2rem' }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Grid>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={open}>
                            <CustomBox sx={style}>
                                <Typography id="transition-modal-title" variant="h2" component="h2">
                                    Chi tiết tỉ lệ phân bổ token
                                </Typography>
                                <ModalBalance 
                                ID={ID}
                                />
                            </CustomBox>
                        </Fade>
                    </Modal>
                </Grid>
            </TableContainer>
        </Container>
    );
};

export default ListBalance;

const Container = styled.div`
width: 100%;
height: 100vh;
`
const CustomBox = styled(Box)`
    @media screen and (max-width: 600px) {
            width: 95%;
    }
    @media screen and (min-width: 601px) and (max-width: 768px) {
            width: 95%;
    }
    @media screen and (min-width: 769px) and (max-width: 1024px) {
            width: 95%;
    }
`