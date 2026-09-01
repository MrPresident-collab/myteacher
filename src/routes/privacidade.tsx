import { Shield, Lock, Eye, FileText } from "lucide-react";

export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mb-4">
          <Shield className="size-6" />
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Política de Privacidade
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Última atualização: {new Date().toLocaleDateString("pt-AO", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="mt-12 space-y-8 rounded-[2rem] border border-[var(--border)] bg-white p-8 sm:p-12 text-[var(--foreground)] leading-relaxed shadow-sm">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <FileText className="size-5 text-[var(--primary)]" />
            1. Introdução e Compromisso
          </h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            A MyTeacher valoriza a privacidade dos seus utilizadores (alunos, professores e parceiros empresariais).
            Esta Política de Privacidade descreve como recolhemos, utilizamos, armazenamos e protegemos as suas informações
            pessoais em conformidade com as boas práticas internacionais de proteção de dados.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Eye className="size-5 text-[var(--primary)]" />
            2. Informações que Recolhemos
          </h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Recolhemos apenas as informações necessárias para prestar os serviços da plataforma:
          </p>
          <ul className="list-disc pl-6 text-sm text-[var(--muted)] space-y-2">
            <li><strong>Alunos:</strong> Nome completo, endereço de correio eletrónico, número de telefone/WhatsApp, línguas pretendidas, nível de conhecimento e preferências de aprendizagem.</li>
            <li><strong>Professores:</strong> Dados de identificação, biografia, fotografia de perfil, línguas ensinadas, qualificações académicas, certificados profissionais e documentos de identificação para verificação.</li>
            <li><strong>Empresas:</strong> Nome da organização, dados do ponto de contacto, dimensões da equipa e requisitos formativos.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Lock className="size-5 text-[var(--primary)]" />
            3. Separação de Documentos Privados
          </h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            No caso dos professores, os documentos confidenciais submetidos para efeitos de verificação (tais como bilhetes de identidade, passaportes ou certificados) <strong>NUNCA</strong> são tornados públicos no perfil do docente. O acesso a estes ficheiros é restrito exclusivamente aos administradores da MyTeacher através de armazenamento seguro encriptado (Supabase Storage).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">4. Finalidade do Tratamento de Dados</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Os dados recolhidos são utilizados para:
          </p>
          <ul className="list-disc pl-6 text-sm text-[var(--muted)] space-y-1.5">
            <li>Ligar alunos aos professores mais compatíveis e gerir turmas de até 5 alunos.</li>
            <li>Processar pedidos de informação e suporte ao cliente.</li>
            <li>Validar a autenticidade das candidaturas de professores e atribuir o selo de Verificação.</li>
            <li>Enviar notificações operacionais relevantes sobre aulas, vagas e novidades.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">5. Segurança e Armazenamento</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Implementamos mecanismos de segurança de nível de produção, incluindo encriptação de tráfego (HTTPS/SSL), Row Level Security (RLS) ao nível da base de dados Supabase e autenticação protegida por palavra-passe encriptada. Não partilhamos nem vendemos os seus dados a terceiros.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold">6. Os Seus Direitos</h2>
          <p className="text-sm text-[var(--muted)] leading-7">
            Tem o direito de aceder, retificar, atualizar ou solicitar a eliminação dos seus dados pessoais em qualquer momento.
            Para exercer os seus direitos ou esclarecer dúvidas, contacte-nos através de <a href="mailto:geral@myteacher.ao" className="text-[var(--primary)] underline font-medium">geral@myteacher.ao</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
