import { CurrencyDefinition } from '@requestnetwork/currency'
import classNames from 'clsx'

import { Tooltip } from '@/components/ui/tooltip'

interface AmountProps {
  className?: string
  amount: number
  currency: CurrencyDefinition
  role?: 'payee' | 'payer'
  styled?: boolean
}

export const Amount = ({ className, amount, currency, role, styled }: AmountProps) => {
  const displayAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  })
  const titleAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 18,
  })
  const classes = classNames('Address', { styled }, className)
  return (
    <Tooltip title={titleAmount !== displayAmount ? `${amount} ${currency.symbol}` : ''}>
      <div className={classes} color={role === 'payee' ? '#008556' : role === 'payer' ? '#DE1C22' : ''}>
        <h5>
          {role === 'payer' ? <>-</> : <>+</>}&nbsp;
          {displayAmount} {currency.symbol}
        </h5>
      </div>
    </Tooltip>
  )
}
