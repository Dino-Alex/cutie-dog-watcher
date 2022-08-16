import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import styled from 'styled-components';
import { GetTokenBalance } from './hook/fetchBalance';



const ModalBalance = ({ID}) => {

    const {tokenBalance} = GetTokenBalance(ID)    
    
    return (
        <Container>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#000' }}>Token</TableCell>
                            <TableCell sx={{ color: '#000' }}>Balance</TableCell>
                            {/* <TableCell sx={{ color: '#000' }}>Limit</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tokenBalance &&
                            tokenBalance.map((item, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell sx={{ color: '#000' }}>{item.tokenName}</TableCell>
                                        <TableCell sx={{ color: '#000' }}>{item.amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                        {/* {item.limit > 300 ?
                                        <TableCell sx={{ color: 'red', fontWeight: 600}}>{item.limit}$</TableCell>
                                            :
                                        <TableCell sx={{ color: '#000' }}>{item.limit}$</TableCell>
                                        } */}
                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ModalBalance;

const Container = styled.div`
    
`