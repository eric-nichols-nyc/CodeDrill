import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { FileLock } from "lucide-react";

export default function SensitiveDataPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Sensitive data</h1>
          <p className="mt-2 text-muted-foreground">
            Tokenization, masking, vaults, encryption, and HTTPS/TLS
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileLock className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Tokenization</CardTitle>
            </div>
            <CardDescription>
              Tokenization replaces sensitive data (e.g. card numbers, SSNs)
              with a non-sensitive token. The real value lives in a secure
              system; your app stores and transmits only the token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              If your database is breached, tokens are useless without the
              tokenization service. Use tokenization for payment data (Stripe
              tokens, etc.), PII you must reference but not display, and any
              data subject to PCI, HIPAA, or similar. Never store raw card
              numbers or full SSNs when a token will do.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`// Stripe: collect card on client, get token; send token to server
const { token } = await stripe.createToken(cardElement);
await fetch("/api/charge", {
  method: "POST",
  body: JSON.stringify({ tokenId: token.id }), // token, not card number
});

// Server: charge using token; never see or store the card number
const charge = await stripe.charges.create({
  amount: 1000,
  currency: "usd",
  source: tokenId,
});`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Masking & partial storage</CardTitle>
            <CardDescription>
              Mask sensitive values in the UI so users see only what they need
              (e.g. last four digits). Store only the minimal data required for
              display or reference—never full account or card numbers when
              avoidable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              Masking limits exposure on screens, in exports, and in logs.
              Partial storage (e.g. last four digits of a card or account
              number) lets you identify the account without holding the full
              value. The full number should live in a payment processor or
              vault; your app stores only the token and, if needed, a short
              suffix for display.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`// Mask for display: show only last 4 characters
function maskLastFour(value: string, visible = 4): string {
  if (value.length <= visible) return value;
  const suffix = value.slice(-visible);
  return "*".repeat(value.length - visible) + suffix;
}

// Example: card or account number in UI
const raw = "4111111111111111";
displayText = maskLastFour(raw); // "************1111"

// Store only what you need: last 4 for display, token for operations
// (full number never stored in your DB)
interface PaymentMethodDisplay {
  tokenId: string;      // from Stripe/vault; use for charges
  last4: string;        // last 4 digits only, for "Card ending in 1234"
  brand?: string;      // "visa", "amex"
}
// Never store: full card number, full SSN, or unmasked PII in logs.`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-party vaults</CardTitle>
            <CardDescription>
              A vault stores secrets and sensitive data; your app requests
              access via API. You never hold the raw data long-term.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              Examples: <strong>Stripe</strong> (payment tokens),{" "}
              <strong>AWS Secrets Manager</strong> /{" "}
              <strong>Parameter Store</strong>, <strong>HashiCorp Vault</strong>
              , <strong>Google Secret Manager</strong>,{" "}
              <strong>Vercel env</strong>. Benefits: centralized access control,
              audit logs, rotation, and reduced blast radius if your app is
              compromised. Use a vault for API keys, DB credentials, signing
              keys, and any secret you’d rather not store in env files or
              config.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`// Example: fetch secret from AWS Secrets Manager at runtime
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "us-east-1" });
const { SecretString } = await client.send(
  new GetSecretValueCommand({ SecretId: "prod/db-credentials" })
);
const creds = JSON.parse(SecretString);`}
            </pre>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Encryption</CardTitle>
            <CardDescription>
              Encrypt sensitive data at rest (in DB, backups) and in transit
              (over the network). Use strong algorithms and manage keys
              carefully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground text-sm">
              <strong>At rest:</strong> Encrypt columns or fields containing PII
              (e.g. AES-256-GCM). Store encryption keys in a vault or KMS, not
              next to the data. Many DBs support TDE (transparent data
              encryption) for the whole database. <strong>In transit:</strong>{" "}
              Use TLS (HTTPS) for all client–server and server–server traffic so
              data is encrypted on the wire. <strong>Key management:</strong>{" "}
              Rotate keys periodically; use different keys per environment;
              never hardcode keys.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
              {`// Example: encrypt before storing (Node crypto)
import { randomBytes, scryptSync, createCipheriv, createDecipheriv } from "crypto";

const ALG = "aes-256-gcm";
const key = scryptSync(process.env.ENCRYPTION_KEY!, "salt", 32);

function encrypt(plain: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALG, key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return iv.toString("hex") + ":" + tag.toString("hex") + ":" + enc.toString("hex");
}`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTTPS / TLS</CardTitle>
            <CardDescription>
              TLS encrypts data in transit between client and server. Without
              HTTPS, traffic can be intercepted or modified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Always serve your app over HTTPS in production. TLS provides
              confidentiality (eavesdroppers can’t read the data) and integrity
              (tampering is detectable). Use TLS for API calls, form
              submissions, and any request carrying credentials or sensitive
              data. Hosting platforms (Vercel, Netlify, etc.) typically provide
              HTTPS and redirect HTTP → HTTPS. For more, see the{" "}
              <a
                className="font-medium text-primary underline underline-offset-4"
                href="/https"
              >
                HTTPS page
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
