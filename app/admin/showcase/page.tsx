"use client";

import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { withAuth } from "@/utils/withAuth";

const DEFAULT_URL = "https://courtly.com.br";
const TEST_URL = "http://localhost:3000";

function ShowcasePage() {
  const { companyId } = useAuth();
  const [copied, setCopied] = useState(false);

  const showcaseLink = `${DEFAULT_URL}/showcase/${companyId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(showcaseLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(showcaseLink, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activePage="vitrine" />

      <div className="flex-1">
        <AdminHeader title="Minha Vitrine" />

        <main className="p-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Compartilhe sua vitrine</h2>
            <p className="text-sm text-muted-foreground">
              Aqui está o link da sua vitrine. Copie e encaminhe para seus clientes:
            </p>

            <div className="flex items-center gap-2">
              <Input value={showcaseLink} readOnly className="flex-1" />
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copiado!" : "Copiar"}
              </Button>
              <Button variant="outline" onClick={handleOpen}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver
              </Button>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default withAuth(ShowcasePage);
