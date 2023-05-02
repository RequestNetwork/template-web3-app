import { RequestNetwork, Types } from '@requestnetwork/request-client.js'
import { useNetwork } from 'wagmi'

import { getCurrencyList } from '../utils/get-currency-list'

export const useRequestClient = (signatureProvider?: Types.SignatureProvider.ISignatureProvider) => {
  const { chain } = useNetwork()

  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: `https://${chain?.name}.gateway.request.network/`,
    },
    signatureProvider,
    currencies: getCurrencyList(),
    httpConfig: {
      getConfirmationRetryDelay: 0,
      getConfirmationExponentialBackoffDelay: 1000,
    },
  })

  return requestClient
}
