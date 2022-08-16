import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import EditOffIcon from '@mui/icons-material/EditOff'
import { Backdrop, Box, Fade, Grid, IconButton, Modal, Stack, Tooltip, Typography } from '@mui/material'
import { useTranslation } from '@pancakeswap/localization'
import { ArrowBackIcon, ArrowForwardIcon, Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { PoolData } from 'state/info/types'
import styled from 'styled-components'
import ModalCreate from 'views/Info/Tokens/Modal/ModalCreate'
import { FetchTokenBalance } from "../../hooks/useTotalSupply"
import { Arrow, Break, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'


/**
 *  Columns on different layouts
 *  5 = | # | Pool | TVL | Volume 24H | Volume 7D |
 *  4 = | # | Pool |     | Volume 24H | Volume 7D |
 *  3 = | # | Pool |     | Volume 24H |           |
 *  2 = |   | Pool |     | Volume 24H |           |
 */
const TEAMS = [
  { name: "Team 1", address: "0x3bb2b2455356de1cd8c91030b1864210c5ddc7f1" },
  { name: "Team 2", address: "0x92d47b6e3dce6471f42021db650a611af4257771" },
  { name: "Team 3", address: "0xa3438081956b35d5c23203197360f7b082cc4c9d" },
  { name: "Team 4", address: "0xbc8aa54b5ccb8c6a306c07d8c70a9623970e160f" }
];

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 3.5fr repeat(5, 1fr);

  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(1, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 2.5fr repeat(1, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
`

const LinkWrapper = styled(NextLinkFromReactRouter)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const SORT_FIELD = {
  volumeUSD: 'volumeUSD',
  liquidityUSD: 'liquidityUSD',
  volumeUSDWeek: 'volumeUSDWeek',
  lpFees24h: 'lpFees24h',
  lpApr7d: 'lpApr7d',
}

const LoadingRow: React.FC<React.PropsWithChildren> = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
)

const TableLoader: React.FC<React.PropsWithChildren> = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
)

const DataRow = () => {
  const [tokenBalances, setTokenBalances] = useState({ tokenBalanceVal: [0] });
  useEffect(() => {
    const getSaleItems = async () => {
      try {
        const result = await FetchTokenBalance()
        setTokenBalances(result)
      } catch (e) {
        console.log(e)
      }
    }
    getSaleItems();
  }, [])
  // console.log("tokenBalances",tokenBalances.tokenBalanceVal[1])

  // OpenModal
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [ID, setID] = useState(0);

  function handleClickCreate() {
    setOpen(true);
  }
  function handleClick(e: any) {
    setOpen(true);
    setID(e)
  }

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

  return (
    (TEAMS as any).map((data, index) => {
      return (
        <ResponsiveGrid>
          <Text>{index + 1}</Text>
          <Flex>
            <Text ml="8px">
              {TEAMS[index].name}
            </Text>
          </Flex>
          <Flex>
            <Text ml="8px">
              {TEAMS[index].address.substring(0, 4) + "..." + TEAMS[index].address.substring(38, 42)}
            </Text>
          </Flex>
          <Flex>
            <Text>
              {Math.round(tokenBalances.tokenBalanceVal[index]).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </Flex>
          <Flex>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Tooltip placement="top" title="Update"
              >
                <IconButton color="primary" aria-label="delete" size="large">
                  <EditOffIcon sx={{ fontSize: '2rem' }}
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
          </Flex>
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
                    Create Address
                  </Typography>
                  <ModalCreate
                  />
                </CustomBox>
              </Fade>
            </Modal>
          </Grid>
        </ResponsiveGrid>
      )
    })
  )
}


interface PoolTableProps {
  poolDatas: PoolData[]
  loading?: boolean // If true shows indication that SOME pools are loading, but the ones already fetched will be shown
}

const TeamWalletTable: React.FC<React.PropsWithChildren<PoolTableProps>> = ({ poolDatas, loading }) => {
  // for sorting
  const [sortField, setSortField] = useState(SORT_FIELD.volumeUSD)
  const [sortDirection, setSortDirection] = useState<boolean>(true)
  const { t } = useTranslation()

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  useEffect(() => {
    let extraPages = 1
    if (poolDatas.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(poolDatas.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages)
  }, [poolDatas])

  const sortedPools = useMemo(() => {
    return poolDatas
      ? poolDatas
        .sort((a, b) => {
          if (a && b) {
            return a[sortField as keyof PoolData] > b[sortField as keyof PoolData]
              ? (sortDirection ? -1 : 1) * 1
              : (sortDirection ? -1 : 1) * -1
          }
          return -1
        })
        .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [page, poolDatas, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  // Open Modal Create
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  function handleClickCreate() {
    setOpen(true);
  }
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

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          {t('Name')}
        </Text>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSD)}
          textTransform="uppercase"
        >
          {t('Address')} {arrow(SORT_FIELD.volumeUSD)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          onClick={() => handleSort(SORT_FIELD.volumeUSDWeek)}
          textTransform="uppercase"
        >
          {t('Balance')} {arrow(SORT_FIELD.volumeUSDWeek)}
        </ClickableColumnHeader>
        <ClickableColumnHeader
          color="secondary"
          fontSize="12px"
          bold
          textTransform="uppercase"
        >
          {t('Action')}
        </ClickableColumnHeader>
        <Button
          onClick={() => handleClickCreate()}
        >
          {t('Create')}
        </Button>
      </ResponsiveGrid>
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
                Create Address
              </Typography>
              <ModalCreate
              />
            </CustomBox>
          </Fade>
        </Modal>
      </Grid>
      <Break />
      {sortedPools.length > 0 ? (
        <>
          {sortedPools.map((poolData, i) => {
            if (poolData) {
              return (
                <Fragment key={poolData.address}>
                  <DataRow index={(page - 1) * ITEMS_PER_INFO_TABLE_PAGE + i} poolData={poolData} />
                  <Break />
                </Fragment>
              )
            }
            return null
          })}
          {loading && <LoadingRow />}
          <PageButtons>
            <Arrow
              onClick={() => {
                setPage(page === 1 ? page : page - 1)
              }}
            >
              <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
            </Arrow>

            <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>

            <Arrow
              onClick={() => {
                setPage(page === maxPage ? page : page + 1)
              }}
            >
              <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
            </Arrow>
          </PageButtons>
        </>
      ) : (
        <>
          <TableLoader />
          {/* spacer */}
          <Box />
        </>
      )}
    </TableWrapper>
  )
}

export default TeamWalletTable

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