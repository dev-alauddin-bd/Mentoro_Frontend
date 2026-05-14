import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us | Mentoro - Get in Touch",
  description: "Have questions or need support? Contact the Mentoro team. We're here to help you on your learning journey. Reach out via email, phone, or visit our office.",
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
