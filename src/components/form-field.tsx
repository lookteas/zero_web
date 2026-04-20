import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  label?: string;
  hint?: string;
  className?: string;
};

type InputProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    as?: "input";
  };

type TextareaProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: "textarea";
  };

type FormFieldProps = InputProps | TextareaProps;

export function FormField(props: FormFieldProps) {
  if (props.as === "textarea") {
    const { as, label, hint, className, ...textareaProps } = props;
    void as;

    return (
      <label className="block space-y-2">
        {label ? <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">{label}</span> : null}
        <textarea
          {...textareaProps}
          className={[
            "app-input min-h-[112px] px-4 py-3 text-[14px] leading-6 placeholder:text-[var(--foreground-soft)] md:min-h-28 md:text-sm md:leading-7",
            className ?? "",
          ].join(" ")}
        />
        {hint ? <span className="block text-[12px] leading-5 text-[var(--foreground-soft)]">{hint}</span> : null}
      </label>
    );
  }

  const { as, label, hint, className, ...inputProps } = props;
  void as;

  return (
    <label className="block space-y-2">
      {label ? <span className="block text-[13px] font-medium text-[var(--foreground)] md:text-sm">{label}</span> : null}
      <input
        {...inputProps}
        className={[
          "app-input min-h-[46px] px-4 py-3 text-[14px] placeholder:text-[var(--foreground-soft)] md:min-h-12 md:text-sm",
          className ?? "",
        ].join(" ")}
      />
      {hint ? <span className="block text-[12px] leading-5 text-[var(--foreground-soft)]">{hint}</span> : null}
    </label>
  );
}
