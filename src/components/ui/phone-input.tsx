"use client";

import { useState } from "react";
import ReactPhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  name: string;
  defaultValue?: string;
}

export function PhoneInput({ name, defaultValue }: PhoneInputProps) {
  const [value, setValue] = useState<string>(defaultValue ?? "");

  return (
    <div className="phone-input-wrapper">
      <input type="hidden" name={name} value={value ?? ""} />
      <ReactPhoneInput
        international
        defaultCountry="PK"
        value={value}
        onChange={(v) => setValue(v ?? "")}
        className="phone-input"
      />
    </div>
  );
}
