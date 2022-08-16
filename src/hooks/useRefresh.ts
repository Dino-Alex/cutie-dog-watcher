import { useContext } from 'react'
import { RefreshContext } from 'contexts/RefreshContext'



const useRefresh = () => {
  const { fast, slow , immediate } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow , immediateRefresh: immediate }
}

export default useRefresh
