// Server component with generateStaticParams
export async function generateStaticParams() {
  return []
}

import SharePlayClient from './page-client'

export default function SharePlayPage({ params }: { params: { shareCode: string } }) {
  return <SharePlayClient params={params} />
}