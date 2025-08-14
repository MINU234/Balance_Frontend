// Server component with generateStaticParams
export async function generateStaticParams() {
  return []
}

import ResultsPageClient from './page-client'

export default function ResultsPage({ params }: { params: { sessionId: string } }) {
  return <ResultsPageClient params={params} />
}