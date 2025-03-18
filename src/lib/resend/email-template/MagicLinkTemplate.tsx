import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  EmailOtpType,
  GenerateEmailChangeLinkParams,
} from "@supabase/supabase-js";
import { URL } from "url";
import { contentMap } from "../data/magic-lin-contents";

interface MagicLinkEmailProps {
  magicLink: URL;
  type: EmailOtpType | GenerateEmailChangeLinkParams["type"];
}

export const MagicLinkTemplate = ({ magicLink, type }: MagicLinkEmailProps) => {
  const content = contentMap[type];

  return (
    <Html>
      <Head />
      <Preview>{content.title} - GPT-Wrapper</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          {/* Header */}
          <Heading style={styles.header}>GPT-Wrapper</Heading>

          {/* Main Content */}
          <Section style={styles.content}>
            <Heading as="h2" style={styles.h2}>
              {content.title}
            </Heading>
            <Text style={styles.text}>
              Click the button below to proceed.
              <br />
              This link will expire in <strong>2 hours</strong> and can only be
              used once.
            </Text>

            {/* Login Button */}
            <Link
              role="button"
              href={magicLink.toString()}
              style={styles.button}
            >
              {content.buttonText}
            </Link>

            {/* Alternative link */}
            <Text style={styles.text}>{content.fallbackText}</Text>
            <Link href={magicLink.toString()} style={styles.link}>
              {magicLink.toString()}
            </Link>

            {/* Security Note */}
            <Text style={styles.footerText}>
              If you did not request this, you can safely ignore this email.
            </Text>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Text style={styles.footerTextCenter}>
            Sent by{" "}
            <Link href="https://gpt-wrapper.app" style={styles.link}>
              GPT-Wrapper
            </Link>
          </Text>

          <Text style={styles.footerLinks}>
            <Link href="https://gpt-wrapper.app/settings" style={styles.link}>
              Email settings
            </Link>{" "}
            •{" "}
            <Link href="https://gpt-wrapper.app/help" style={styles.link}>
              Help center
            </Link>{" "}
            •{" "}
            <Link href="https://gpt-wrapper.app/privacy" style={styles.link}>
              Privacy policy
            </Link>{" "}
            •{" "}
            <Link href="https://gpt-wrapper.app/terms" style={styles.link}>
              Terms of service
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// **Inline Styles for Email Rendering**
const styles = {
  main: {
    backgroundColor: "#ffffff",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    padding: "20px",
  },
  container: {
    maxWidth: "440px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9fafb", // Same as `bg-card`
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#1e293b", // Same as `text-primary`
  },
  content: {
    textAlign: "left" as const,
  },
  h2: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#1e293b", // Same as `text-primary`
  },
  text: {
    fontSize: "14px",
    color: "#475569", // Same as `text-muted-foreground`
    marginBottom: "16px",
  },
  button: {
    backgroundColor: "#16a34a", // Same as `bg-primary`
    color: "#ffffff",
    fontSize: "16px",
    padding: "12px 24px",
    textDecoration: "none",
    borderRadius: "6px",
    display: "inline-block",
    textAlign: "center" as const,
    fontWeight: "bold",
    marginBottom: "16px",
  },
  link: {
    color: "#16a34a", // Same as `text-accent`
    textDecoration: "underline",
    wordBreak: "break-word" as const,
    fontSize: "14px",
  },
  footerText: {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
    textAlign: "left" as const,
  },
  footerTextCenter: {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
    textAlign: "center" as const,
  },
  footerLinks: {
    fontSize: "12px",
    color: "#888",
    marginTop: "8px",
    textAlign: "center" as const,
  },
  divider: {
    borderTop: "1px solid #ddd",
    margin: "20px 0",
  },
};

export default MagicLinkTemplate;
