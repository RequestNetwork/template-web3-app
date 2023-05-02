import { Types } from '@requestnetwork/request-client.js'
import { useQuery } from 'wagmi'

import { useRequestClient } from './use-request-client'

export const useRnGetRequestsFromAddress = (address: `0x${string}`, queryKey?: any) => {
  const requestClient = useRequestClient()

  return useQuery(['rnRequestsFromAddress', address, queryKey], () =>
    requestClient.fromIdentity(
      {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address,
      },
      undefined,
      {
        disablePaymentDetection: true,
      }
    )
  )
}
