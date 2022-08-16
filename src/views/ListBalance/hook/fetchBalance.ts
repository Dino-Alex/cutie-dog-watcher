import { useWeb3React } from "@web3-react/core"
import BigNumber from "bignumber.js"
import erc20ABI from 'config/abi/erc20.json'
import useRefresh from "hooks/useRefresh"
import { useEffect, useState } from "react"
import { multicallv2 } from "utils/multicall"
import { ConfigBalance } from "../config"

export const GetTokenBalance = (ID) => {
    const [tokenBalance, setTokenBalce] = useState<any[]>();
    const { fastRefresh } = useRefresh()
    const TokenBalce = [];

    useEffect(() => {
      const fetchBalance = async () => {
        try {
          const getById = ConfigBalance.filter(d=>  d.id.toString()  === ID.toString())
            const calls = [];
            for(let i = 0; i<getById[0].token.length; i++){
              calls.push({
                address: getById[0].token[i].addressToken,
                name: 'balanceOf',
                params: [getById[0].address]
              })
          }
            const result = await multicallv2(erc20ABI, calls)
            for(let x = 0; x < result.length; x++){
            TokenBalce.push({
              amount: Number(new BigNumber(result[x].balance._hex).toJSON())/1E18,
              tokenName: getById[0].token[x].tokenName
            })
            }
            setTokenBalce(TokenBalce)

        } catch (e) {
          console.log(e)
        }
      }
        fetchBalance()
    }, [fastRefresh, tokenBalance])
  
    return { tokenBalance }
}