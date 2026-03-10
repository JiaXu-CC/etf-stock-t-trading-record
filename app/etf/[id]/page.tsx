import { EtfDetailClient } from "@/components/EtfDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EtfDetailPage({ params }: PageProps) {
  return (
    <div className="app-shell">
      <main className="app-container">
        <EtfDetailClient etfId={params.id} />
      </main>
    </div>
  );
}

