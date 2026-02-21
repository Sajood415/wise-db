"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

type ReCaptchaProps = ComponentProps<typeof ReCAPTCHA>;

export function RecaptchaWidget(props: {
  value: string | null;
  onChange: (token: string | null) => void;
  className?: string;
  size?: ReCaptchaProps["size"];
}) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  if (!siteKey) return null;

  return (
    <div className={props.className}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={(token) => props.onChange(token)}
        onExpired={() => props.onChange(null)}
        size={props.size}
      />
    </div>
  );
}

