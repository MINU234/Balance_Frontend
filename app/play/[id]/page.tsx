// Server component with generateStaticParams
export async function generateStaticParams() {
  // 빈 배열 반환 - Azure에서 동적으로 처리
  return []
}

// Client component import
import PlayPageClient from './page-client'

export default function PlayPage({ params }: { params: { id: string } }) {
  return <PlayPageClient params={params} />
}