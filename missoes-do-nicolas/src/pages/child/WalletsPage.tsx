import { useMemo } from 'react'
import { useApp } from '../../hooks/useApp'
import { Card, Section } from '../../components/ui/Card'
import { WalletCard } from '../../components/child/WalletCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatEuro } from '../../utils/money'
import { totalBalance, walletBalances, weekMoney } from '../../utils/scoring'
import { formatDateTime } from '../../utils/date'

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  allowance: { label: 'Semanada', emoji: '📅' },
  extra_job: { label: 'Trabalho extra', emoji: '🧹' },
  spend: { label: 'Gasto', emoji: '🛍️' },
  transfer: { label: 'Transferência', emoji: '🔁' },
  saving: { label: 'Poupança', emoji: '🏦' },
  share_use: { label: 'Partilhar', emoji: '💝' },
  adjustment: { label: 'Ajuste dos pais', emoji: '✏️' },
}

export function WalletsPage() {
  const { state } = useApp()
  const balances = useMemo(() => walletBalances(state.transactions), [state.transactions])
  const money = weekMoney(state)
  const recent = [...state.transactions].reverse().slice(0, 12)

  return (
    <div className="space-y-7">
      <header className="px-1">
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Os meus cofrinhos</h1>
        <p className="text-sm font-bold text-ink-soft">
          Tenho {formatEuro(totalBalance(state.transactions))} no total.
        </p>
      </header>

      <Section title="Esta semana" emoji="💰" hint="A semanada não depende das estrelas.">
        <Card className="space-y-2.5">
          <Row label="Semanada" value={money.allowance} emoji="📅" />
          <Row label="Trabalhos extra aprovados" value={money.extras} emoji="🧹" />
          <div className="border-t border-black/10 pt-2.5">
            <Row label="Total da semana" value={money.total} emoji="✨" strong />
          </div>
          <p className="text-xs text-ink-soft">
            Este dinheiro entra nos cofrinhos quando a semana for fechada.
          </p>
        </Card>
      </Section>

      <Section title="Cofrinhos" emoji="🐷">
        <div className="grid gap-3 sm:grid-cols-3">
          {state.wallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} balance={balances[wallet.id]} />
          ))}
        </div>
      </Section>

      <Section title="Últimos movimentos" emoji="🧾">
        {recent.length === 0 ? (
          <EmptyState
            emoji="🪙"
            title="Ainda não há movimentos"
            description="Quando a primeira semana for fechada, o dinheiro aparece aqui."
          />
        ) : (
          <Card>
            <ul className="divide-y divide-black/5">
              {recent.map((transaction) => {
                const meta = TYPE_LABELS[transaction.type] ?? { label: transaction.type, emoji: '•' }
                const wallet = state.wallets.find((item) => item.id === transaction.wallet)
                return (
                  <li key={transaction.id} className="flex items-center gap-3 py-2.5">
                    <span className="text-xl" aria-hidden="true">
                      {meta.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{transaction.description}</p>
                      <p className="text-xs text-ink-soft">
                        {meta.label} · {wallet?.label} · {formatDateTime(transaction.date)}
                      </p>
                    </div>
                    <span
                      className={
                        transaction.amount < 0
                          ? 'shrink-0 font-black text-berry-700'
                          : 'shrink-0 font-black text-grow-700'
                      }
                    >
                      {transaction.amount < 0 ? '' : '+'}
                      {formatEuro(transaction.amount)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        )}
      </Section>
    </div>
  )
}

function Row({
  label,
  value,
  emoji,
  strong = false,
}: {
  label: string
  value: number
  emoji: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={strong ? 'font-extrabold' : 'font-bold text-ink-soft'}>
        <span aria-hidden="true">{emoji} </span>
        {label}
      </span>
      <span className={strong ? 'text-2xl font-black text-coin-700' : 'text-lg font-black'}>
        {formatEuro(value)}
      </span>
    </div>
  )
}
