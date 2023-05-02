'use client'

import { BranchIsWalletConnected } from '@/components/shared/branch-is-wallet-connected'
import { RenderRequestsTable } from '@/integrations/request-network/components/requests-table'
import { CurrencyProvider } from '@/integrations/request-network/contexts/currency-context'
import { RequestListProvider } from '@/integrations/request-network/contexts/request-list-context'
import { getCurrencyList } from '@/integrations/request-network/utils/get-currency-list'
import { BranchIsAuthenticated } from '@/integrations/siwe/components/branch-is-authenticated'
import { ButtonSIWELogin } from '@/integrations/siwe/components/button-siwe-login'

export default function PageIntegration() {
  return (
    <main className="w-full flex-1 overflow-auto">
      <section className="p-10">
        <div className="flex items-center justify-between">
          <h3 className="text-4xl font-normal">Requests</h3>
          <BranchIsWalletConnected>
            <BranchIsAuthenticated>
              <></>
              <div className="flex items-center gap-x-5 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-100">Login to access encrypted requests</span>
                <ButtonSIWELogin className="btn btn-emerald" />
              </div>
            </BranchIsAuthenticated>
            <span className="">Connect wallet to access cleartext requests</span>
          </BranchIsWalletConnected>
        </div>
        <hr className="my-5 opacity-50" />
        <BranchIsWalletConnected>
          <CurrencyProvider currencies={getCurrencyList()}>
            <RequestListProvider>
              <RenderRequestsTable />
            </RequestListProvider>
          </CurrencyProvider>
        </BranchIsWalletConnected>
      </section>
    </main>
  )
}
