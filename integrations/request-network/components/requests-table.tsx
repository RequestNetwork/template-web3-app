import React from 'react'

import { Address } from '@turbo-eth/core-wagmi'

import { TableCore } from '../../../components/shared/table/table-core'
import { TimeFromUtc } from '../../../components/shared/time-from-utc'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { useRequestList } from '../contexts/request-list-context'

export const RenderRequestsTable = () => {
  const { loading, requests } = useRequestList()
  if (loading) return <div className="py-6 text-center">Loading...</div>
  return (
    <div>
      <RequestsTable data={requests} className="w-full flex-1" />
    </div>
  )
}

export function RequestsTable({ data, className }: any) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: (props: any) => <TimeFromUtc date={props.value || 0} />,
      },
      {
        Header: 'From',
        accessor: 'fromAddress',
        Cell: (props: any) => <Address address={props.value} truncate className="text-sm font-medium" />,
      },
      {
        Header: 'To',
        accessor: 'toAddress',
        Cell: (props: any) => <Address address={props.value} truncate className="text-sm font-medium" />,
      },
      // {
      //   Header: 'Amount',
      //   accessor: 'amout',
      //   Cell: (props: any) => <Amount amount={props.amount} currency={props.currency} role={props.role} className="text-sm font-medium" />,
      // },
      // TODO: Add Status
      {
        Header: () => null,
        id: 'actions',
        accessor: 'id',
        Cell: (props: any) => (
          <div className="flex items-center justify-end gap-2">
            <Popover>
              <PopoverTrigger>
                <span className="tag tag-white text-xs">View Request</span>
              </PopoverTrigger>
              <PopoverContent>View Request</PopoverContent>
            </Popover>
          </div>
        ),
      },
    ],
    []
  )
  if (!data) return null
  return <TableCore columns={columns} data={data} className={className} />
}

export default RequestsTable
