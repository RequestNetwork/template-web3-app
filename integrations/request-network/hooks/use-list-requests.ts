import { EventEmitter } from 'events'

import { useCallback } from 'react'

import { ICurrencyManager } from '@requestnetwork/currency'
import { Request, RequestNetwork, Types } from '@requestnetwork/request-client.js'

import { useRequestClient } from './use-request-client'
import { useCurrency } from '../contexts/currency-context'
import { IParsedRequest, parseRequest } from '../utils/parse-request'

interface IBalanceEvents {
  finished: () => void
  update: (request: IParsedRequest) => void
}

export class BalanceEventEmitter extends EventEmitter {
  private _untypedOn = this.on
  private _untypedEmit = this.emit
  public on = <K extends keyof IBalanceEvents>(event: K, listener: IBalanceEvents[K]): this => this._untypedOn(event, listener)
  public emit = <K extends keyof IBalanceEvents>(event: K, ...args: Parameters<IBalanceEvents[K]>): boolean => this._untypedEmit(event, ...args)
}

export const useListRequests = () => {
  const { currencyManager } = useCurrency()
  const requestClient = useRequestClient()
  return useCallback((account: string, network: string) => listRequests(requestClient, account, network, currencyManager), [currencyManager])
}

export const listRequests = async (requestClient: RequestNetwork, account: string, network: string, currencyManager: ICurrencyManager) => {
  if (!account) {
    throw new Error('Not connected')
  }

  const requests = await requestClient.fromIdentity(
    {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: account,
    },
    undefined,
    {
      disablePaymentDetection: true,
    }
  )
  // console.error("requests", requests);

  const list = []
  for (const request of requests) {
    try {
      const parsedRequest = await parseRequest({
        requestId: request.requestId,
        data: request.getData(),
        network: network as string,
        pending: false,
        currencyManager,
      })
      parsedRequest.loaded = false
      list.push(parsedRequest)
    } catch (e) {
      console.log(`request ${request.requestId} could not be parsed: ${e}`)
    }
  }
  const sorted = list.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())

  const emitter = new BalanceEventEmitter()

  return {
    // preloaded requests, without balance
    requests: sorted,
    // a function to start loading balances.
    // The callback is called for each updated balance.
    loadBalances: () => loadBalances(requests, sorted, network as string, emitter, currencyManager),
    on: emitter.on,
  }
}

const loadBalances = async (
  requests: Request[],
  sortedRequests: IParsedRequest[],
  network: string,
  emitter: BalanceEventEmitter,
  currencyManager: ICurrencyManager
) => {
  let i = 0
  // update balances by batches of 10.
  while (i < sortedRequests.length) {
    const promises = []
    for (let j = i; j < Math.min(i + 10, sortedRequests.length); j++) {
      const parsedRequest = sortedRequests[j]
      const request = requests.find((x) => x.requestId === parsedRequest.requestId)
      if (!request) {
        continue
      }
      const promise = loadBalance(request, network, currencyManager)

      promise.then((req) => req && emitter.emit('update', req))
      promises.push(promise)
    }

    await Promise.all(promises)
    i += 10
  }
  emitter.emit('finished')
}

const loadBalance = async (request: Request, network: string, currencyManager: ICurrencyManager) => {
  try {
    await request.refreshBalance()
  } catch (e) {
    return null
  }
  const newParsedRequest = await parseRequest({
    requestId: request.requestId,
    data: request.getData(),
    network,
    pending: false,
    currencyManager,
  })
  newParsedRequest.loaded = true
  return newParsedRequest
}
